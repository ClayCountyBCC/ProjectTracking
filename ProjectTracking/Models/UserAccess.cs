using System;
using System.Collections.Generic;
using Dapper;
using System.Linq;
using System.Web;
using System.DirectoryServices.AccountManagement;

namespace ProjectTracking
{
  public class UserAccess
  {

    public bool authenticated { get; set; } = false;
    public string user_name { get; set; }
    public int employee_id { get; set; } = 0;
    public string display_name { get; set; } = "";


    public UserAccess(string name)
    {
      user_name = name;

      display_name = name;
      using (PrincipalContext pc = new PrincipalContext(ContextType.Domain))
      {
        try
        {
          var up = UserPrincipal.FindByIdentity(pc, user_name);


          ParseUser(up);
        }
        catch (Exception ex)
        {
          Constants.Log(ex);
        }
      }

    }

    public UserAccess(UserPrincipal up)
    {
      ParseUser(up);
    }

    private void ParseUser(UserPrincipal up)
    {
      try
      {
        if (up != null)
        {
          user_name = up.SamAccountName.ToLower();
          authenticated = true;
          display_name = up.DisplayName;
          if (int.TryParse(up.EmployeeId, out int eid))
          {
            employee_id = eid;
          }

        }
      }
      catch (Exception ex)
      {
        Constants.Log(ex);
      }
    }
    /*
     * build dictionary
     * GetUserDepartments(), GetCacheUserDepartments()
     * loop through add each to dictionary
     * cache dictionary
     * return dictionary
     * 
     * dictionary: cache {int, List<string>}
     * 
     * */


    public Dictionary<int, List<string>> BuildUserAccessDictionary()
    {
      var userAccess = Constants.GetUserDepartments();
      return userAccess;
    }
      
    public static Dictionary<int, List<string>> GetCachedAllUserAccess()
    {
      return (Dictionary<int, List<string>>)MyCache.GetItem("useraccess");
    }


  }
}