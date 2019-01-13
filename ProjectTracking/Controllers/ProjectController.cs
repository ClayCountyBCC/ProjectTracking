using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using ProjectTracking;


namespace ProjectTracking.Controllers
{
  [RoutePrefix("API/Project")]
  public class ProjectController : ApiController
  {
    [HttpGet]
    [Route("GetDepartments")]
    public IHttpActionResult GetDepartments()
    {
      var userDepartmentDictionary = Constants.GetUserAccessDictionary();
      if (userDepartmentDictionary == null)
      {
        return InternalServerError();
      }
      return Ok(userDepartmentDictionary);
    }

    [HttpGet]
    [Route("ProjectList")]
    public IHttpActionResult GetProjectList()
    {
      var projectList = Project.GetProjects();
      if(projectList == null)
      {
        return InternalServerError();
      }
      return Ok(projectList);
    }

    [HttpGet]
    [Route("GetProject")]
    public IHttpActionResult GetProject(int project_id)
    {
      var thisProject = Project.GetProjects(project_id);
      if(thisProject == null)
      {
        return InternalServerError();

      }
      return Ok(thisProject);
    }

    [HttpPost]
    [Route("Add")]
    public IHttpActionResult Save(Project newProject)
    {
      var error = new List<string>();
      if (newProject == null)
      {
        error.Add("There is no project to save, please try the request again");
        return Ok(error);
      }
      else
      {
        var ua = new UserAccess(User.Identity.Name);
        if (Constants.GetCachedUserAccessDictionary()[ua.employee_id].Contains(newProject.department))
        {
     
          int i = newProject.Save();

        }
        else
        {
          throw new HttpException(401, "Unauthorized Access");


        }

      }
      return Ok(error);
    }

    [HttpPost]
    [Route("Update")]
    public IHttpActionResult Update(Project existingProject)
    {
      var error = "";

      var ua = new UserAccess(User.Identity.Name);
      if (Constants.GetCachedUserAccessDictionary()[ua.employee_id].Contains(existingProject.department))
      {
        error = existingProject.Validate();
        if (error.Length > 0) return Ok(error);


        var project = Project.UpdateProject(existingProject);
        return Ok(project);
      }
      else
      {
        throw new HttpException(401, "Unauthorized Access");
      }
    }
    
    [HttpPost]
    [Route("AddComment")]
    public IHttpActionResult AddComment(Comment comment)
    {

      var project = Project.GetProjects(comment.project_id).FirstOrDefault();
      var ua = new UserAccess(User.Identity.Name);
      comment.added_by = ua.display_name;
      comment.added_by_county_manager = Constants.GetCountyManager() == ua.employee_id;

      if (Constants.GetCachedUserAccessDictionary()[ua.employee_id].Contains(project.department))
      {
        return Ok(comment.Save());
      }
      else
      {
        throw new HttpException(401, "Unauthorized Access");
      }

    }
  }
} 