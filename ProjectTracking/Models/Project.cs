using System;
using System.Collections.Generic;
using Dapper;
using System.Linq;
using System.Data;
using System.Data.SqlClient;
using System.Web;

namespace ProjectTracking
{
  public class Project
  {
    public enum PriorityLevel: int
    {
      Low = 0,
      Normal = 1,
      High = 2
    }

    public int id { get; set; } = -1;
    public string project_name { get; set; } = "";
    public int department_id { get; set; } = -1;
    public int funding_id { get; set; } = 1;
    public string timeline { get; set; } = "";
    public bool commissioner_share { get; set; } = false;
    public bool infrastructure_share { get; set; } = false;
    public bool legislative_tracking { get; set; } = false;
    public bool completed { get; set; } = false;
    public string comment { get; set; } = "";
    public DateTime date_completed { get; set; } = DateTime.MinValue;
    public DateTime date_last_updated { get; set; } = DateTime.MinValue;
    public List<Comment> comments { get; set; } = new List<Comment>();
    public List<Milestone> milestones { get; set; } = new List<Milestone>();
    public string added_by { get; set; } = "";
    public bool can_edit { get; set; }
    public bool needs_attention { get; set; } = false;
    //public string phase_1_name { get; set; } = "";
    //public string phase_2_name { get; set; } = "";
    //public string phase_3_name { get; set; } = "";
    //public string phase_4_name { get; set; } = "";
    //public string phase_5_name { get; set; } = "";
    //public DateTime? phase_1_start { get; set; } = null;
    //public DateTime? phase_1_completion { get; set; } = null;
    //public DateTime? phase_2_start { get; set; } = null;
    //public DateTime? phase_2_completion { get; set; } = null;
    //public DateTime? phase_3_start { get; set; } = null;
    //public DateTime? phase_3_completion { get; set; } = null;
    //public DateTime? phase_4_start { get; set; } = null;
    //public DateTime? phase_4_completion { get; set; } = null;
    //public DateTime? phase_5_start { get; set; } = null;
    //public DateTime? phase_5_completion { get; set; } = null;
    public List<Phase> phases { get; set; } = new List<Phase>();

    public DateTime? estimated_completion_date { get; set; } = DateTime.MinValue;
    public PriorityLevel priority { get; set; } = PriorityLevel.Normal;

    public Project()
    {
      
    }
    public static List<Project> GetProjects(int employee_id)
    {
      var projects  = GetAllProjects(employee_id);
      var phases = Phase.GetAll();
      var comments = Comment.GetAllComments();
      var milestones = Milestone.GetAllMilestones();
      foreach(var p in projects)
      {
        p.phases = (from ph in phases
                    where ph.project_id == p.id
                    orderby ph.phase_order ascending
                    select ph).ToList();
        p.milestones = (from m in milestones
                        where m.project_id == p.id
                        select m).ToList();
        p.comments = (from c in comments
                      where c.project_id == p.id
                      select c).ToList();        
      }
      return projects;
    }

    private static List<Project> GetAllProjects(int employee_id)
    {
      var param = new DynamicParameters();
      param.Add("@employee_id", employee_id);
      
      var query = @"
        USE ProjectTracking;

        WITH DateUpdated AS (
          SELECT
            project_id,
            MAX(added_on) date_last_updated
          FROM comment
          GROUP BY project_id
        )

        SELECT
          CASE WHEN U.department_id IS NOT NULL THEN 1 ELSE 0 END can_edit,
          P.id id,
          P.project_name,
          P.priority,
          P.needs_attention,
          P.estimated_completion_date,
          P.department_id,
          P.funding_id,
          P.timeline,
          P.commissioner_share,
          P.infrastructure_share,
          P.legislative_tracking,
          P.completed,
          P.date_completed,
          ISNULL(PD.phase_1_name, '') phase_1_name,
          ISNULL(PD.phase_2_name, '') phase_2_name,
          ISNULL(PD.phase_3_name, '') phase_3_name,
          ISNULL(PD.phase_4_name, '') phase_4_name,
          ISNULL(PD.phase_5_name, '') phase_5_name,
          PD.phase_1_start,
          PD.phase_1_completion,
          PD.phase_2_start,
          PD.phase_2_completion,
          PD.phase_3_start,
          PD.phase_3_completion,
          PD.phase_4_start,
          PD.phase_4_completion,
          PD.phase_5_start,
          PD.phase_5_completion,
          ISNULL(D.date_last_updated, P.added_on) date_last_updated
        FROM project P
        LEFT OUTER JOIN phase_dates PD ON P.id = PD.project_id
        LEFT OUTER JOIN user_department U ON 
          P.department_id = U.department_id
          AND U.employee_id = @employee_id
        LEFT OUTER JOIN DateUpdated D ON 
          D.project_id = P.id
        INNER JOIN department DEP ON P.department_id = DEP.id
        ORDER BY DEP.department, P.id
";
      return Constants.Get_Data<Project>(query, param);
    }

    public static Project GetSpecificProject(int project_id, int employee_id)
    {
      var projects = GetProjects(employee_id);
      var project = (from p in projects
                     where p.id == project_id
                     select p).ToList();


      if (project.Count() != 1)
      {
        return null;
      }
      return project.First();
    }


    public string Validate(int employee_id, Project existingProject)
    {
      var mydepartments = DataValue.GetMyDepartments(employee_id);

      if(existingProject != null)
      {
        //var found = GetSpecificProject(project_id, employee_id);

        if((from d in mydepartments
           where d.Value == existingProject.department_id.ToString()
           select d).Count() == 0)
        {
          return "You do not have access to this project's department.";
        }
      }

      if ((from d in mydepartments
           where d.Value == department_id.ToString()
           select d).Count() == 0)
      {
        return "You do not have access to this project's department.";
      }
      return "";
    }

    public bool Save(UserAccess ua)
    {
      added_by = ua.user_name;

      var dp = new DynamicParameters();
      dp.Add("@project_id", dbType: DbType.Int32, direction: ParameterDirection.Output);
      dp.Add("@project_name", project_name);
      dp.Add("@department_id", department_id);
      dp.Add("@priority", priority);
      dp.Add("@needs_attention", needs_attention);
      //dp.Add("@estimated_completion_date", estimated_completion_date == DateTime.MinValue ? (DateTime?)null : estimated_completion_date);
      dp.Add("@estimated_completion_date", estimated_completion_date);
      dp.Add("@funding_id", funding_id);
      dp.Add("@timeline", timeline);
      dp.Add("@commissioner_share", commissioner_share);
      dp.Add("@infrastructure_share", infrastructure_share);
      dp.Add("@legislative_tracking", legislative_tracking);
      dp.Add("@completed", completed);
      dp.Add("@added_by", added_by);
      //dp.Add("@phase_1_name", phase_1_name);
      //dp.Add("@phase_2_name", phase_2_name);
      //dp.Add("@phase_3_name", phase_3_name);
      //dp.Add("@phase_4_name", phase_4_name);
      //dp.Add("@phase_5_name", phase_5_name);
      //dp.Add("@phase_1_start", phase_1_start);
      //dp.Add("@phase_1_completion", phase_1_completion);
      //dp.Add("@phase_2_start", phase_2_start);
      //dp.Add("@phase_2_completion", phase_2_completion);
      //dp.Add("@phase_3_start", phase_3_start);
      //dp.Add("@phase_3_completion", phase_3_completion);
      //dp.Add("@phase_4_start", phase_4_start);
      //dp.Add("@phase_4_completion", phase_4_completion);
      //dp.Add("@phase_5_start", phase_5_start);
      //dp.Add("@phase_5_completion", phase_5_completion);

      string query = @"
        INSERT INTO project (
          project_name, 
          priority,
          needs_attention,
          estimated_completion_date,
          department_id, 
          funding_id,
          timeline, 
          commissioner_share, 
          infrastructure_share,
          legislative_tracking,
          completed, 
          added_on, 
          added_by
        )
        VALUES (
          @project_name, 
          @priority,
          @needs_attention,
          @estimated_completion_date,
          @department_id, 
          @funding_id,
          @timeline, 
          @commissioner_share, 
          @infrastructure_share,
          @legislative_tracking,
          @completed, 
          GETDATE(), 
          @added_by
        );";
      
        //SET @project_id = SCOPE_IDENTITY();

        //INSERT INTO [dbo].[phase_dates]
        //  ([project_id]
        //  ,[phase_1_name]
        //  ,[phase_2_name]
        //  ,[phase_3_name]
        //  ,[phase_4_name]
        //  ,[phase_5_name]
        //  ,[phase_1_start]
        //  ,[phase_1_completion]
        //  ,[phase_2_start]
        //  ,[phase_2_completion]
        //  ,[phase_3_start]
        //  ,[phase_3_completion]
        //  ,[phase_4_start]
        //  ,[phase_4_completion]
        //  ,[phase_5_start]
        //  ,[phase_5_completion])
        // VALUES
        //  (@project_id
        //  ,@phase_1_name
        //  ,@phase_2_name
        //  ,@phase_3_name
        //  ,@phase_4_name
        //  ,@phase_5_name
        //  ,@phase_1_start
        //  ,@phase_1_completion
        //  ,@phase_2_start
        //  ,@phase_2_completion
        //  ,@phase_3_start
        //  ,@phase_3_completion
        //  ,@phase_4_start
        //  ,@phase_4_completion
        //  ,@phase_5_start
        //  ,@phase_5_completion); ";
      int i = Constants.Exec_Query(query, dp);
      if (i == -1) return false;
      id = dp.Get<int>("@project_id");
      // now let's add the comment / milestones
      Comment.Save(ua, id, comment);

      Milestone.SaveAll(id, milestones);
      Phase.SaveAll(id, phases);
      return true;
    }

    public bool Update(UserAccess ua, Project existingProject)
    {
      string query = "";

      if(!existingProject.completed && completed)
      {
        // we need to update the completed date too.
        query = @"
        UPDATE project
          SET 
            project_name = @project_name,
            priority = @priority,
            needs_attention = @needs_attention,
            estimated_completion_date = @estimated_completion_date,
            department_id = @department_id,
            funding_id = @funding_id,
            commissioner_share = @commissioner_share,
            infrastructure_share = @infrastructure_share,
            legislative_tracking = @legislative_tracking,
            completed = @completed,
            date_completed = GETDATE()
        WHERE 
          id=@id";
      }
      else
      {
        query = @"
        UPDATE project
          SET 
            project_name = @project_name,
            department_id = @department_id,
            funding_id = @funding_id,
            commissioner_share = @commissioner_share,
            infrastructure_share = @infrastructure_share,
            legislative_tracking = @legislative_tracking,
            completed = @completed,
            priority = @priority,
            needs_attention = @needs_attention,
            estimated_completion_date = @estimated_completion_date            
        WHERE 
          id=@id";
      }
//      query += @"

//        DELETE 
//        FROM phase_dates
//        WHERE
//          project_id=@id;

//        INSERT INTO [dbo].[phase_dates]
//          ([project_id]
//          ,[phase_1_name]
//          ,[phase_2_name]
//          ,[phase_3_name]
//          ,[phase_4_name]
//          ,[phase_5_name]
//          ,[phase_1_start]
//          ,[phase_1_completion]
//          ,[phase_2_start]
//          ,[phase_2_completion]
//          ,[phase_3_start]
//          ,[phase_3_completion]
//          ,[phase_4_start]
//          ,[phase_4_completion]
//          ,[phase_5_start]
//          ,[phase_5_completion])
//         VALUES
//          (@id
//          ,@phase_1_name
//          ,@phase_2_name
//          ,@phase_3_name
//          ,@phase_4_name
//          ,@phase_5_name
//          ,@phase_1_start
//          ,@phase_1_completion
//          ,@phase_2_start
//          ,@phase_2_completion
//          ,@phase_3_start
//          ,@phase_3_completion
//          ,@phase_4_start
//          ,@phase_4_completion
//          ,@phase_5_start
//          ,@phase_5_completion);
//";
      // now let's add the comment / milestones
      Comment.Save(ua, id, comment);

      Milestone.SaveAll(id, milestones);
      Phase.SaveAll(id, phases);

      return Constants.Save_Data<Project>(query, this);
    }

    public static int GetProjectDepartment(int project_id)
    {
      // this function is going to return the department id
      // associated to this comment's project.
      var dp = new DynamicParameters();
      dp.Add("@project_id", project_id);

      string query = @"
        SELECT
          department_id
        FROM project
        WHERE id=@project_id";
      return Constants.Exec_Scalar<int>(query, dp);
    }

  }
}
