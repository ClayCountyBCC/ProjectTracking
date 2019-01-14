using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectTracking
{
  public class DataValue
  {
    public string Label { get; set; }
    public string Value { get; set; }
    public DataValue()
    {
    }

    public static List<DataValue> GetDepartments()
    {
      string sql = @"
        SELECT
          id Value,
          department Label
        FROM department
        ORDER BY department;
      ";
      return Constants.Get_Data<DataValue>(sql);
    }

    public static List<DataValue> GetCachedDepartments()
    {
      return (List<DataValue>)MyCache.GetItem("departments");
    }

    public static List<DataValue> GetMyDepartments(int employee_id)
    {
      var departments = DataValue.GetCachedDepartments();

      var mydepartments = (from u in User.GetCachedUserDepartments()
                           where u.employee_id == employee_id
                           select u.department_id.ToString()).ToList();
      return (from d in departments
              where mydepartments.Contains(d.Value)
              select d).ToList();
    }


  }
}