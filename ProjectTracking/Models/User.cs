using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectTracking
{
  public class User
  {

    public int employee_id { get; set; }
    public int department_id { get; set; }
    
    public User()
    {
    }


    public static List<User> GetUserDepartments()
    {
      string sql = @"
        SELECT
          employee_id,
          department_id
        FROM user_department 
        ORDER BY employee_id
      ";
      return Constants.Get_Data<User>(sql);
    }

    public static List<User> GetCachedUserDepartments()
    {
      return (List<User>)MyCache.GetItem("userdepartments");
    }


  }
}