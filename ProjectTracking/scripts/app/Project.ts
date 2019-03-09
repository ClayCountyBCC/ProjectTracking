namespace ProjectTracking
{
  "use strict";

  interface IProject
  {
    id: number;
    project_name: string;
    department_id: number;
    funding_id: number;
    timeline: string;
    commissioner_share: boolean;
    infrastructure_share: boolean;
    legislative_tracking: boolean;
    completed: boolean;
    date_last_updated: any;
    date_completed: any;
    can_edit: boolean;
    milestones: Array<Milestone>;
    comments: Array<Comment>;
    comment: string;
  }

  export class Project implements IProject
  {
    public id: number = -1;
    public project_name: string = "";
    public department_id: number = -1;
    public funding_id: number = 1;
    public timeline: string = "";
    public commissioner_share: boolean = false;
    public infrastructure_share: boolean = false;
    public legislative_tracking: boolean = false;
    public completed: boolean = false;
    public date_last_updated: any = null;
    public date_completed: any = null;
    public can_edit: boolean = false;
    public milestones: Array<Milestone> = [];
    public comments: Array<Comment> = [];
    public comment: string;

    constructor()
    {

    }

    public static GetProjects(): void
    {
      let buttonId = "filterRefreshButton";
      Utilities.Toggle_Loading_Button(buttonId, true);
      let path = ProjectTracking.GetPath();
      Utilities.Get<Array<Project>>(path + "API/Project/List")
        .then(function (projects: Array<Project>)
        {
          console.log("projects", projects);
          ProjectTracking.projects = projects;
          Project.BuildProjectTrackingList(Project.ApplyFilters(projects));
          ProjectTracking.FinishedLoading();
          if (projects.length === 0)
          {
            ProjectTracking.AddProjectResultsMessage("No projects were found. You can use the Add Project button to add a new project.");
          }
          Utilities.Toggle_Loading_Button(buttonId, false);
        }, function (e: Error)
        {
          if (e.message.trim().toLowerCase() === "unauthorized")
          {
            ProjectTracking.AddProjectResultsMessage("You do not currently have access to the Project Tracking application.");
          }
          else
          {
            if (e)
            {
              ProjectTracking.AddProjectResultsMessage("There was a problem retrieving a list of projects.  Please try again. If this issue persists, please put in a help desk ticket.");
              console.log('error getting permits', e);
            }
          }
          Utilities.Toggle_Loading_Button(buttonId, false);
          });
    }

    public static ApplyFilters(projects: Array<Project>): Array<Project>
    {
      let departmentFilter = Utilities.Get_Value("departmentFilter");
      let projectNameFilter = ProjectTracking.project_name_filter.toUpperCase();
      let shareFilter = (<HTMLInputElement>document.getElementById("projectCommissionerShareFilter")).checked;
      let completedFilter = (<HTMLInputElement>document.getElementById("projectCompleteFilter")).checked;      
      let infrastructureFilter = (<HTMLInputElement>document.getElementById("projectInfrastructureFilter")).checked;      
      let legislativeFilter = (<HTMLInputElement>document.getElementById("projectLegislativeFilter")).checked;      
      projects = projects.filter(function (j)
      {
        return (departmentFilter.length === 0 ||
          j.department_id.toString() === departmentFilter ||
          (departmentFilter === "mine" && j.can_edit));
      });
      projects = projects.filter(function (j)
      {
        return ((shareFilter && j.commissioner_share) || !shareFilter);
      });

      projects = projects.filter(function (j)
      {
        return ((shareFilter && j.commissioner_share) || !shareFilter);
      });
      projects = projects.filter(function (j)
      {
        return ((legislativeFilter && j.legislative_tracking) || !legislativeFilter);
      });

      projects = projects.filter(function (j)
      {
        return ((completedFilter && !j.completed) || !completedFilter);
      });
      projects = projects.filter(function (j)
      {
        return ((infrastructureFilter && j.infrastructure_share) || !infrastructureFilter);
      });
      projects = projects.filter(function (j)
      {
        return (projectNameFilter.length > 0 && j.project_name.toUpperCase().indexOf(projectNameFilter) > -1 || projectNameFilter.length === 0);
      });
      return projects;
    }

    public static AddProject(): void
    {
      // this function is going to reset all of the New
      // project form's values and get it ready to have a new project created.
      Utilities.Hide("updateProjectAsUpToDate");
      ProjectTracking.selected_project = new Project(); // the object we'll be saving
      Project.UpdateProjectName("");
      Project.UpdateProjectDepartment("");
      Project.UpdateProjectFunding("0");
      Milestone.ClearMilestones();
      Project.UpdateProjectTimeline("");
      Project.UpdateProjectCompleted(false);
      Project.UpdateCommissionerShare(false);
      Project.UpdateInfrastructureShare(false);
      Project.UpdateLegislativeTracking(false);
      let commentsContainer = document.getElementById("existingCommentsContainer");
      Utilities.Hide(commentsContainer);
      Utilities.Clear_Element(commentsContainer);
      Project.ClearComment();
      ProjectTracking.ShowAddProject();
    }

    public static LoadProject(project: Project): void
    {
      Utilities.Show("updateProjectAsUpToDate");
      project.comments = project.comments.filter(function (j) { return j.comment.length > 0; });

      Project.UpdateProjectName(project.project_name);
      Project.UpdateProjectDepartment(project.department_id.toString());
      Project.UpdateProjectFunding(project.funding_id.toString());
      Milestone.LoadMilestones(project.milestones);
      Project.UpdateProjectTimeline(project.timeline);
      Project.UpdateProjectCompleted(project.completed);
      Project.UpdateCommissionerShare(project.commissioner_share);
      Project.UpdateInfrastructureShare(project.infrastructure_share);
      Project.UpdateLegislativeTracking(project.legislative_tracking);
      let commentsContainer = document.getElementById("existingCommentsContainer");
      Utilities.Clear_Element(commentsContainer);
      if (project.comments.length > 0)
      {
        Utilities.Show(commentsContainer);
        Comment.PopulateCommentsFieldset(project.comments);
      }
      else
      {
        Utilities.Hide(commentsContainer);
      }
      Project.ClearComment();
      ProjectTracking.ShowAddProject();
    }

    public static UpdateProjectName(projectName: string): void
    {
      Utilities.Set_Value("projectName", projectName);
    }

    public static UpdateProjectDepartment(departmentId: string): void
    {
      Utilities.Set_Value("projectDepartment", departmentId);
    }

    public static UpdateProjectFunding(sourceId: string): void
    {
      Utilities.Set_Value("projectFunding", sourceId);
    }

    public static UpdateProjectTimeline(timeline: string): void
    {
      Utilities.Set_Value("projectTimeline", timeline);
    }

    public static UpdateProjectCompleted(complete: boolean): void
    {
      let completed = <HTMLInputElement>document.getElementById("projectComplete");
      completed.checked = complete;
    }

    public static UpdateInfrastructureShare(infrastructure: boolean): void
    {
      let ifshare = <HTMLInputElement>document.getElementById("projectInfrastructureShare");
      ifshare.checked = infrastructure;
    }

    public static UpdateLegislativeTracking(legislative: boolean): void
    {
      let tracking = <HTMLInputElement>document.getElementById("projectLegislativeTracking");
      tracking.checked = legislative;
    }

    public static UpdateCommissionerShare(share: boolean): void
    {
      let shared = <HTMLInputElement>document.getElementById("projectCommissionerShare");
      shared.checked = share;
    }

    public static ClearComment(): void
    {
      Utilities.Set_Value("projectComment", "");
    }

    public static BuildProjectTrackingList(projects: Array<Project>): void
    {
      let container = document.getElementById("projectList");
      Utilities.Clear_Element(container);
      let df = document.createDocumentFragment();
      for (let p of projects)
      {
        df.appendChild(Project.CreateProjectRow(p));
      }
      container.appendChild(df);
    }

    public static CreateProjectRow(project: Project): HTMLTableRowElement
    {
      project.comments = project.comments.filter(function (j) { return j.comment.length > 0; });

      let tr = document.createElement("tr");
      tr.classList.add("pagebreak");

      let projectName = document.createElement("td");
      let comments = document.createElement("td");
      let dfComments = Comment.CommentsView(project.comments, false);
      if (project.can_edit)
      {
        let a = document.createElement("a");
        a.appendChild(document.createTextNode(project.project_name))
        a.onclick = function ()
        {
          ProjectTracking.selected_project = project; // this is the project we'll be attempting to update.
          Project.LoadProject(project);
          console.log('selected_project', ProjectTracking.selected_project);
        }
        projectName.appendChild(a);
      }
      else
      {
        projectName.appendChild(document.createTextNode(project.project_name));
      }

      comments.appendChild(dfComments);
      tr.appendChild(projectName);

      let department = document.createElement("td");
      let departmentNames = ProjectTracking.departments.filter(function (d) { return d.Value === project.department_id.toString(); });
      let departmentName = departmentNames.length > 0 ? departmentNames[0].Label : "";
      department.appendChild(document.createTextNode(departmentName));
      tr.appendChild(department);

      let funding = document.createElement("td");
      let fundingNames = ProjectTracking.funding_sources.filter(function (d) { return d.Value === project.funding_id.toString(); });
      let fundingName = departmentNames.length > 0 && project.funding_id !== -1 ? fundingNames[0].Label : "";
      funding.appendChild(document.createTextNode(fundingName));
      tr.appendChild(funding);

      let milestones = document.createElement("td");
      milestones.appendChild(Milestone.MilestonesView(project.milestones));
      tr.appendChild(milestones);

      let timeline = document.createElement("td");
      timeline.appendChild(document.createTextNode(project.timeline));
      tr.appendChild(timeline);
      tr.appendChild(comments);

      let dateUpdated = document.createElement("td");
      dateUpdated.appendChild(document.createTextNode(Utilities.Format_Date(project.date_last_updated)));
      tr.appendChild(dateUpdated);
      return tr;
    }

    public static Save()
    {
      // let's lock the button down so the user can't click it multiple times
      // we'll also want to update it to show that it's loading
      //let saveButton = document.getElementById("saveProject");
      Utilities.Toggle_Loading_Button("saveProject", true);
      let projectName = Utilities.Get_Value("projectName").trim();
      if (projectName.length === 0)
      {
        //alert("You must have a project name in order to save, or you can click the Cancel button to exit without saving any changes.");
        let projectNameInput = document.getElementById("projectName");
        let e = document.getElementById("projectNameEmpty");
        Utilities.Error_Show(e, "", true);
        projectNameInput.focus();
        projectNameInput.scrollTo();
        Utilities.Toggle_Loading_Button("saveProject", false);
        return;
      }
      ProjectTracking.selected_project.project_name = projectName;
      ProjectTracking.selected_project.milestones = Milestone.ReadMilestones();
      ProjectTracking.selected_project.department_id = parseInt(Utilities.Get_Value("projectDepartment"));
      ProjectTracking.selected_project.funding_id = parseInt(Utilities.Get_Value("projectFunding"));
      ProjectTracking.selected_project.timeline = Utilities.Get_Value("projectTimeline");
      ProjectTracking.selected_project.comment = Utilities.Get_Value("projectComment");

      let completed = <HTMLInputElement>document.getElementById("projectComplete");
      ProjectTracking.selected_project.completed = completed.checked;
      let share = <HTMLInputElement>document.getElementById("projectCommissionerShare");
      ProjectTracking.selected_project.commissioner_share = share.checked;
      let ifshare = <HTMLInputElement>document.getElementById("projectInfrastructureShare");
      ProjectTracking.selected_project.infrastructure_share = ifshare.checked;
      
      let legislative = <HTMLInputElement>document.getElementById("projectLegislativeTracking");
      ProjectTracking.selected_project.legislative_tracking = legislative.checked;

      let path = ProjectTracking.GetPath();
      let saveType = (ProjectTracking.selected_project.id > -1) ? "Update" : "Add";
      Utilities.Post_Empty(path + "API/Project/" + saveType, ProjectTracking.selected_project)
        .then(function (r: Response)
        {
          console.log('post response', r);
          if (!r.ok)
          {
            // do some error stuff
            console.log('some errors happened with post response');
          }
          else
          {
            // we good
            console.log('post response good');
            ProjectTracking.Project.GetProjects();
            ProjectTracking.CloseModals();
          }
          Utilities.Toggle_Loading_Button("saveProject", false);
        }, function (e)
          {
            console.log('error getting permits', e);
            //Toggle_Loading_Search_Buttons(false);
          Utilities.Toggle_Loading_Button("saveProject", false);
          });

    }

  }

}