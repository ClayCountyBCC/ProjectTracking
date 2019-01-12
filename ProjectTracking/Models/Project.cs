using System;
using System.Collections.Generic;
using Dapper;
using System.Linq;
using System.Web;

namespace ProjectTracking
{
  public class Project
  {
    public int project_id { get; set; } = -1;
    public string project_name { get; set; } = "";
    public string department { get; set; } = "";
    public string timeline { get; set; } = "";
    public bool commissioner_share { get; set; } = false;
    public bool completed { get; set; } = false;
    public DateTime date_completed { get; set; }
    public DateTime last_updated { get; set; }
    public List<Comment> project_comments { get; set; }
    public List<Milestone> project_milestones { get; set; }

    public Project()
    {
      
    }
    public static List<Project> GetProjects(int project_id = -1)
    {
      var projectList  = GetRawProjectsList(project_id);
      foreach(var p in projectList)
      {
        p.GetProjectComments();
        p.GetProjectMilestones();
      }
      
      return new List<Project>();
    }

    public static List<Project> GetRawProjectsList(int project_id = -1)
    {
      var param = new DynamicParameters();

      
      var query = @"
        USE ProjectTracking;

        SELECT DISTINCT 
           [id]
          ,[project_name]
          ,[department]
          ,[timeline]
          ,[commissioner_share]
          ,[completed]
          ,[date_completed]
          ,[last_updated]
        FROM[dbo].[project]
      ";
      // TODO: include the user access dept_approval_list to only return those they can edit upon initial load.
      if (project_id > 0)
      {
        param.Add("@project_id", project_id);
        query += "\nwhere id = @project_id";
      }
      
     

      return new List<Project>();

    }


    public void GetProjectComments()
    {
      
      project_comments = new List<Comment>();
    }

    public void GetProjectMilestones()
    {

      project_milestones = new List<Milestone>();
    }

    public string Validate()
    {
      var existingProject = GetProjects(project_id).First();

      if (existingProject == null) return "There was an error validating the project you are trying to update";

      if (this == existingProject) return "Project is already up to date";

      
      else { return "There was an error validating the project you are trying to update"; }
    }

    public static Project UpdateProject(Project existingProject)
    {


      return existingProject;
    }

    public static Dictionary<int, List<string>> GetUserAccessDictionary()
    {
      return GetCachedUserAccessDictionary();
    }

    public static Dictionary<int, List<string>> GetCachedUserAccessDictionary()
    {
      return (Dictionary<int, List<string>>)MyCache.GetItem("useraccess");
    }
  }
}