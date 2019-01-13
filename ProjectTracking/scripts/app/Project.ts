namespace ProjectTracking
{
  "use strict";

  interface IProject
  {
    id: number;
    project_name: string;
    department: string;
    timeline: string;
    commissioner_share: boolean;
    completed: boolean;
    date_last_updated: any;
    date_completed: any;
    can_edit: boolean;
    milestones: Array<Milestone>;
    comments: Array<Comment>;
  }

  export class Project implements IProject
  {
    public id: number = -1;
    public project_name: string = "";
    public department: string = "";
    public timeline: string = "";
    public commissioner_share: boolean = false;
    public completed: boolean = false;
    public date_last_updated: any = new Date();
    public date_completed: any = new Date();
    public can_edit: boolean = false;
    public milestones: Array<Milestone> = [];
    public comments: Array<Comment> = [];

    constructor()
    {

    }

    public static AddProject(): void
    {
      // this function is going to reset all of the New
      // project form's values and get it ready to have a new project created.
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
      Project.UpdateProjectDepartment(project.department);
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

    public static UpdateCommissionerShare(complete: boolean): void
    {
      let share = <HTMLInputElement>document.getElementById("projectCommissionerShare");
      share.checked = complete;
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
      let a = document.createElement("a");
      a.appendChild(document.createTextNode(project.project_name))
      a.onclick = function ()
      {
        Project.LoadProject(project);
      }
      projectName.appendChild(a);
      tr.appendChild(projectName);

      let department = document.createElement("td");
      let departmentNames = ProjectTracking.departments.filter(function (d) { return d.value === project.department; });
      let departmentName = departmentNames.length > 0 ? departmentNames[0].label : "";
      department.appendChild(document.createTextNode(departmentName));
      tr.appendChild(department);

      let milestones = document.createElement("td");
      milestones.appendChild(Milestone.MilestonesView(project.milestones));
      tr.appendChild(milestones);

      let timeline = document.createElement("td");
      timeline.appendChild(document.createTextNode(project.timeline));
      tr.appendChild(timeline);

      let comments = document.createElement("td");
      let df = Comment.CommentsView(project.comments, false);
      let addComments = document.createElement("a");
      //addComments.classList.add("button");
      addComments.classList.add("is-primary");
      addComments.appendChild(document.createTextNode("Add Comment"));
      df.appendChild(addComments);
      comments.appendChild(df);

      tr.appendChild(comments);

      let dateUpdated = document.createElement("td");
      dateUpdated.appendChild(document.createTextNode(Utilities.Format_Date(project.date_last_updated)));
      tr.appendChild(dateUpdated);
      return tr;
    }

  }

}