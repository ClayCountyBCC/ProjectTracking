using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dapper;
using System.Data;

namespace ProjectTracking
{
  public class Milestone
  {
    public int id { get; set; } = -1;
    public int project_id { get; set; } = -1;
    public string name { get; set; } = "";
    public int display_order { get; set; } = -1;

    public Milestone()
    {
      
    }


    public static List<Milestone> GetAllMilestones()
    {
      string query = @"
        SELECT 
          id,
          project_id,
          name,
          display_order
        FROM milestone
        ORDER BY project_id, display_order";

      return Constants.Get_Data<Milestone>(query);
    }

    private bool Save()
    {
      string sql = @"
        INSERT INTO milestone (project_id, name, display_order)
        VALUES (@project_id, @name, @display_order);";
      return Constants.Save_Data<Milestone>(sql, this);
    }

    public static bool SaveAll(int project_id, List<Milestone> milestones)
    {
      ClearMilestones(project_id);
      foreach(Milestone m in milestones)
      {
        m.project_id = project_id;        
        m.Save();
      }
      return true;
    }

    private static bool ClearMilestones(int project_id)
    {
      var dp = new DynamicParameters();
      dp.Add("@project_id", project_id);
      string sql = @"
        DELETE
        FROM milestone
        WHERE project_id = @project_id;";
      return Constants.Exec_Query(sql, dp) != -1;

    }

  }
}