var google;
var ProjectTracking;
(function (ProjectTracking) {
    "use strict";
    var PriorityLevel;
    (function (PriorityLevel) {
        PriorityLevel[PriorityLevel["Low"] = 0] = "Low";
        PriorityLevel[PriorityLevel["Normal"] = 1] = "Normal";
        PriorityLevel[PriorityLevel["High"] = 2] = "High";
    })(PriorityLevel = ProjectTracking.PriorityLevel || (ProjectTracking.PriorityLevel = {}));
    var Project = /** @class */ (function () {
        function Project() {
            this.id = -1;
            this.project_name = "";
            this.department_id = -1;
            this.funding_id = 1;
            this.timeline = "";
            this.commissioner_share = false;
            this.infrastructure_share = false;
            this.legislative_tracking = false;
            this.completed = false;
            this.date_last_updated = null;
            this.date_completed = null;
            this.can_edit = false;
            this.milestones = [];
            this.comments = [];
            //public phase_1_name: string = "";
            //public phase_2_name: string = "";
            //public phase_3_name: string = "";
            //public phase_4_name: string = "";
            //public phase_5_name: string = "";
            //public phase_1_start: Date;
            //public phase_1_completion: Date;
            //public phase_2_start: Date;
            //public phase_2_completion: Date;
            //public phase_3_start: Date;
            //public phase_3_completion: Date;
            //public phase_4_start: Date;
            //public phase_4_completion: Date;
            //public phase_5_start: Date;
            //public phase_5_completion: Date;
            this.phases = [];
        }
        Project.GetProjects = function () {
            ProjectTracking.charts = {};
            var buttonId = "filterRefreshButton";
            Utilities.Toggle_Loading_Button(buttonId, true);
            var path = ProjectTracking.GetPath();
            Utilities.Get(path + "API/Project/List")
                .then(function (projects) {
                console.log("projects", projects);
                ProjectTracking.projects = projects;
                var filtered = Project.ApplyFilters(projects);
                Project.BuildProjectTrackingList(filtered);
                Project.BuildProjectSummaryList(filtered);
                ProjectTracking.FinishedLoading();
                if (projects.length === 0) {
                    ProjectTracking.AddProjectResultsMessage("No projects were found. You can use the Add Project button to add a new project.");
                }
                Utilities.Toggle_Loading_Button(buttonId, false);
            }, function (e) {
                if (e.message.trim().toLowerCase() === "unauthorized") {
                    ProjectTracking.AddProjectResultsMessage("You do not currently have access to the Project Tracking application.");
                }
                else {
                    if (e) {
                        ProjectTracking.AddProjectResultsMessage("There was a problem retrieving a list of projects.  Please try again. If this issue persists, please put in a help desk ticket.");
                        console.log('error getting permits', e);
                    }
                }
                Utilities.Toggle_Loading_Button(buttonId, false);
            });
        };
        Project.ApplyFilters = function (projects) {
            var departmentFilter = Utilities.Get_Value("departmentFilter");
            var projectNameFilter = ProjectTracking.project_name_filter.toUpperCase();
            var shareFilter = document.getElementById("projectCommissionerShareFilter").checked;
            var completedFilter = document.getElementById("projectCompleteFilter").checked;
            var infrastructureFilter = document.getElementById("projectInfrastructureFilter").checked;
            var legislativeFilter = document.getElementById("projectLegislativeFilter").checked;
            var highpriorityFilter = document.getElementById("projectHighPriorityFilter").checked;
            var needsAttentionFilter = document.getElementById("projectNeedsAttentionFilter").checked;
            projects = projects.filter(function (j) {
                return (departmentFilter.length === 0 ||
                    j.department_id.toString() === departmentFilter ||
                    (departmentFilter === "mine" && j.can_edit));
            });
            projects = projects.filter(function (j) {
                return ((shareFilter && j.commissioner_share) || !shareFilter);
            });
            projects = projects.filter(function (j) {
                return ((shareFilter && j.commissioner_share) || !shareFilter);
            });
            projects = projects.filter(function (j) {
                return ((legislativeFilter && j.legislative_tracking) || !legislativeFilter);
            });
            projects = projects.filter(function (j) {
                return ((completedFilter && !j.completed) || !completedFilter);
            });
            projects = projects.filter(function (j) {
                return ((needsAttentionFilter && j.needs_attention) || !needsAttentionFilter);
            });
            projects = projects.filter(function (j) {
                return ((highpriorityFilter && j.priority === PriorityLevel.High) || !highpriorityFilter);
            });
            projects = projects.filter(function (j) {
                return ((infrastructureFilter && j.infrastructure_share) || !infrastructureFilter);
            });
            projects = projects.filter(function (j) {
                return (projectNameFilter.length > 0 && j.project_name.toUpperCase().indexOf(projectNameFilter) > -1 || projectNameFilter.length === 0);
            });
            return projects;
        };
        Project.AddProject = function () {
            // this function is going to reset all of the New
            // project form's values and get it ready to have a new project created.
            Utilities.Hide("updateProjectAsUpToDate");
            ProjectTracking.selected_project = new Project(); // the object we'll be saving
            Project.UpdateProjectName("");
            Project.UpdateProjectDepartment("");
            Project.UpdateProjectFunding("0");
            ProjectTracking.Milestone.ClearMilestones();
            ProjectTracking.Phase.ClearPhases();
            Project.UpdateProjectTimeline("");
            Project.UpdateProjectCompleted(false);
            Project.UpdateNeedsAttention(false);
            Project.UpdateProjectPriority(1);
            Project.UpdateCommissionerShare(false);
            Project.UpdateInfrastructureShare(false);
            Project.UpdateLegislativeTracking(false);
            Project.UpdateProjectEstimatedCompletionDate("");
            //Project.UpdatePhaseDates(null);
            var commentsContainer = document.getElementById("existingCommentsContainer");
            Utilities.Hide(commentsContainer);
            Utilities.Clear_Element(commentsContainer);
            Project.ClearComment();
            ProjectTracking.ShowAddProject();
        };
        Project.LoadProject = function (project) {
            Utilities.Show("updateProjectAsUpToDate");
            project.comments = project.comments.filter(function (j) { return j.comment.length > 0; });
            Project.UpdateProjectName(project.project_name);
            Project.UpdateProjectDepartment(project.department_id.toString());
            Project.UpdateProjectFunding(project.funding_id.toString());
            ProjectTracking.Milestone.LoadMilestones(project.milestones);
            ProjectTracking.Phase.LoadPhases(project.phases);
            Project.UpdateProjectTimeline(project.timeline);
            Project.UpdateProjectCompleted(project.completed);
            Project.UpdateCommissionerShare(project.commissioner_share);
            Project.UpdateInfrastructureShare(project.infrastructure_share);
            Project.UpdateLegislativeTracking(project.legislative_tracking);
            Project.UpdateNeedsAttention(project.needs_attention);
            Project.UpdateProjectEstimatedCompletionDate(project.estimated_completion_date);
            //Project.UpdatePhaseDates(project);
            Project.UpdateProjectPriority(project.priority);
            var commentsContainer = document.getElementById("existingCommentsContainer");
            Utilities.Clear_Element(commentsContainer);
            if (project.comments.length > 0) {
                Utilities.Show(commentsContainer);
                ProjectTracking.Comment.PopulateCommentsFieldset(project.comments);
            }
            else {
                Utilities.Hide(commentsContainer);
            }
            Project.ClearComment();
            ProjectTracking.ShowAddProject();
        };
        //public static UpdatePhaseDates(project: Project): void
        //{
        //  if (project === null)
        //  {
        //    Utilities.Set_Value("phase_1_name", "");
        //    Utilities.Set_Value("phase_2_name", "");
        //    Utilities.Set_Value("phase_3_name", "");
        //    Utilities.Set_Value("phase_4_name", "");
        //    Utilities.Set_Value("phase_5_name", "");
        //    Utilities.Set_Value("phase_1_start", "");
        //    Utilities.Set_Value("phase_2_start", "");
        //    Utilities.Set_Value("phase_3_start", "");
        //    Utilities.Set_Value("phase_4_start", "");
        //    Utilities.Set_Value("phase_5_start", "");
        //    Utilities.Set_Value("phase_1_completion", "");
        //    Utilities.Set_Value("phase_2_completion", "");
        //    Utilities.Set_Value("phase_3_completion", "");
        //    Utilities.Set_Value("phase_4_completion", "");
        //    Utilities.Set_Value("phase_5_completion", "");
        //  }
        //  else
        //  {
        //    Utilities.Set_Value("phase_1_name", project.phase_1_name);
        //    Utilities.Set_Value("phase_2_name", project.phase_2_name);
        //    Utilities.Set_Value("phase_3_name", project.phase_3_name);
        //    Utilities.Set_Value("phase_4_name", project.phase_4_name);
        //    Utilities.Set_Value("phase_5_name", project.phase_5_name);
        //    Project.UpdateDateInput("phase_1_start", project.phase_1_start);
        //    Project.UpdateDateInput("phase_2_start", project.phase_2_start);
        //    Project.UpdateDateInput("phase_3_start", project.phase_3_start);
        //    Project.UpdateDateInput("phase_4_start", project.phase_4_start);
        //    Project.UpdateDateInput("phase_5_start", project.phase_5_start);
        //    Project.UpdateDateInput("phase_1_completion", project.phase_1_completion);
        //    Project.UpdateDateInput("phase_2_completion", project.phase_2_completion);
        //    Project.UpdateDateInput("phase_3_completion", project.phase_3_completion);
        //    Project.UpdateDateInput("phase_4_completion", project.phase_4_completion);
        //    Project.UpdateDateInput("phase_5_completion", project.phase_5_completion);
        //  }
        //}
        Project.UpdateDateInput = function (id, value) {
            var input = document.getElementById(id);
            input.value = "";
            if (value === null)
                return;
            var s = value.toString();
            if (new Date(s).getFullYear() > 1000) {
                input.valueAsDate = new Date(s);
            }
        };
        Project.UpdateProjectName = function (projectName) {
            Utilities.Set_Value("projectName", projectName);
        };
        Project.UpdateProjectDepartment = function (departmentId) {
            Utilities.Set_Value("projectDepartment", departmentId);
        };
        Project.UpdateProjectPriority = function (priority) {
            Utilities.Set_Value("projectPriority", priority.toString());
        };
        Project.UpdateProjectEstimatedCompletionDate = function (estimatedDate) {
            var input = document.getElementById("projectEstimatedCompletionDate");
            input.value = "";
            if (new Date(estimatedDate.toString()).getFullYear() > 1000) {
                //let formatted_date = Utilities.Format_Date(estimatedDate);
                input.valueAsDate = new Date(estimatedDate);
            }
            //Utilities.Set_Value("projectEstimatedCompletionDate", estimatedDate);
        };
        Project.UpdateProjectFunding = function (sourceId) {
            Utilities.Set_Value("projectFunding", sourceId);
        };
        Project.UpdateProjectTimeline = function (timeline) {
            Utilities.Set_Value("projectTimeline", timeline);
        };
        Project.UpdateProjectCompleted = function (complete) {
            var completed = document.getElementById("projectComplete");
            completed.checked = complete;
        };
        Project.UpdateInfrastructureShare = function (infrastructure) {
            var ifshare = document.getElementById("projectInfrastructureShare");
            ifshare.checked = infrastructure;
        };
        Project.UpdateLegislativeTracking = function (legislative) {
            var tracking = document.getElementById("projectLegislativeTracking");
            tracking.checked = legislative;
        };
        Project.UpdateCommissionerShare = function (share) {
            var shared = document.getElementById("projectCommissionerShare");
            shared.checked = share;
        };
        Project.UpdateNeedsAttention = function (share) {
            var shared = document.getElementById("projectNeedsAttention");
            shared.checked = share;
        };
        Project.ClearComment = function () {
            Utilities.Set_Value("projectComment", "");
        };
        Project.BuildProjectTrackingList = function (projects) {
            var container = document.getElementById("projectList");
            Utilities.Clear_Element(container);
            var df = document.createDocumentFragment();
            for (var _i = 0, projects_1 = projects; _i < projects_1.length; _i++) {
                var p = projects_1[_i];
                df.appendChild(Project.CreateProjectRow(p));
            }
            container.appendChild(df);
        };
        Project.BuildProjectSummaryList = function (projects) {
            var container = document.getElementById("projectSummary");
            Utilities.Clear_Element(container);
            var df = document.createDocumentFragment();
            for (var _i = 0, projects_2 = projects; _i < projects_2.length; _i++) {
                var p = projects_2[_i];
                var phase_rows = Project.CreateNewGanttChartRows(p);
                df.appendChild(Project.CreateProjectSummaryRow(p, phase_rows));
                if (phase_rows.length > 0) {
                    var tr = document.createElement("tr");
                    tr.classList.add("hide");
                    var td = document.createElement("td");
                    td.colSpan = 5;
                    var chart_container = document.createElement("div");
                    chart_container.id = "chart_" + p.id.toString();
                    chart_container.style.width = "100%";
                    td.appendChild(chart_container);
                    tr.appendChild(td);
                    df.appendChild(tr);
                }
            }
            container.appendChild(df);
        };
        Project.CreateProjectSummaryRow = function (project, phase_rows) {
            //project.comments = project.comments.filter(function (j) { return j.comment.length > 0; });
            var tr = document.createElement("tr");
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
            var projectName = document.createElement("td");
            var projectNameContainer = document.createElement("div");
            projectName.appendChild(projectNameContainer);
            if (project.can_edit) {
                var a = document.createElement("a");
                a.appendChild(document.createTextNode(project.project_name));
                a.onclick = function () {
                    ProjectTracking.selected_project = project; // this is the project we'll be attempting to update.
                    Project.LoadProject(project);
                    console.log('selected_project', ProjectTracking.selected_project);
                };
                projectNameContainer.appendChild(a);
            }
            else {
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
            var department = document.createElement("td");
            var departmentNames = ProjectTracking.departments.filter(function (d) { return d.Value === project.department_id.toString(); });
            var departmentName = departmentNames.length > 0 ? departmentNames[0].Label : "";
            department.appendChild(document.createTextNode(departmentName));
            tr.appendChild(department);
            var funding = document.createElement("td");
            var fundingNames = ProjectTracking.funding_sources.filter(function (d) { return d.Value === project.funding_id.toString(); });
            var fundingName = departmentNames.length > 0 && project.funding_id !== -1 ? fundingNames[0].Label : "";
            funding.appendChild(document.createTextNode(fundingName));
            tr.appendChild(funding);
            //let milestones = document.createElement("td");
            //milestones.appendChild(Milestone.MilestonesView(project.milestones, project.completed));
            //tr.appendChild(milestones);
            //let oldCurrentPhase = Project.GetCurrentPhase(project, true, phase_rows);
            //oldCurrentPhase.style.backgroundColor = "#00FFFF";
            var newCurrentPhase = ProjectTracking.Phase.GetCurrentPhases(project, true, phase_rows);
            var phase_td = document.createElement("td");
            //phase_td.appendChild(oldCurrentPhase);
            phase_td.appendChild(newCurrentPhase);
            tr.appendChild(phase_td); // get the current phase
            //let timeline = document.createElement("td");
            //timeline.appendChild(document.createTextNode(project.timeline));
            //tr.appendChild(timeline);
            //tr.appendChild(comments);
            var dateUpdated = document.createElement("td");
            var dateUpdatedContainer = document.createElement("div");
            dateUpdatedContainer.classList.add("has-text-centered");
            dateUpdated.appendChild(dateUpdatedContainer);
            //dateUpdatedContainer.appendChild(document.createTextNode(Utilities.Format_Date(project.date_last_updated)));
            if (new Date(project.estimated_completion_date.toString()).getFullYear() > 1000) {
                //  let hr = document.createElement("hr");
                //  dateUpdatedContainer.appendChild(hr);
                //  let p = document.createElement("p");
                dateUpdatedContainer.appendChild(document.createTextNode(Utilities.Format_Date(project.estimated_completion_date)));
                //  dateUpdatedContainer.appendChild(p);
            }
            tr.appendChild(dateUpdated);
            return tr;
        };
        Project.CreateProjectRow = function (project) {
            project.comments = project.comments.filter(function (j) { return j.comment.length > 0; });
            var tr = document.createElement("tr");
            if (project.needs_attention) {
                tr.classList.add("needs-attention");
            }
            else {
                if (project.completed) {
                    tr.classList.add("completed");
                }
            }
            tr.classList.add("pagebreak");
            var projectName = document.createElement("td");
            var projectNameContainer = document.createElement("div");
            projectName.appendChild(projectNameContainer);
            var comments = document.createElement("td");
            var dfComments = ProjectTracking.Comment.CommentsView(project.comments, false);
            if (project.can_edit) {
                var a = document.createElement("a");
                a.appendChild(document.createTextNode(project.project_name));
                a.onclick = function () {
                    ProjectTracking.selected_project = project; // this is the project we'll be attempting to update.
                    Project.LoadProject(project);
                    console.log('selected_project', ProjectTracking.selected_project);
                };
                projectNameContainer.appendChild(a);
            }
            else {
                projectNameContainer.appendChild(document.createTextNode(project.project_name));
            }
            if (project.priority !== PriorityLevel.Normal) {
                var p = document.createElement("p");
                p.appendChild(document.createTextNode(PriorityLevel[project.priority].toString() + " priority"));
                projectNameContainer.appendChild(p);
            }
            if (project.needs_attention) {
                var p = document.createElement("p");
                p.appendChild(document.createTextNode("Needs Attention"));
                projectNameContainer.appendChild(p);
            }
            comments.appendChild(dfComments);
            tr.appendChild(projectName);
            var department = document.createElement("td");
            var departmentNames = ProjectTracking.departments.filter(function (d) { return d.Value === project.department_id.toString(); });
            var departmentName = departmentNames.length > 0 ? departmentNames[0].Label : "";
            department.appendChild(document.createTextNode(departmentName));
            tr.appendChild(department);
            var funding = document.createElement("td");
            var fundingNames = ProjectTracking.funding_sources.filter(function (d) { return d.Value === project.funding_id.toString(); });
            var fundingName = departmentNames.length > 0 && project.funding_id !== -1 ? fundingNames[0].Label : "";
            funding.appendChild(document.createTextNode(fundingName));
            tr.appendChild(funding);
            var milestones = document.createElement("td");
            milestones.appendChild(ProjectTracking.Milestone.MilestonesView(project.milestones, project.completed));
            tr.appendChild(milestones);
            //let oldCurrentPhase = Project.GetCurrentPhase(project, false, []);
            //oldCurrentPhase.style.backgroundColor = "#00FFFF";
            var newCurrentPhase = ProjectTracking.Phase.GetCurrentPhases(project, false, []);
            var phase_td = document.createElement("td");
            //phase_td.appendChild(oldCurrentPhase);
            phase_td.appendChild(newCurrentPhase);
            tr.appendChild(phase_td); // get the current phase
            //tr.appendChild(Project.GetCurrentPhase(project, false, [])); // get the current phase
            //let timeline = document.createElement("td");
            //timeline.appendChild(document.createTextNode(project.timeline));
            //tr.appendChild(timeline);
            tr.appendChild(comments);
            var dateUpdated = document.createElement("td");
            var dateUpdatedContainer = document.createElement("div");
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
        };
        //private static GetCurrentPhase(project: Project, add_aging_color: boolean, phase_rows: Array<any>): HTMLDivElement
        //{
        //  let ignore = "Ignore this Phase";
        //  //let td = document.createElement("td");
        //  let container = document.createElement("div");
        //  let span = document.createElement("span");
        //  let color = "";
        //  let has_been_completed: boolean = false;
        //  if (project.completed)
        //  {
        //    if (add_aging_color)
        //    {
        //      let img = document.createElement("img");
        //      img.src = "content/images/circle-green128.png";
        //      container.appendChild(img);
        //    }
        //    span.appendChild(document.createTextNode("Project Completed"));
        //    container.appendChild(span);
        //    return container;
        //  }
        //  let current_phase = 0;
        //  let current_phase_start: Date = null;
        //  let current_phase_end: Date = null;
        //  for (let i = 1; i < 6; i++)
        //  {
        //    let name = <string>project["phase_" + i.toString() + "_name"];
        //    let start = <Date>project["phase_" + i.toString() + "_start"];
        //    let completion = <Date>project["phase_" + i.toString() + "_completion"];
        //    if (completion !== null) has_been_completed = true;
        //    if (completion === null && name !== ignore && name.length > 0)
        //    {
        //      if (start !== null && name !== ignore && name.length > 0)
        //      {
        //        current_phase = i;
        //        current_phase_start = <Date>project["phase_" + i.toString() + "_start"];
        //        for (let j = i + 1; j < 6; j++)
        //        {
        //          let name_end = <string>project["phase_" + j.toString() + "_name"];
        //          let start_end = <Date>project["phase_" + j.toString() + "_start"];
        //          if (name_end !== ignore && start_end !== null)
        //          {
        //            current_phase_end = start_end;
        //            break;
        //          }
        //        }
        //        if (current_phase_end === null)
        //        {
        //          current_phase_end = project.estimated_completion_date;
        //        }
        //        //if (i < 5)
        //        //{
        //        //  current_phase_end = <Date>project["phase_" + (i + 1).toString() + "_start"];
        //        //}
        //        //else
        //        //{
        //        //}
        //      }
        //      break;
        //    }
        //  }
        //  if (current_phase === 0)
        //  {
        //    if (has_been_completed)
        //    {
        //      span.appendChild(document.createTextNode("Phases Completed, Project not marked as completed."));
        //      color = "green";
        //    }
        //    else
        //    {
        //      span.appendChild(document.createTextNode("Phases not entered."));
        //      color = "black";
        //    }
        //    //return td;
        //  }
        //  else
        //  {
        //    let phase_name = Project.GetPhaseName(current_phase, project);
        //    let text = phase_name + ":  " + Utilities.Format_Date(current_phase_start);
        //    text += " - ";
        //    if (current_phase_end === null)
        //    {
        //      text += "No Ending Date";
        //    }
        //    else
        //    {
        //      text += Utilities.Format_Date(current_phase_end);
        //      let d = new Date();
        //      let today = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        //      var diff = Math.round((today.getTime() - new Date(<any>current_phase_end).getTime()) / 86400000); 
        //      if (diff > 30)
        //      {
        //        color = "red";
        //      }
        //      else
        //      {
        //        if (diff > 0)
        //        {
        //          color = "yellow";
        //        }
        //        else
        //        {
        //          color = "green";   
        //        }
        //      }
        //    }
        //    span.appendChild(document.createTextNode(text));
        //  }
        //  if (add_aging_color && color.length > 0)
        //  {
        //    let img = document.createElement("img");
        //    img.src = "content/images/circle-" + color + "128.png";
        //    container.appendChild(img);
        //  }
        //  container.appendChild(span);
        //  if (phase_rows.length > 0)
        //  {
        //    span.onclick = () =>
        //    {
        //      Project.DrawGanttChart(project.id, phase_rows);
        //    }
        //    span.style.cursor = "pointer";
        //  }
        //  //if (!add_aging_color) 
        //  return container;
        //}
        //private static GetPhaseName(phase_number: number, project: Project): string
        //{
        //  if (phase_number === 6) return "Completed";
        //  return <string>project["phase_" + phase_number.toString() + "_name"];
        //  //return Utilities.Get_Value("phase_" + phase_number.toString() + "_name");
        //  //switch (phase_number)
        //  //{
        //  //  case 1:
        //  //    return "Develop Specifications";
        //  //  case 2:
        //  //    return "Procurement";
        //  //  case 3:
        //  //    return "Design (Construction)";
        //  //  case 4:
        //  //    return "Bid (Construction)";
        //  //  case 5:
        //  //    return "Construction / Implementation";
        //  //  case 6:
        //  //    return "Completed";
        //  //  default:
        //  //    return "";
        //  //}
        //}
        // summary view
        //private static ValidatePhaseDate(project: Project, phase_number: number): boolean
        //{
        //  let ignore = "Ignore this Phase";
        //  if (<string>project["phase_" + phase_number.toString() + "_name"] === ignore) return true;
        //  let start = <Date>project["phase_" + phase_number + "_start"];
        //  let completion = <Date>project["phase_" + phase_number + "_completion"];
        //  if (start !== null && completion !== null)
        //  {
        //    return (start <= completion);
        //  }
        //  return true;
        //}
        //private static ValidatePhaseDates(): boolean
        //{
        //  let ignore = "Ignore this Phase";
        //  let error_text = "";
        //  ProjectTracking.selected_project.estimated_completion_date = Utilities.Get_Date_Value("projectEstimatedCompletionDate", true);
        //  ProjectTracking.selected_project.phase_1_name = Utilities.Get_Value("phase_1_name");
        //  ProjectTracking.selected_project.phase_2_name = Utilities.Get_Value("phase_2_name");
        //  ProjectTracking.selected_project.phase_3_name = Utilities.Get_Value("phase_3_name");
        //  ProjectTracking.selected_project.phase_4_name = Utilities.Get_Value("phase_4_name");
        //  ProjectTracking.selected_project.phase_5_name = Utilities.Get_Value("phase_5_name");
        //  // get date values;
        //  ProjectTracking.selected_project.phase_1_start = Utilities.Get_Date_Value("phase_1_start", true);
        //  ProjectTracking.selected_project.phase_2_start = Utilities.Get_Date_Value("phase_2_start", true);
        //  ProjectTracking.selected_project.phase_3_start = Utilities.Get_Date_Value("phase_3_start", true);
        //  ProjectTracking.selected_project.phase_4_start = Utilities.Get_Date_Value("phase_4_start", true);
        //  ProjectTracking.selected_project.phase_5_start = Utilities.Get_Date_Value("phase_5_start", true);
        //  ProjectTracking.selected_project.phase_1_completion = Utilities.Get_Date_Value("phase_1_completion", true);
        //  ProjectTracking.selected_project.phase_2_completion = Utilities.Get_Date_Value("phase_2_completion", true);
        //  ProjectTracking.selected_project.phase_3_completion = Utilities.Get_Date_Value("phase_3_completion", true);
        //  ProjectTracking.selected_project.phase_4_completion = Utilities.Get_Date_Value("phase_4_completion", true);
        //  ProjectTracking.selected_project.phase_5_completion = Utilities.Get_Date_Value("phase_5_completion", true);
        //  // check for error
        //  // validation logic should be as follows:
        //  // successive phase dates should be after or the same as previous phase dates.
        //  // ie: phase 1 start date should be:
        //  // less than or equal to phase 1 completion date
        //  // less than or equal to phase 2 start date
        //  // we only compare each phase's start date to it's completion date
        //  // so that they can leave the start dates alone if a phase is completed late.
        //  // and so on
        //  // null values are ignored
        //  let p = ProjectTracking.selected_project;
        //  let date_compare: Array<Date> = [];
        //  for (let i = 1; i < 6; i++)
        //  {
        //    let start = <Date>p["phase_" + i.toString() + "_start"];
        //    let name = <string>p["phase_" + i.toString() + "_name"];
        //    if (name !== ignore && name.length > 0 && start === null)
        //    {
        //      error_text = "You have selected a phase name but not put in a start date.";
        //      break;
        //    }
        //    if (start !== null) date_compare.push(start);
        //    if (!Project.ValidatePhaseDate(p, i))
        //    {
        //      error_text = "Actual Completion Dates must be no earlier than the same date as the Start Date.";
        //    }
        //  }
        //  if (date_compare.length > 0 && error_text.length === 0)
        //  {
        //    if (p.estimated_completion_date === null)
        //    {
        //      error_text = "The Estimated Project Completion date is required if the phase dates are utilized.";
        //    }
        //    else
        //    {
        //      for (let i = 0; i < date_compare.length; i++)
        //      {
        //        if ((i + 1) < date_compare.length)
        //        {
        //          if (date_compare[i] > date_compare[i + 1] || date_compare[i] > p.estimated_completion_date)
        //          {
        //            error_text = "Phase dates must be in order.  An earlier phase cannot have a start date greater than a later phase or the project's estimated completion date.";
        //            break;
        //          }
        //        }
        //      }
        //    }
        //  }
        //  // set error
        //  Utilities.Set_Text("phase_dates_error", error_text);
        //  if (error_text.length > 0)
        //  {
        //    let e = document.getElementById("phase_dates_error");
        //    e.scrollTo();
        //  }
        //  // return true/false
        //  return error_text.length === 0;
        //}
        //private static ValidatePhases(): boolean
        //{
        //  let ignore = "Ignore this Phase";
        //  let error_text = "";
        //  // check for error
        //  // validation logic should be as follows:
        //  // successive phase dates should be after or the same as previous phase dates.
        //  // ie: phase 1 start date should be:
        //  // less than or equal to phase 1 completion date
        //  // less than or equal to phase 2 start date
        //  // we only compare each phase's start date to it's completion date
        //  // so that they can leave the start dates alone if a phase is completed late.
        //  // and so on
        //  // null values are ignored
        //  let p = ProjectTracking.selected_project;
        //  for (let phase of p.phases)
        //  {
        //  }
        //  let date_compare: Array<Date> = [];
        //  for (let i = 1; i < 6; i++)
        //  {
        //    let start = <Date>p["phase_" + i.toString() + "_start"];
        //    let name = <string>p["phase_" + i.toString() + "_name"];
        //    if (name !== ignore && name.length > 0 && start === null)
        //    {
        //      error_text = "You have selected a phase name but not put in a start date.";
        //      break;
        //    }
        //    if (start !== null) date_compare.push(start);
        //    if (!Project.ValidatePhaseDate(p, i))
        //    {
        //      error_text = "Actual Completion Dates must be no earlier than the same date as the Start Date.";
        //    }
        //  }
        //  if (date_compare.length > 0 && error_text.length === 0)
        //  {
        //    if (p.estimated_completion_date === null)
        //    {
        //      error_text = "The Estimated Project Completion date is required if the phase dates are utilized.";
        //    }
        //    else
        //    {
        //      for (let i = 0; i < date_compare.length; i++)
        //      {
        //        if ((i + 1) < date_compare.length)
        //        {
        //          if (date_compare[i] > date_compare[i + 1] || date_compare[i] > p.estimated_completion_date)
        //          {
        //            error_text = "Phase dates must be in order.  An earlier phase cannot have a start date greater than a later phase or the project's estimated completion date.";
        //            break;
        //          }
        //        }
        //      }
        //    }
        //  }
        //  // set error
        //  Utilities.Set_Text("phase_dates_error", error_text);
        //  if (error_text.length > 0)
        //  {
        //    let e = document.getElementById("phase_dates_error");
        //    e.scrollTo();
        //  }
        //  // return true/false
        //  return error_text.length === 0;
        //}
        Project.Save = function () {
            // let's lock the button down so the user can't click it multiple times
            // we'll also want to update it to show that it's loading
            //let saveButton = document.getElementById("saveProject");
            Utilities.Toggle_Loading_Button("saveProject", true);
            var projectName = Utilities.Get_Value("projectName").trim();
            if (projectName.length === 0) {
                //alert("You must have a project name in order to save, or you can click the Cancel button to exit without saving any changes.");
                var projectNameInput = document.getElementById("projectName");
                var e = document.getElementById("projectNameEmpty");
                Utilities.Error_Show(e, "", true);
                projectNameInput.focus();
                projectNameInput.scrollTo();
                Utilities.Toggle_Loading_Button("saveProject", false);
                return;
            }
            //if (!Project.ValidatePhaseDates())
            //{
            //  Utilities.Toggle_Loading_Button("saveProject", false);
            //  return;
            //}
            ProjectTracking.selected_project.project_name = projectName;
            ProjectTracking.selected_project.milestones = ProjectTracking.Milestone.ReadMilestones();
            ProjectTracking.selected_project.phases = ProjectTracking.Phase.ReadPhases();
            if (!ProjectTracking.Phase.ValidatePhases(ProjectTracking.selected_project.phases)) {
                Utilities.Toggle_Loading_Button("saveProject", false);
                return;
            }
            ProjectTracking.selected_project.department_id = parseInt(Utilities.Get_Value("projectDepartment"));
            ProjectTracking.selected_project.funding_id = parseInt(Utilities.Get_Value("projectFunding"));
            ProjectTracking.selected_project.timeline = Utilities.Get_Value("projectTimeline");
            ProjectTracking.selected_project.comment = Utilities.Get_Value("projectComment");
            ProjectTracking.selected_project.priority = PriorityLevel[Utilities.Get_Value("projectPriority")];
            ProjectTracking.selected_project.estimated_completion_date = Utilities.Get_Value("projectEstimatedCompletionDate");
            //ProjectTracking.selected_project.phase_1_name = Utilities.Get_Value("phase_1_name");
            //ProjectTracking.selected_project.phase_2_name = Utilities.Get_Value("phase_2_name");
            //ProjectTracking.selected_project.phase_3_name = Utilities.Get_Value("phase_3_name");
            //ProjectTracking.selected_project.phase_4_name = Utilities.Get_Value("phase_4_name");
            //ProjectTracking.selected_project.phase_5_name = Utilities.Get_Value("phase_5_name");
            //ProjectTracking.selected_project.phase_1_start = Utilities.Get_Date_Value("phase_1_start", true);
            //ProjectTracking.selected_project.phase_2_start = Utilities.Get_Date_Value("phase_2_start", true);
            //ProjectTracking.selected_project.phase_3_start = Utilities.Get_Date_Value("phase_3_start", true);
            //ProjectTracking.selected_project.phase_4_start = Utilities.Get_Date_Value("phase_4_start", true);
            //ProjectTracking.selected_project.phase_5_start = Utilities.Get_Date_Value("phase_5_start", true);
            //ProjectTracking.selected_project.phase_1_completion = Utilities.Get_Date_Value("phase_1_completion", true);
            //ProjectTracking.selected_project.phase_2_completion = Utilities.Get_Date_Value("phase_2_completion", true);
            //ProjectTracking.selected_project.phase_3_completion = Utilities.Get_Date_Value("phase_3_completion", true);
            //ProjectTracking.selected_project.phase_4_completion = Utilities.Get_Date_Value("phase_4_completion", true);
            //ProjectTracking.selected_project.phase_5_completion = Utilities.Get_Date_Value("phase_5_completion", true);
            //return;
            var completed = document.getElementById("projectComplete");
            ProjectTracking.selected_project.completed = completed.checked;
            var share = document.getElementById("projectCommissionerShare");
            ProjectTracking.selected_project.commissioner_share = share.checked;
            var ifshare = document.getElementById("projectInfrastructureShare");
            ProjectTracking.selected_project.infrastructure_share = ifshare.checked;
            var legislative = document.getElementById("projectLegislativeTracking");
            ProjectTracking.selected_project.legislative_tracking = legislative.checked;
            var needsattention = document.getElementById("projectNeedsAttention");
            ProjectTracking.selected_project.needs_attention = needsattention.checked;
            console.log("project to save", ProjectTracking.selected_project);
            var path = ProjectTracking.GetPath();
            var saveType = (ProjectTracking.selected_project.id > -1) ? "Update" : "Add";
            Utilities.Post_Empty(path + "API/Project/" + saveType, ProjectTracking.selected_project)
                .then(function (r) {
                console.log('post response', r);
                if (!r.ok) {
                    // do some error stuff
                    console.log('some errors happened with post response');
                }
                else {
                    // we good
                    console.log('post response good');
                    ProjectTracking.Project.GetProjects();
                    ProjectTracking.CloseModals();
                }
                Utilities.Toggle_Loading_Button("saveProject", false);
            }, function (e) {
                console.log('error getting permits', e);
                //Toggle_Loading_Search_Buttons(false);
                Utilities.Toggle_Loading_Button("saveProject", false);
            });
        };
        Project.PopulatePriorities = function () {
            var priorities = document.getElementById("projectPriority");
            Utilities.Clear_Element(priorities);
            console.log("prioritylevel", PriorityLevel);
            for (var level in PriorityLevel) {
                if (level.length < 3) {
                    var option = document.createElement("option");
                    option.value = level.toString();
                    option.appendChild(document.createTextNode(PriorityLevel[level].toString()));
                    if (level === PriorityLevel.Normal.toString())
                        option.selected = true;
                    priorities.appendChild(option);
                }
            }
        };
        Project.ToggleSummaryView = function () {
            var button = document.getElementById("toggleSummaryView");
            Utilities.Toggle_Loading_Button(button, true);
            var buttonText = document.createElement("strong");
            Utilities.Clear_Element(button);
            if (ProjectTracking.default_view) {
                Utilities.Set_Text(buttonText, "Switch to Default View");
                Utilities.Hide("projectDefaultView");
                Utilities.Show("projectSummaryView");
            }
            else {
                Utilities.Set_Text(buttonText, "Switch to Summary View");
                //Project.BuildProjectTrackingList(Project.ApplyFilters(projects));
                Utilities.Show("projectDefaultView");
                Utilities.Hide("projectSummaryView");
            }
            button.appendChild(buttonText);
            ProjectTracking.default_view = !ProjectTracking.default_view;
            Utilities.Toggle_Loading_Button(button, false);
        };
        Project.CreateGanttChartRows = function (project) {
            if (project.completed)
                return [];
            var phase_dates = [];
            for (var i = 1; i < 6; i++) {
                var name_1 = project["phase_" + i.toString() + "_name"];
                var start = project["phase_" + i.toString() + "_start"];
                var end = project["phase_" + i.toString() + "_completion"];
                if (name_1.length > 0 && name_1 !== "Ignore this Phase") {
                    phase_dates.push({
                        name: name_1,
                        start: new Date(start),
                        end: end === null ? null : new Date(end)
                    });
                }
            }
            var estimated_completion = new Date(project.estimated_completion_date);
            if (estimated_completion.getFullYear() < 1000)
                estimated_completion = null;
            if (phase_dates.length === 0)
                return phase_dates;
            for (var i = 0; i < phase_dates.length; i++) {
                var pd = phase_dates[i];
                if (pd.end === null) {
                    if (i === phase_dates.length - 1) {
                        pd.end = estimated_completion;
                    }
                    else {
                        pd.end = phase_dates[i + 1].start;
                    }
                }
            }
            var ganttrows = [];
            for (var _i = 0, phase_dates_1 = phase_dates; _i < phase_dates_1.length; _i++) {
                var pd = phase_dates_1[_i];
                ganttrows.push([pd.name, pd.name, null, pd.start, pd.end, null, 100, null]);
            }
            return ganttrows;
        };
        Project.CreateNewGanttChartRows = function (project) {
            if (project.completed)
                return [];
            var phase_dates = [];
            for (var _i = 0, _a = project.phases; _i < _a.length; _i++) 
            //for (let i = 1; i < 6; i++)
            {
                var phase = _a[_i];
                //let name = <string>project["phase_" + i.toString() + "_name"];
                //let start = <string>project["phase_" + i.toString() + "_start"];
                //let end = <string>project["phase_" + i.toString() + "_completion"];
                var name_2 = phase.name.replace("Select Phase Name", "Phase Name not entered");
                var start = phase.started_on;
                var end = phase.completed_on !== null ? phase.completed_on : phase.estimated_completion;
                if (name_2.length > 0 && name_2 !== "Ignore this Phase" && start !== null && end !== null) {
                    phase_dates.push({
                        name: name_2,
                        start: new Date(start.toString()),
                        end: new Date(end.toString())
                    });
                }
            }
            //let estimated_completion = new Date(project.estimated_completion_date);
            //if (estimated_completion.getFullYear() < 1000) estimated_completion = null;
            //if (phase_dates.length === 0) return phase_dates;
            //for (let i = 0; i < phase_dates.length; i++)
            //{
            //  let pd = phase_dates[i];
            //  if (pd.end === null)
            //  {
            //    if (i === phase_dates.length - 1)
            //    {
            //      pd.end = estimated_completion;
            //    }
            //    else
            //    {
            //      pd.end = phase_dates[i + 1].start;
            //    }
            //  }
            //}
            var ganttrows = [];
            for (var _b = 0, phase_dates_2 = phase_dates; _b < phase_dates_2.length; _b++) {
                var pd = phase_dates_2[_b];
                ganttrows.push([pd.name, pd.name, null, pd.start, pd.end, null, 100, null]);
            }
            return ganttrows;
        };
        Project.DrawGanttChart = function (project_id, rows) {
            var chart_container = document.getElementById('chart_' + project_id.toString());
            var generate_chart = false;
            if (ProjectTracking.charts[project_id] === undefined) {
                ProjectTracking.charts[project_id] = new google.visualization.Gantt(chart_container);
                generate_chart = true;
            }
            var grandparent = chart_container.parentElement.parentElement;
            grandparent.classList.toggle("hide");
            if (rows.length === 0 || !generate_chart)
                return;
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Task ID');
            data.addColumn('string', 'Task Name');
            data.addColumn('string', 'Resource');
            data.addColumn('date', 'Start Date');
            data.addColumn('date', 'End Date');
            data.addColumn('number', 'Duration');
            data.addColumn('number', 'Percent Complete');
            data.addColumn('string', 'Dependencies');
            data.addRows(rows);
            var options = {
                height: (rows.length * 50) + 50,
                gantt: {
                    percentEnabled: false,
                    criticalPathEnabled: false,
                    labelStyle: {
                        fontName: "Segoe UI",
                        fontSize: 16,
                        color: '#363636'
                    }
                }
            };
            ProjectTracking.charts[project_id].draw(data, options);
        };
        return Project;
    }());
    ProjectTracking.Project = Project;
})(ProjectTracking || (ProjectTracking = {}));
//# sourceMappingURL=Project.js.map