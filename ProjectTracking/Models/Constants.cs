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

    public static int GetCachedCountyManager()
    {
      return (int)MyCache.GetItem("countymanager");
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
        using (IDbConnection db = new SqlConnection(Get_CS("Production")))
        {
          return (List<T>)db.Query<T>(query);
        }
      }
      catch (Exception ex)
      {
        new ErrorLog(ex, query);
        return null;
      }
    }

    public static List<T> Get_Data<T>(string query, DynamicParameters dbA)
    {
      try
      {
        using (IDbConnection db = new SqlConnection(Get_CS("Production")))
        {
          return (List<T>)db.Query<T>(query, dbA);
        }
      }
      catch (Exception ex)
      {
        new ErrorLog(ex, query);
        return null;
      }
    }

    public static int Exec_Query(string query, DynamicParameters dbA)
    {
      try
      {
        using (IDbConnection db = new SqlConnection(Get_CS("Production")))
        {
          return db.Execute(query, dbA);
        }
      }
      catch (Exception ex)
      {
        new ErrorLog(ex, query);
        return -1;
      }
    }

    public static T Exec_Scalar<T>(string query, DynamicParameters dbA)
    {
      try
      {
        using (IDbConnection db = new SqlConnection(Get_CS("Production")))
        {
          return db.ExecuteScalar<T>(query, dbA);
        }
      }
      catch (Exception ex)
      {
        new ErrorLog(ex, query);
        return default(T);
      }
    }

    public static bool Save_Data<T>(string Query, T item)
    {
      try
      {
        using (IDbConnection db = new SqlConnection(Get_CS("Production")))
        {
          db.Execute(Query, item);
          return true;
        }
      }
      catch (Exception ex)
      {
        new ErrorLog(ex, Query);
        return false;
      }
    }

    public static string Get_CS(string cs)
    {
      return ConfigurationManager.ConnectionStrings[cs].ConnectionString;
    }
       
  }
}