﻿using System;
using System.Collections.Generic;
using Dapper;
using System.Linq;
using System.Web;
using System.DirectoryServices.AccountManagement;

namespace ProjectTracking
{
  public class UserAccess
  {
    //private const string basic_access_group = "gInspectionAppAccess"; // We may make this an argument if we end up using this code elsewhere.
    //private const string inspector_access_group = "gInspectionAppInspectors";
    private const string mis_access_group = "gICT";
    //private const string contract_inspection_access_group = "gUniversalEngineering";

    public bool authenticated { get; set; } = false;
    public string user_name { get; set; }
    public int employee_id { get; set; } = 0;
    public string display_name { get; set; } = "";
    public List<string> DepartmentsUserCanEdit { get; set; }

  public enum access_type : int
    {
      basic_access = 1,
      inspector_access = 2,
      contract_access = 3
    }
   // public access_type current_access { get; set; } = access_type.public_access; // default to public access.

    public UserAccess(string name)
    {
      user_name = name;
      //if(user_name.Length == 0)
      //{
      //  user_name = "clayIns";
      //  display_name = "Public User";
      //}
      //else
      //{
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
      //}
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
          //var groups = (from g in up.GetAuthorizationGroups()
          //              select g.Name).ToList();

          // TODO: Get list of departments user can edit
          // field: timestore.dbo.Access.dept_approval_list
          // parse list to DepartmentsUserCanEdit property; delimited by space
          // if MIS, then all ELSE departmentsUserCanEdit List
          
          DepartmentsUserCanEdit = GetUserDepartmentAccess().Split(' ').ToList();

          //if (groups.Contains(mis_access_group) || groups.Contains(inspector_access_group))
          //{
          //  //current_access = access_type.inspector_access;
          //}
          //else
          //{
          //  if (groups.Contains(basic_access_group))
          //  {
          //    current_access = access_type.basic_access;
          //    return;
          //  }
          //  if(groups.Contains(contract_inspection_access_group))
          //  {
          //    current_access = access_type.contract_access;
          //  }
          //}
        }
      }
      catch (Exception ex)
      {
        Constants.Log(ex);
      }
    }

    //private static void ParseGroup(string group, ref Dictionary<string, UserAccess> d)
    //{
    //  using (PrincipalContext pc = new PrincipalContext(ContextType.Domain))
    //  {
    //    using (GroupPrincipal gp = GroupPrincipal.FindByIdentity(pc, group))
    //    {
    //      if (gp != null)
    //      {
    //        foreach (UserPrincipal up in gp.GetMembers())
    //        {
    //          if (up != null)
    //          {
    //            if (!d.ContainsKey(up.SamAccountName.ToLower()))
    //            {
    //              d.Add(up.SamAccountName.ToLower(), new UserAccess(up));
    //            }
    //          }
    //        }
    //      }
    //    }
    //  }
    //}

    //public static Dictionary<string, UserAccess> GetAllUserAccess()
    //{
    //  var d = new Dictionary<string, UserAccess>();

    //  try
    //  {
    //    switch (Environment.MachineName.ToUpper())
    //    {

    //      case "CLAYBCCDMZIIS01":
    //        d[""] = new UserAccess("");
    //        break;
    //      default:            
    //        ParseGroup(inspector_access_group, ref d);
    //        ParseGroup(mis_access_group, ref d);
    //        ParseGroup(basic_access_group, ref d);
    //        ParseGroup(contract_inspection_access_group, ref d);
    //        d[""] = new UserAccess("");
    //        break;

    //    }
    //      return d;
    //  }
    //  catch (Exception ex)
    //  {
    //    Constants.Log(ex);
    //    return null;
    //  }
    //}

    private string GetUserDepartmentAccess()
    {

      var param = new DynamicParameters();
      param.Add("@employee_id", employee_id);

      var query = @"
        USE TimeStore;

        SELECT dept_approval_list
        FROM [TimeStore].[dbo].[Access]
        WHERE employee_id = @employee_id

      ";
      
      try
      {

        return Constants.Get_Data<string>(query, param).DefaultIfEmpty("").ToString();
        
      }
      catch(Exception ex)
      {
        new ErrorLog(ex, query);
      }

      return "";
    }

    public static UserAccess GetUserAccess(string Username)
    {
      try
      {
        string un = Username.Replace(@"CLAYBCC\", "").ToLower();
        //un = "universalengineering"; /* change "" to user_name you wish to test */
        switch (Environment.MachineName.ToUpper())
        {
          //case "MISSL01":
          case "MISHL05":
            return new UserAccess(un);
          default:
            var d = GetCachedAllUserAccess();

            if (d.ContainsKey(un))
            {
              return d[un]; // we're dun
            }
            else
            {
              return d[""];
            }
        }
      }
      catch(Exception ex)
      {
        Constants.Log(ex, "");
        return null;
      }
    }

    public static Dictionary<string, UserAccess> GetCachedAllUserAccess()
    {
      return (Dictionary<string, UserAccess>)MyCache.GetItem("useraccess");
    }


  }
}