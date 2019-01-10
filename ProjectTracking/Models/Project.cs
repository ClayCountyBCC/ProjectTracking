using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectTracking
{
  public class Project
  {
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

    public static List<Project> GetRawProjectList(int project_id = -1)
    {

      var query = @"
      USE ProjectTracking;

      SELECT[id]
        ,[project_name]
        ,[department]
        ,[timeline]
        ,[commissioner_share]
        ,[completed]
        ,[date_completed]
        ,[last_updated]
      FROM[dbo].[project]
      ";

      if (project_id > 0)
      {
        query += "\nwhere id = @project_id";
      }
      
    }
  }
}