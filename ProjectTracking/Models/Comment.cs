using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dapper;

namespace ProjectTracking
{
  public class Comment
  {
    public int id { get; set; } = -1;
    public int project_id { get; set; } = -1;
    public string comment { get; set; } = "";
    public bool update_only { get; set; } = false;
    public string added_by { get; set; } = "";
    public DateTime added_on { get; set; }
    public bool added_by_county_manager { get; set; } = false;

    public Comment()
    {
    }

    public static bool Save(UserAccess ua, int project_id, string commentToSave)
    {
      commentToSave = commentToSave.Trim();
      if (commentToSave.Length == 0) return true;

      var cm = Constants.GetCachedCountyManager();

      var c = new Comment
      {
        comment = commentToSave,
        project_id = project_id,
        added_by = ua.user_name,
        added_by_county_manager = (ua.employee_id == cm)
      };

      var query = @"
        USE ProjectTracking;

        INSERT INTO Comment
        (project_id, comment, update_only, added_by, added_by_county_manager)
        VALUES
        (@project_id, @comment, @update_only, @added_by, @added_by_county_manager)";

      return Constants.Save_Data<Comment>(query, c);
    }

    public static List<Comment> GetAllComments()
    {
      string query = @"
      SELECT 
        id,
        project_id,
        comment,
        update_only,
        added_by,
        added_on,
        by_county_manager
      FROM comment
      ORDER BY project_id, id;";

      return Constants.Get_Data<Comment>(query);
    }

  }
}