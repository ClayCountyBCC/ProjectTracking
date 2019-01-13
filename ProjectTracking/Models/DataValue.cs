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

    public static List<DataValue> Get()
    {
      string sql = @"
        SELECT
          department_code Value,
          department_description Label
        FROM department
        ORDER BY department_description;
      ";
      return Constants.Get_Data<DataValue>(sql);
    }
  }
}