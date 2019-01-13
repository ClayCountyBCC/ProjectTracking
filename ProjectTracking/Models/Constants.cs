using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using Dapper;

namespace ProjectTracking
{
  public static class Constants
  {
    public const int appId = 20038;

    public enum PaymentTypes : int // This may need to be changed to reflect actual data: this is a department, not payment type.
    {
      Building = 0,
      Rescue = 1
    }

    public static string Create_Audit_Log(string Username, string Message)
    {
      //return DateTime.Now.ToString("g1") + " by " + Username + ": " + Message + ".";
      return $"{DateTime.Now.ToString("MM/dd/yyyy hh:mm tt")} by {Username}: {Message}.";
    }

    public static string Create_Audit_Log(string Username, string FieldName, string OldValue, string NewValue)
    {
      return $"{DateTime.Now.ToString("MM/dd/yyyy hh:mm tt")} by {Username}: {FieldName} changed from {OldValue} to {NewValue}.";
    }

    public static bool UseProduction()
    {
      switch (Environment.MachineName.ToUpper())
      {

        case "MISHL05":
        case "MISSL01":
        case "CLAYBCCIIS01":
          //case "CLAYBCCDMZIIS01":
          return true;

        default:
          // we'll return false for any machinenames we don't know.
          return false;
      }
    }

    public static List<DataValue> GetCachedDepartments()
    {
      return (List<DataValue>)MyCache.GetItem("departments");
    }

    public static Dictionary<int, List<string>> GetUserAccessDictionary()
    {
      return GetCachedUserAccessDictionary();
    }

    public static Dictionary<int, List<string>> GetCachedUserAccessDictionary()
    {
      return (Dictionary<int, List<string>>)MyCache.GetItem("useraccess");
    }

    public static Dictionary<int, List<string>> GetUserDepartments()
    {

      var userDictionary = new Dictionary<int, List<string>>();
      
      var query = @"
        USE ProjectTracking;

        SELECT 
          employee_id, 
          departments_can_edit
        FROM users

      ";
      try
      {
        var users = Get_Data<User>(query);

        if (users != null)
        {
          foreach (var u in users)
          {
            userDictionary.Add(u.employee_id, u.departments.Split(' ').ToList());
          }

          return userDictionary;
        }
      }
      catch(Exception ex)
      {
        new ErrorLog(ex, query);      
      }
      return null;
    }

    public static int GetCountyManager()
    {
    
      var query = @"
      
        USE ProjectTracking;

        SELECT employee_id
        FROM county_manager

      ";
      try
      {
        var county_manager_employee_id = Get_Data<int>(query).First();
        if(county_manager_employee_id > 0)
        {
          return county_manager_employee_id;
        }

      }
      catch (Exception ex)
      {
        new ErrorLog(ex, query);

      }
      return -1;
    }

    public static List<T> Get_Data<T>(string query)
    {
      try
      {
        using (IDbConnection db =
          new SqlConnection(
            Get_ConnStr("ProjectTrackingProd")))
        {
          return (List<T>)db.Query<T>(query);
        }
      }
      catch (Exception ex)
      {
        Log(ex, query);
        return null;
      }
    }
    
    public static List<T> Get_Data<T>(string query, DynamicParameters dbA)
    {
      try
      {
        using (IDbConnection db =
          new SqlConnection(
            Get_ConnStr("ProjectTrackingProd")))
        {
          return (List<T>)db.Query<T>(query, dbA);
        }
      }
      catch (Exception ex)
      {
        Log(ex, query);
        return null;
      }
    }

    public static int Exec_Query(string query, DynamicParameters dbA)
    {
      try
      {
        using (IDbConnection db =
          new SqlConnection(
            Get_ConnStr("ProjectTrackingProd")))
        {
          return db.Execute(query, dbA);
        }
      }
      catch (Exception ex)
      {
        Log(ex, query);
        return -1;
      }
    }
    
    public static bool Save_Data<T>(string Query, T item)
    {
      try
      {
        using (IDbConnection db = 
          new SqlConnection(
            Get_ConnStr("ProjectTrackingProd")))
        {
          db.Execute(Query, item);
          return true;
        }
      }
      catch (Exception ex)
      {
        Log(ex, Query);
        return false;
      }
    }

    public static string Get_ConnStr(string cs)
    {
      return ConfigurationManager.ConnectionStrings[cs].ConnectionString;
    }

    #region Log Code

    public static void Log(Exception ex, string Query = "")
    {
      SaveLog(new ErrorLog(ex, Query));
    }

    public static void Log(string Text, string Message,
      string Stacktrace, string Source, string Query = "")
    {
      ErrorLog el = new ErrorLog(Text, Message, Stacktrace, Source, Query);
      SaveLog(el);
    }

    private static void SaveLog(ErrorLog el, string cs = "ProdLog")
    {
      el.AppId = appId;
      string sql = @"
          INSERT INTO ErrorData 
          (applicationName, AppId, errorText, errorMessage, 
          errorStacktrace, errorSource, query)  
          VALUES (@applicationName, @AppId, @errorText, @errorMessage,
            @errorStacktrace, @errorSource, @query);";
      try
      {
        using (IDbConnection db = new SqlConnection(Get_ConnStr(cs)))
        {
          db.Execute(sql, el);
        }
      }
      catch(Exception ex)
      {
        SaveLog(el, "Log");
        SaveLog(new ErrorLog(ex), "Log");
      }

    }

    public static void SaveEmail(string to, string subject, string body, string cs = "ProdLog")
    {
      string sql = @"
          INSERT INTO EmailList 
          (EmailTo, EmailSubject, EmailBody)  
          VALUES (@To, @Subject, @Body);";
      try
      {
        var dbArgs = new DynamicParameters();
        dbArgs.Add("@To", to);
        dbArgs.Add("@Subject", subject);
        dbArgs.Add("@Body", body);

        using (IDbConnection db = new SqlConnection(Get_ConnStr(cs)))
        {
          db.Execute(sql, dbArgs);
        }
      }
      catch(Exception ex)
      {
        // if we fail to save an email to the production server,
        // let's save it to the backup DB server.
        if(cs == "ProdLog")
        {
          SaveEmail(to, subject, body, "Log");
        }
        else
        {
          Constants.Log(ex, sql);
          Constants.Log("Payment Email not sent", subject, body, "");
        }

      }
    }


    #endregion
  }
}