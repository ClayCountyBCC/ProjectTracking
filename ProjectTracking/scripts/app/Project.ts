namespace ProjectTracking
{
  "use strict";

  export enum PriorityLevel
  {
    Low = 0,
    Normal = 1,
    High = 2
  }

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
    needs_attention: boolean;
    priority: PriorityLevel;
    estimated_completion_date: any;
    phase_1_name: string;
    phase_2_name: string;
    phase_3_name: string;
    phase_4_name: string;
    phase_5_name: string;
    phase_1_start: Date;
    phase_1_completion: Date;
    phase_2_start: Date;
    phase_2_completion: Date;
    phase_3_start: Date;
    phase_3_completion: Date;
    phase_4_start: Date;
    phase_4_completion: Date;
    phase_5_start: Date;
    phase_5_completion: Date;
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
    public needs_attention: boolean;
    public priority: PriorityLevel;
    public estimated_completion_date: any;
    public phase_1_name: string = "";
    public phase_2_name: string = "";
    public phase_3_name: string = "";
    public phase_4_name: string = "";
    public phase_5_name: string = "";
    public phase_1_start: Date;
    public phase_1_completion: Date;
    public phase_2_start: Date;
    public phase_2_completion: Date;
    public phase_3_start: Date;
    public phase_3_completion: Date;
    public phase_4_start: Date;
    public phase_4_completion: Date;
    public phase_5_start: Date;
    public phase_5_completion: Date;

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
          let filtered = Project.ApplyFilters(projects);
          Project.BuildProjectTrackingList(filtered);
          Project.BuildProjectSummaryList(filtered);
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
      let highpriorityFilter = (<HTMLInputElement>document.getElementById("projectHighPriorityFilter")).checked;
      let needsAttentionFilter = (<HTMLInputElement>document.getElementById("projectNeedsAttentionFilter")).checked;
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
        return ((needsAttentionFilter && j.needs_attention) || !needsAttentionFilter);
      });

      projects = projects.filter(function (j)
      {
        return ((highpriorityFilter && j.priority === PriorityLevel.High) || !highpriorityFilter);
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
      Project.UpdateNeedsAttention(false);
      Project.UpdateProjectPriority(1);
      Project.UpdateCommissionerShare(false);
      Project.UpdateInfrastructureShare(false);
      Project.UpdateLegislativeTracking(false);
      Project.UpdateProjectEstimatedCompletionDate("");
      Project.UpdatePhaseDates(null);
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

      Project.UpdateNeedsAttention(project.needs_attention);
      Project.UpdateProjectEstimatedCompletionDate(project.estimated_completion_date);
      Project.UpdatePhaseDates(project);
      Project.UpdateProjectPriority(project.priority);

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

    public static UpdatePhaseDates(project: Project): void
    {
      if (project === null)
      {
        Utilities.Set_Value("phase_1_name", "");
        Utilities.Set_Value("phase_2_name", "");
        Utilities.Set_Value("phase_3_name", "");
        Utilities.Set_Value("phase_4_name", "");
        Utilities.Set_Value("phase_5_name", "");

        Utilities.Set_Value("phase_1_start", "");
        Utilities.Set_Value("phase_2_start", "");
        Utilities.Set_Value("phase_3_start", "");
        Utilities.Set_Value("phase_4_start", "");
        Utilities.Set_Value("phase_5_start", "");

        Utilities.Set_Value("phase_1_completion", "");
        Utilities.Set_Value("phase_2_completion", "");
        Utilities.Set_Value("phase_3_completion", "");
        Utilities.Set_Value("phase_4_completion", "");
        Utilities.Set_Value("phase_5_completion", "");
      }
      else
      {
        Utilities.Set_Value("phase_1_name", project.phase_1_name);
        Utilities.Set_Value("phase_2_name", project.phase_2_name);
        Utilities.Set_Value("phase_3_name", project.phase_3_name);
        Utilities.Set_Value("phase_4_name", project.phase_4_name);
        Utilities.Set_Value("phase_5_name", project.phase_5_name);

        Project.UpdateDateInput("phase_1_start", project.phase_1_start);
        Project.UpdateDateInput("phase_2_start", project.phase_2_start);
        Project.UpdateDateInput("phase_3_start", project.phase_3_start);
        Project.UpdateDateInput("phase_4_start", project.phase_4_start);
        Project.UpdateDateInput("phase_5_start", project.phase_5_start);
        Project.UpdateDateInput("phase_1_completion", project.phase_1_completion);
        Project.UpdateDateInput("phase_2_completion", project.phase_2_completion);
        Project.UpdateDateInput("phase_3_completion", project.phase_3_completion);
        Project.UpdateDateInput("phase_4_completion", project.phase_4_completion);
        Project.UpdateDateInput("phase_5_completion", project.phase_5_completion);
      }
    }

    private static UpdateDateInput(id: string, value: Date)
    {
      let input = <HTMLInputElement>document.getElementById(id);
      input.value = "";
      if (value === null) return;

      let s = value.toString();
      if (new Date(s).getFullYear() > 1000)
      {
        input.valueAsDate = new Date(s);
      }
    }

    public static UpdateProjectName(projectName: string): void
    {
      Utilities.Set_Value("projectName", projectName);
    }

    public static UpdateProjectDepartment(departmentId: string): void
    {
      Utilities.Set_Value("projectDepartment", departmentId);
    }

    public static UpdateProjectPriority(priority: number): void
    {
      Utilities.Set_Value("projectPriority", priority.toString());
    }

    public static UpdateProjectEstimatedCompletionDate(estimatedDate: any):void
    {
      let input = <HTMLInputElement>document.getElementById("projectEstimatedCompletionDate");
      input.value = "";
      if (new Date(estimatedDate.toString()).getFullYear() > 1000)
      {
        //let formatted_date = Utilities.Format_Date(estimatedDate);
        input.valueAsDate = new Date(estimatedDate);
      }


      //Utilities.Set_Value("projectEstimatedCompletionDate", estimatedDate);
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

    public static UpdateNeedsAttention(share: boolean): void
    {
      let shared = <HTMLInputElement>document.getElementById("projectNeedsAttention");
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

    public static BuildProjectSummaryList(projects: Array<Project>): void
    {
      let container = document.getElementById("projectSummary");
      Utilities.Clear_Element(container);
      let df = document.createDocumentFragment();
      for (let p of projects)
      {
        df.appendChild(Project.CreateProjectSummaryRow(p));
      }
      container.appendChild(df);
    }

    public static CreateProjectSummaryRow(project: Project): HTMLTableRowElement
    {
      //project.comments = project.comments.filter(function (j) { return j.comment.length > 0; });

      let tr = document.createElement("tr");
      //if (project.needs_attention)
      //{
      //  tr.classList.add("needs-attention");
      //}
      //else
      //{
      //  if (project.completed)
      //  {
      //    tr.classList.add("completed");
      //  }
      //}
      tr.classList.add("pagebreak");

      let projectName = document.createElement("td");
      let projectNameContainer = document.createElement("div");
      projectName.appendChild(projectNameContainer);

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
        projectNameContainer.appendChild(a);
      }
      else
      {
        projectNameContainer.appendChild(document.createTextNode(project.project_name));
      }
      //if (project.priority !== PriorityLevel.Normal)
      //{
      //  let p = document.createElement("p");
      //  p.appendChild(document.createTextNode(PriorityLevel[project.priority].toString() + " priority"));
      //  projectNameContainer.appendChild(p);
      //}

      //if (project.needs_attention)
      //{
      //  let p = document.createElement("p");
      //  p.appendChild(document.createTextNode("Needs Attention"));
      //  projectNameContainer.appendChild(p);
      //}
      //let comments = document.createElement("td");
      //let dfComments = Comment.CommentsView(project.comments, false);
      //comments.appendChild(dfComments);
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

      //let milestones = document.createElement("td");
      //milestones.appendChild(Milestone.MilestonesView(project.milestones, project.completed));
      //tr.appendChild(milestones);

      tr.appendChild(Project.GetCurrentPhase(project, true)); // get the current phase

      //let timeline = document.createElement("td");
      //timeline.appendChild(document.createTextNode(project.timeline));
      //tr.appendChild(timeline);
      //tr.appendChild(comments);

      let dateUpdated = document.createElement("td");
      let dateUpdatedContainer = document.createElement("div");
      dateUpdatedContainer.classList.add("has-text-centered");
      dateUpdated.appendChild(dateUpdatedContainer);
      //dateUpdatedContainer.appendChild(document.createTextNode(Utilities.Format_Date(project.date_last_updated)));
      if (new Date(project.estimated_completion_date.toString()).getFullYear() > 1000)
      {
      //  let hr = document.createElement("hr");
      //  dateUpdatedContainer.appendChild(hr);
      //  let p = document.createElement("p");
        dateUpdatedContainer.appendChild(document.createTextNode(Utilities.Format_Date(project.estimated_completion_date)));

      //  dateUpdatedContainer.appendChild(p);
      }
      tr.appendChild(dateUpdated);
      return tr;
    }

    public static CreateProjectRow(project: Project): HTMLTableRowElement
    {
      project.comments = project.comments.filter(function (j) { return j.comment.length > 0; });

      let tr = document.createElement("tr");
      if (project.needs_attention)
      {
        tr.classList.add("needs-attention");
      }
      else
      {
        if (project.completed)
        {
          tr.classList.add("completed");          
        }
      }
      tr.classList.add("pagebreak");

      let projectName = document.createElement("td");
      let projectNameContainer = document.createElement("div");
      projectName.appendChild(projectNameContainer);
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
        projectNameContainer.appendChild(a);
      }
      else
      {
        projectNameContainer.appendChild(document.createTextNode(project.project_name));
      }
      if (project.priority !== PriorityLevel.Normal)
      {
        let p = document.createElement("p");
        p.appendChild(document.createTextNode(PriorityLevel[project.priority].toString() + " priority"));
        projectNameContainer.appendChild(p);
      }

      if (project.needs_attention)
      {
        let p = document.createElement("p");
        p.appendChild(document.createTextNode("Needs Attention"));
        projectNameContainer.appendChild(p);
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
      milestones.appendChild(Milestone.MilestonesView(project.milestones, project.completed));
      tr.appendChild(milestones);

      tr.appendChild(Project.GetCurrentPhase(project, false)); // get the current phase

      //let timeline = document.createElement("td");
      //timeline.appendChild(document.createTextNode(project.timeline));
      //tr.appendChild(timeline);
      tr.appendChild(comments);

      let dateUpdated = document.createElement("td");      
      let dateUpdatedContainer = document.createElement("div");
      dateUpdatedContainer.classList.add("has-text-centered");
      dateUpdated.appendChild(dateUpdatedContainer);
      dateUpdatedContainer.appendChild(document.createTextNode(Utilities.Format_Date(project.date_last_updated)));
      //if (new Date(project.estimated_completion_date.toString()).getFullYear() > 1000)
      //{
      //  let hr = document.createElement("hr");
      //  dateUpdatedContainer.appendChild(hr);
      //  let p = document.createElement("p");
      //  p.appendChild(document.createTextNode(Utilities.Format_Date(project.estimated_completion_date)));

      //  dateUpdatedContainer.appendChild(p);
      //}
      tr.appendChild(dateUpdated);
      return tr;
    }

    private static GetCurrentPhase(project: Project, add_aging_color: boolean): HTMLTableCellElement
    {
      let ignore = "Ignore this Phase";
      let td = document.createElement("td");

      let span = document.createElement("span");
      let color = "";
      let has_been_completed: boolean = false;
      if (project.completed)
      {
        if (add_aging_color)
        {
          let img = document.createElement("img");
          img.src = "content/images/circle-green128.png";
          td.appendChild(img);
        }
        span.appendChild(document.createTextNode("Project Completed"));
        td.appendChild(span);
        return td;
      }

      let current_phase = 0;
      let current_phase_start: Date = null;
      let current_phase_end: Date = null;
      
      for (let i = 1; i < 6; i++)
      {
        let name = <string>project["phase_" + i.toString() + "_name"];
        let start = <Date>project["phase_" + i.toString() + "_start"];
        let completion = <Date>project["phase_" + i.toString() + "_completion"];
        if (completion !== null) has_been_completed = true;
        if (completion === null && name !== ignore && name.length > 0)
        {
          if (start !== null && name !== ignore && name.length > 0)
          {
            
            current_phase = i;
            current_phase_start = <Date>project["phase_" + i.toString() + "_start"];
            for (let j = i + 1; j < 6; j++)
            {
              let name_end = <string>project["phase_" + j.toString() + "_name"];
              let start_end = <Date>project["phase_" + j.toString() + "_start"];
              if (name_end !== ignore && start_end !== null)
              {
                current_phase_end = start_end;
                break;
              }
            }
            if (current_phase_end === null)
            {
              current_phase_end = project.estimated_completion_date;
            }

            //if (i < 5)
            //{
            //  current_phase_end = <Date>project["phase_" + (i + 1).toString() + "_start"];
            //}
            //else
            //{
              
            //}
          }
          break;
        }
      }

      if (current_phase === 0)
      {
        if (has_been_completed)
        {
          span.appendChild(document.createTextNode("Phases Completed, Project not marked as completed."));
          color = "green";
        }
        else
        {
          span.appendChild(document.createTextNode("Phases not entered."));
          color = "black";
        }

        //return td;
      }
      else
      {
        let phase_name = Project.GetPhaseName(current_phase, project);
        let text = phase_name + ":  " + Utilities.Format_Date(current_phase_start);
        text += " - ";
        if (current_phase_end === null)
        {
          text += "No Ending Date";
        }
        else
        {
          text += Utilities.Format_Date(current_phase_end);
          let d = new Date();

          let today = new Date(d.getFullYear(), d.getMonth(), d.getDate());
          var diff = Math.round((today.getTime() - new Date(<any>current_phase_end).getTime()) / 86400000); 
          console.log('date diff', diff, today, current_phase_end);
          if (diff > 30)
          {
            color = "red";
          }
          else
          {
            if (diff > 0)
            {
              color = "yellow";
            }
            else
            {
              color = "green";   
            }
          }
        }
        span.appendChild(document.createTextNode(text));
      }
      if (add_aging_color && color.length > 0)
      {
        let img = document.createElement("img");
        img.src = "content/images/circle-" + color + "128.png";


        td.appendChild(img);

      }
      td.appendChild(span);
      //if (!add_aging_color) 
      return td;
    }

    private static GetPhaseName(phase_number: number, project: Project): string
    {
      if (phase_number === 6) return "Completed";
      return <string>project["phase_" + phase_number.toString() + "_name"];
      //return Utilities.Get_Value("phase_" + phase_number.toString() + "_name");
      //switch (phase_number)
      //{
      //  case 1:
      //    return "Develop Specifications";
      //  case 2:
      //    return "Procurement";
      //  case 3:
      //    return "Design (Construction)";
      //  case 4:
      //    return "Bid (Construction)";
      //  case 5:
      //    return "Construction / Implementation";
      //  case 6:
      //    return "Completed";
      //  default:
      //    return "";
      //}
    }
    // summary view

    private static ValidatePhaseDate(project: Project, phase_number: number): boolean
    {
      let ignore = "Ignore this Phase";
      if (<string>project["phase_" + phase_number.toString() + "_name"] === ignore) return true;
      let start = <Date>project["phase_" + phase_number + "_start"];
      let completion = <Date>project["phase_" + phase_number + "_completion"];
      if (start !== null && completion !== null)
      {
        return (start <= completion);
      }
      return true;

    }

    private static ValidatePhaseDates(): boolean
    {
      let ignore = "Ignore this Phase";
      let error_text = "";
      ProjectTracking.selected_project.estimated_completion_date = Utilities.Get_Date_Value("projectEstimatedCompletionDate", true);
      ProjectTracking.selected_project.phase_1_name = Utilities.Get_Value("phase_1_name");
      ProjectTracking.selected_project.phase_2_name = Utilities.Get_Value("phase_2_name");
      ProjectTracking.selected_project.phase_3_name = Utilities.Get_Value("phase_3_name");
      ProjectTracking.selected_project.phase_4_name = Utilities.Get_Value("phase_4_name");
      ProjectTracking.selected_project.phase_5_name = Utilities.Get_Value("phase_5_name");
      // get date values;
      ProjectTracking.selected_project.phase_1_start = Utilities.Get_Date_Value("phase_1_start", true);
      ProjectTracking.selected_project.phase_2_start = Utilities.Get_Date_Value("phase_2_start", true);
      ProjectTracking.selected_project.phase_3_start = Utilities.Get_Date_Value("phase_3_start", true);
      ProjectTracking.selected_project.phase_4_start = Utilities.Get_Date_Value("phase_4_start", true);
      ProjectTracking.selected_project.phase_5_start = Utilities.Get_Date_Value("phase_5_start", true);

      ProjectTracking.selected_project.phase_1_completion = Utilities.Get_Date_Value("phase_1_completion", true);
      ProjectTracking.selected_project.phase_2_completion = Utilities.Get_Date_Value("phase_2_completion", true);
      ProjectTracking.selected_project.phase_3_completion = Utilities.Get_Date_Value("phase_3_completion", true);
      ProjectTracking.selected_project.phase_4_completion = Utilities.Get_Date_Value("phase_4_completion", true);
      ProjectTracking.selected_project.phase_5_completion = Utilities.Get_Date_Value("phase_5_completion", true);

      // check for error
      // validation logic should be as follows:
      // successive phase dates should be after or the same as previous phase dates.
      // ie: phase 1 start date should be:
      // less than or equal to phase 1 completion date
      // less than or equal to phase 2 start date
      // we only compare each phase's start date to it's completion date
      // so that they can leave the start dates alone if a phase is completed late.
      // and so on
      // null values are ignored
      let p = ProjectTracking.selected_project;
      let date_compare: Array<Date> = [];
      for (let i = 1; i < 6; i++)
      {
        let start = <Date>p["phase_" + i.toString() + "_start"];
        let name = <string>p["phase_" + i.toString() + "_name"];
        if (name !== ignore && name.length > 0 && start === null)
        {
          error_text = "You have selected a phase name but not put in a start date.";
          break;
        }
        if (start !== null) date_compare.push(start);
        if (!Project.ValidatePhaseDate(p, i))
        {
          error_text = "Actual Completion Dates must be no earlier than the same date as the Start Date.";
        }
      }
      if (date_compare.length > 0 && error_text.length === 0)
      {
        if (p.estimated_completion_date === null)
        {
          error_text = "The Estimated Project Completion date is required if the phase dates are utilized.";
        }
        else
        {
          for (let i = 0; i < date_compare.length; i++)
          {
            if ((i + 1) < date_compare.length)
            {
              if (date_compare[i] > date_compare[i + 1] || date_compare[i] > p.estimated_completion_date)
              {
                error_text = "Phase dates must be in order.  An earlier phase cannot have a start date greater than a later phase or the project's estimated completion date.";
                break;
              }
            }
          }
        }

        
      }

      // set error
      Utilities.Set_Text("phase_dates_error", error_text);
      if (error_text.length > 0)
      {
        let e = document.getElementById("phase_dates_error");
        e.scrollTo();
      }
      // return true/false
      return error_text.length === 0;
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
      if (!Project.ValidatePhaseDates())
      {
        
        Utilities.Toggle_Loading_Button("saveProject", false);
        return;
      }
      ProjectTracking.selected_project.project_name = projectName;
      ProjectTracking.selected_project.milestones = Milestone.ReadMilestones();
      ProjectTracking.selected_project.department_id = parseInt(Utilities.Get_Value("projectDepartment"));
      ProjectTracking.selected_project.funding_id = parseInt(Utilities.Get_Value("projectFunding"));
      ProjectTracking.selected_project.timeline = Utilities.Get_Value("projectTimeline");
      ProjectTracking.selected_project.comment = Utilities.Get_Value("projectComment");
      ProjectTracking.selected_project.priority = PriorityLevel[Utilities.Get_Value("projectPriority")];
      ProjectTracking.selected_project.estimated_completion_date = Utilities.Get_Value("projectEstimatedCompletionDate");

      ProjectTracking.selected_project.phase_1_name = Utilities.Get_Value("phase_1_name");
      ProjectTracking.selected_project.phase_2_name = Utilities.Get_Value("phase_2_name");
      ProjectTracking.selected_project.phase_3_name = Utilities.Get_Value("phase_3_name");
      ProjectTracking.selected_project.phase_4_name = Utilities.Get_Value("phase_4_name");
      ProjectTracking.selected_project.phase_5_name = Utilities.Get_Value("phase_5_name");

      ProjectTracking.selected_project.phase_1_start = Utilities.Get_Date_Value("phase_1_start", true);
      ProjectTracking.selected_project.phase_2_start = Utilities.Get_Date_Value("phase_2_start", true);
      ProjectTracking.selected_project.phase_3_start = Utilities.Get_Date_Value("phase_3_start", true);
      ProjectTracking.selected_project.phase_4_start = Utilities.Get_Date_Value("phase_4_start", true);
      ProjectTracking.selected_project.phase_5_start = Utilities.Get_Date_Value("phase_5_start", true);

      ProjectTracking.selected_project.phase_1_completion = Utilities.Get_Date_Value("phase_1_completion", true);
      ProjectTracking.selected_project.phase_2_completion = Utilities.Get_Date_Value("phase_2_completion", true);
      ProjectTracking.selected_project.phase_3_completion = Utilities.Get_Date_Value("phase_3_completion", true);
      ProjectTracking.selected_project.phase_4_completion = Utilities.Get_Date_Value("phase_4_completion", true);
      ProjectTracking.selected_project.phase_5_completion = Utilities.Get_Date_Value("phase_5_completion", true);

      //return;
      let completed = <HTMLInputElement>document.getElementById("projectComplete");
      ProjectTracking.selected_project.completed = completed.checked;
      let share = <HTMLInputElement>document.getElementById("projectCommissionerShare");
      ProjectTracking.selected_project.commissioner_share = share.checked;
      let ifshare = <HTMLInputElement>document.getElementById("projectInfrastructureShare");
      ProjectTracking.selected_project.infrastructure_share = ifshare.checked;
      
      let legislative = <HTMLInputElement>document.getElementById("projectLegislativeTracking");
      ProjectTracking.selected_project.legislative_tracking = legislative.checked;

      let needsattention = <HTMLInputElement>document.getElementById("projectNeedsAttention");
      ProjectTracking.selected_project.needs_attention = needsattention.checked;
      console.log("project to save", ProjectTracking.selected_project);
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

    public static PopulatePriorities()
    {
      let priorities = <HTMLSelectElement>document.getElementById("projectPriority");
      Utilities.Clear_Element(priorities);
      console.log("prioritylevel", PriorityLevel);
      for (let level in PriorityLevel)
      {
        if (level.length < 3)
        {
          let option = document.createElement("option");
          option.value = level.toString();
          option.appendChild(document.createTextNode(PriorityLevel[level].toString()));
          if (level === PriorityLevel.Normal.toString()) option.selected = true;
          priorities.appendChild(option);
        }
      }
    }

    public static ToggleSummaryView(): void
    {
      let button = <HTMLButtonElement>document.getElementById("toggleSummaryView");
      Utilities.Toggle_Loading_Button(button, true);
      
      let buttonText = document.createElement("strong");
      Utilities.Clear_Element(button);
      if (ProjectTracking.default_view)
      {
        
        Utilities.Set_Text(buttonText, "Switch to Default View");
        Utilities.Hide("projectDefaultView");
        Utilities.Show("projectSummaryView");
      }
      else
      {
        Utilities.Set_Text(buttonText, "Switch to Summary View");
        //Project.BuildProjectTrackingList(Project.ApplyFilters(projects));
        Utilities.Show("projectDefaultView");
        Utilities.Hide("projectSummaryView");
      }
      button.appendChild(buttonText);

      


      ProjectTracking.default_view = !ProjectTracking.default_view;
      Utilities.Toggle_Loading_Button(button, false);
    }

  }

}