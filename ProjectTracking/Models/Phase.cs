using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dapper;

namespace ProjectTracking
{
  public class Phase
  {
    public int project_id { get; set; } = -1;
    public int phase_order { get; set; } = -1;
    public string name { get; set; } = "";
    public DateTime? started_on { get; set; }
    public DateTime? estimated_completion { get; set; }
    public DateTime? completed_on { get; set; }

    public Phase()
    {
    }

    public static List<Phase> GetAll()
    {
      string query = @"
        SELECT
          project_id
          ,phase_order
          ,name
          ,started_on
          ,estimated_completion
          ,completed_on
        FROM
          phases
        ORDER  BY
          project_id
          ,phase_order ";
      return Constants.Get_Data<Phase>(query);
    }

    public static List<Phase> Get(int project_id)
    {
      var param = new DynamicParameters();
      param.Add("@project_id", project_id);
      string query = @"
        SELECT
          project_id
          ,phase_order
          ,name
          ,started_on
          ,estimated_completion
          ,completed_on
        FROM
          phases
        WHERE
          project_id = @project_id
        ORDER  BY
          project_id
          ,phase_order ";
      return Constants.Get_Data<Phase>(query, param);
    }

    private bool Save()
    {
      string sql = @"
        INSERT INTO phases (project_id, phase_order, name, started_on, estimated_completion, completed_on)
        VALUES (@project_id, @phase_order, @name, @started_on, @estimated_completion, @completed_on);";
      return Constants.Save_Data<Phase>(sql, this);
    }

    public static bool SaveAll(int project_id, List<Phase> phases)
    {
      ClearPhases(project_id);
      foreach (Phase p in phases)
      {
        p.project_id = project_id;
        p.Save();
      }
      return true;
    }

    private static bool ClearPhases(int project_id)
    {
      var dp = new DynamicParameters();
      dp.Add("@project_id", project_id);
      string sql = @"
        DELETE
        FROM phases
        WHERE project_id = @project_id;";
      return Constants.Exec_Query(sql, dp) != -1;

    }

  }
}