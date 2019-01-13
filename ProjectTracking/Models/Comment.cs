using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dapper;

namespace ProjectTracking
{
  public class Comment
  {

    public int project_id { get; set; } = -1;
    public string comment { get; set; } = "";
    public bool update_only { get; set; } = false;
    public string added_by { get; set; } = "";
    public DateTime added_on { get; set; }
    public bool added_by_county_manager { get; set; } = false;

    public Comment()
    {
      
    }

    public string Save()
    {
      var param = new DynamicParameters();
      param.Add("@comment", comment);

      var query = @"
      
        USE ProjectTracking;

        INSERT INTO Comment
        (project_id, comment, update_only, added_by, added_by_county_manager)
        VALUES
        (@project_id, @comment, @update_only, @added_by, @added_by_county_manager)

      ";

      try
      {
        var i = Constants.Exec_Query(query, param);
        if(i == 1)
        {
          return "success";
        }
      }
      catch(Exception ex)
      {

        new ErrorLog(ex, query);
      }
      
      return null;

    }
  }
}