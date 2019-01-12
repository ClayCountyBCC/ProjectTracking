using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ProjectTracking;


namespace ProjectTracking.Controllers
{
  [RoutePrefix("API/Project")]
  public class ProjectController : ApiController
  {
    [HttpGet]
    [Route("GetList")]
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
        var ua = UserAccess.GetUserAccess(User.Identity.Name);
        if (!ua.departments_can_edit.Contains(newProject.department))
        {
     
          int i = newProject.Save();

        }
        else
        {
          error.Add("Project has not been saved, user has incorrect level of access.");

          return Ok(error);
        }

      }
      return Ok(error);
    }

    [HttpPost]
    [Route("Update")]
    public IHttpActionResult Update(Project existingProject)
    {
      var error = "";

      var ua = UserAccess.GetUserAccess(User.Identity.Name);
      if (ua.departments_can_edit.Contains(existingProject.department))
      {
        error = existingProject.Validate();
        if (error.Length > 0) return Ok(error);


        var project = Project.UpdateProject(existingProject);
        return Ok(project);
      }
      else
      {
        error = "Events have not been saved, user has incorrect level of access.";
      }
      return Ok(error);
    }

  }
} 