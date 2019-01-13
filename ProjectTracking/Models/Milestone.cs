using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectTracking
{
  public class Milestone
  {
    public int project_id { get; set; } = -1;
    public string name { get; set; } = "";
    public int display_order { get; set; } = -1;

    public Milestone()
    {
      
    }
  }
}