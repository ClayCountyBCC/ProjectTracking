using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Routing;

namespace ProjectTracking
{
  public class WebApiApplication : System.Web.HttpApplication
  {
    protected void Application_Start()
    {
      GlobalConfiguration.Configure(WebApiConfig.Register);
      var userlist = new Dictionary<int, string>();
      userlist.Add(1234, "ALL");
      var test = userlist[1234];
    }
  }
}
