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
    [Route("Departments/All")]
    public IHttpActionResult GetDepartments()
    {
      var ua = new UserAccess(User.Identity.Name);
      if (!ua.authenticated) return Unauthorized();
      return Ok(DataValue.GetCachedDepartments());
    }

    [HttpGet]
    [Route("Departments/My")]
    public IHttpActionResult GetMyDepartments()
    {
      var ua = new UserAccess(User.Identity.Name);
      if (!ua.authenticated) return Unauthorized();
      return Ok(DataValue.GetMyDepartments(ua.employee_id));      
    }

    [HttpGet]
    [Route("List")]
    public IHttpActionResult GetProjects()
    {
      var ua = new UserAccess(User.Identity.Name);
      if (!ua.authenticated) return Unauthorized();
      var projects = Project.GetProjects(ua.employee_id);
      if(projects == null)
      {
        return InternalServerError();
      }
      return Ok(projects);
    }

    [HttpGet]
    [Route("Select")]
    public IHttpActionResult GetProject(int project_id)
    {
      var ua = new UserAccess(User.Identity.Name);
      if (!ua.authenticated) return Unauthorized();
      var currentProject = Project.GetSpecificProject(project_id, ua.employee_id);
      return Ok(currentProject);
    }

    [HttpPost]
    [Route("Add")]
    public IHttpActionResult Save(Project newProject)
    {
      var ua = new UserAccess(User.Identity.Name);
      if (!ua.authenticated) return Unauthorized();      

      string error = newProject.Validate(ua.employee_id, null);
      if (error.Length > 0) return Ok(error);

      if (newProject.Save(ua)) return Ok("");

      return InternalServerError();
    }

    [HttpPost]
    [Route("Update")]
    public IHttpActionResult Update(Project existingProject)
    {
      var ua = new UserAccess(User.Identity.Name);
      if (!ua.authenticated) return Unauthorized();
      var currentProject = Project.GetSpecificProject(existingProject.id, ua.employee_id);
      string error = existingProject.Validate(ua.employee_id, currentProject);
      if (error.Length > 0) return Ok(error);

      if (existingProject.Update(ua, currentProject)) return Ok();

      return InternalServerError();
    }
    
    [HttpPost]
    [Route("AddUpdateComment")]
    public IHttpActionResult AddComment(int project_id)
    {
      var ua = new UserAccess(User.Identity.Name);
      if (!ua.authenticated) return Unauthorized();

      if (Comment.UpdateOnly(ua, project_id)) return Ok("");
      return Ok("There was a problem saving your comment, please refresh this page and try again.");
    }
  }
} 