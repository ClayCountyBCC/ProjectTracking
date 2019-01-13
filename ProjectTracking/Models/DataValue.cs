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

    public static List<DataValue> Get(string dataType)
    {
      string sql = @"
      
      ";
      return Constants.Get_Data<DataValue>(sql);
    }
  }
}