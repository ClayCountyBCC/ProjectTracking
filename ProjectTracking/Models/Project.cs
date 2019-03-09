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

    public Project()
    {
      
    }
    public static List<Project> GetProjects(int employee_id)
    {
      var projects  = GetAllProjects(employee_id);
      var comments = Comment.GetAllComments();
      var milestones = Milestone.GetAllMilestones();
      foreach(var p in projects)
      {
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
          P.department_id,
          P.funding_id,
          P.timeline,
          P.commissioner_share,
          P.infrastructure_share,
          P.legislative_tracking,
          P.completed,
          P.date_completed,
          ISNULL(D.date_last_updated, P.added_on) date_last_updated
        FROM project P
        LEFT OUTER JOIN user_department U ON 
          P.department_id = U.department_id
          AND U.employee_id = @employee_id
        LEFT OUTER JOIN DateUpdated D ON 
          D.project_id = P.id";
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
      dp.Add("@funding_id", funding_id);
      dp.Add("@timeline", timeline);
      dp.Add("@commissioner_share", commissioner_share);
      dp.Add("@infrastructure_share", infrastructure_share);
      dp.Add("@legislative_tracking", legislative_tracking);
      dp.Add("@completed", completed);
      dp.Add("@added_by", added_by);

      string query = @"
        INSERT INTO project (
          project_name, 
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
          @department_id, 
          @funding_id,
          @timeline, 
          @commissioner_share, 
          @infrastructure_share,
          @legislative_tracking,
          @completed, 
          GETDATE(), 
          @added_by
        );
      
        SET @project_id = @@IDENTITY;";
      int i = Constants.Exec_Query(query, dp);
      if (i == -1) return false;
      id = dp.Get<int>("@project_id");
      // now let's add the comment / milestones
      Comment.Save(ua, id, comment);

      Milestone.SaveAll(id, milestones);
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
          SET project_name = @project_name,
            department_id = @department_id,
            funding_id = @funding_id,
            timeline = @timeline,
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
          SET project_name = @project_name,
            department_id = @department_id,
            funding_id = @funding_id,
            timeline = @timeline,
            commissioner_share = @commissioner_share,
            infrastructure_share = @infrastructure_share,
            legislative_tracking = @legislative_tracking,
            completed = @completed
        WHERE 
          id=@id";
      }
      // now let's add the comment / milestones
      Comment.Save(ua, id, comment);

      Milestone.SaveAll(id, milestones);


      return Constants.Save_Data<Project>(query, this);
    }

  }
}
