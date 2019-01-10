using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectTracking
{
  public class Comment
  {

    public int project_id { get; set; } = -1;
    public string comment { get; set; } = "";
    public bool update_only { get; set; } 
    public string added_by { get; set; } = "";
    public DateTime added_on { get; set; } = null;
    public bool added_by_county_manager { get; set; }

    public Comment()
    {
      
    }
  }
}