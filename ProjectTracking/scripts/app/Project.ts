namespace ProjectTracking
{
  "use strict";

  interface IProject
  {
    id: number;
    project_name: string;
    department_id: number;
    timeline: string;
    commissioner_share: boolean;
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
    public timeline: string = "";
    public commissioner_share: boolean = false;
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
      ProjectTracking.departments = [];
      let path = ProjectTracking.GetPath();
      Utilities.Get<Array<Project>>(path + "API/Project/List")
        .then(function (projects: Array<Project>)
        {
          console.log("projects", projects);
          ProjectTracking.projects = projects;
          Project.BuildProjectTrackingList(projects);
          //DataValue.BuildDepartmentSelect("departmentFilter", ProjectTracking.departments);
          //Toggle_Loading_Search_Buttons(false);

        }, function (e)
          {
            console.log('error getting permits', e);
            //Toggle_Loading_Search_Buttons(false);
          });
    }

    public static AddProject(): void
    {
      // this function is going to reset all of the New
      // project form's values and get it ready to have a new project created.
      ProjectTracking.selected_project = new Project(); // the object we'll be saving
      Project.UpdateProjectName("");
      Project.UpdateProjectDepartment("");
      Milestone.ClearMilestones();
      Project.UpdateProjectTimeline("");
      Project.UpdateProjectCompleted(false);
      Project.UpdateCommissionerShare(false);
      let commentsContainer = document.getElementById("existingCommentsContainer");
      Utilities.Hide(commentsContainer);
      Utilities.Clear_Element(commentsContainer);
      Project.ClearComment();
      ProjectTracking.ShowAddProject();
    }

    public static LoadProject(project: Project): void
    {
      project.comments = project.comments.filter(function (j) { return j.comment.length > 0; });

      Project.UpdateProjectName(project.project_name);
      Project.UpdateProjectDepartment(project.department_id.toString());
      Milestone.LoadMilestones(project.milestones);
      Project.UpdateProjectTimeline(project.timeline);
      Project.UpdateProjectCompleted(project.completed);
      Project.UpdateCommissionerShare(project.commissioner_share);
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

    public static UpdateProjectTimeline(timeline: string): void
    {
      Utilities.Set_Value("projectTimeline", timeline);
    }

    public static UpdateProjectCompleted(complete: boolean): void
    {
      let completed = <HTMLInputElement>document.getElementById("projectComplete");
      completed.checked = complete;
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

      let projectName = document.createElement("td");
      let comments = document.createElement("td");
      let dfComments = Comment.CommentsView(project.comments, false);
      if (project.can_edit)
      {
        let a = document.createElement("a");
        a.appendChild(document.createTextNode(project.project_name))
        a.onclick = function ()
        {
          Project.LoadProject(project);
          ProjectTracking.selected_project = project; // this is the project we'll be attempting to update.
        }
        projectName.appendChild(a);
        // handle add comments button here
        
        let addComments = document.createElement("a");
        //addComments.classList.add("button");
        addComments.classList.add("is-primary");
        addComments.appendChild(document.createTextNode("Add Comment"));
        dfComments.appendChild(addComments);
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
      ProjectTracking.selected_project.project_name = Utilities.Get_Value("projectName");
      ProjectTracking.selected_project.milestones = Milestone.ReadMilestones();
      ProjectTracking.selected_project.department_id = parseInt(Utilities.Get_Value("projectDepartment"));
      ProjectTracking.selected_project.timeline = Utilities.Get_Value("projectTimeline");
      ProjectTracking.selected_project.comment = Utilities.Get_Value("projectComment");
      let completed = <HTMLInputElement>document.getElementById("projectComplete");
      ProjectTracking.selected_project.completed = completed.checked;
      let share = <HTMLInputElement>document.getElementById("projectCommissionerShare");
      ProjectTracking.selected_project.commissioner_share = share.checked;

      console.log('project we going to save', ProjectTracking.selected_project);
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
          }
        }, function (e)
          {
            console.log('error getting permits', e);
            //Toggle_Loading_Search_Buttons(false);
          });

    }

  }

}