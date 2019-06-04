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
    public bool by_county_manager { get; set; } = false;

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
        by_county_manager = (ua.employee_id == cm)
      };

      var query = @"
        USE ProjectTracking;

        INSERT INTO Comment
        (project_id, comment, update_only, added_by, by_county_manager)
        VALUES
        (@project_id, @comment, @update_only, @added_by, @by_county_manager)";

      return Constants.Save_Data<Comment>(query, c);
    }

    public static bool UpdateOnly(UserAccess ua, int project_id)
    {
      var cm = Constants.GetCachedCountyManager();

      var c = new Comment
      {
        comment = "",
        update_only = true,
        project_id = project_id,
        added_by = ua.user_name,
        by_county_manager = (ua.employee_id == cm)
      };

      var query = @"
        USE ProjectTracking;

        INSERT INTO Comment
        (project_id, comment, update_only, added_by, by_county_manager)
        VALUES
        (@project_id, @comment, @update_only, @added_by, @by_county_manager)";

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
      WHERE is_deleted=0
      ORDER BY project_id, id;";

      return Constants.Get_Data<Comment>(query);
    }

    public static string ValidateDeleteCommentAccess(int employee_id, int comment_id)
    {
      var mydepartments = DataValue.GetMyDepartments(employee_id);
      int commentDepartment = Comment.GetCommentDepartment(comment_id);

      if ((from d in mydepartments
           where d.Value == commentDepartment.ToString()
           select d).Count() == 0)
      {
        return "You do not have access to this project's department.";
      }
      return "";
    }

    public static string ValidateCommentAddAccess(int employee_id, int project_id)
    {
      var mydepartments = DataValue.GetMyDepartments(employee_id);
      int projectDepartment = Project.GetProjectDepartment(project_id);

      if ((from d in mydepartments
           where d.Value == projectDepartment.ToString()
           select d).Count() == 0)
      {
        return "You do not have access to this project's department.";
      }
      return "";
    }

    public static bool DeleteComment(int comment_id, string username)
    {
      var dp = new DynamicParameters();
      dp.Add("@comment_id", comment_id);
      dp.Add("@deleted_by", username);

      string query = @"
        USE ProjectTracking;
        UPDATE comment
          SET 
            is_deleted=1
            ,deleted_by=@deleted_by
            ,deleted_on=GETDATE()
        WHERE id = @comment_id;";
      return Constants.Exec_Query(query, dp) != -1;
    }

    public static int GetCommentDepartment(int comment_id)
    {
      // this function is going to return the department id
      // associated to this comment's project.
      var dp = new DynamicParameters();
      dp.Add("@comment_id", comment_id);

      string query = @"
        USE ProjectTracking;
        SELECT
          P.department_id
        FROM comment C
        INNER JOIN project P ON C.project_id = P.id
        WHERE C.id=@comment_id";
      return Constants.Exec_Scalar<int>(query, dp);
    }

  }
}