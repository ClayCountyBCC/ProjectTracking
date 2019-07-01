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
        }
        Project.GetProjects = function () {
            var buttonId = "filterRefreshButton";
            Utilities.Toggle_Loading_Button(buttonId, true);
            var path = ProjectTracking.GetPath();
            Utilities.Get(path + "API/Project/List")
                .then(function (projects) {
                console.log("projects", projects);
                ProjectTracking.projects = projects;
                Project.BuildProjectTrackingList(Project.ApplyFilters(projects));
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
            Project.UpdateProjectTimeline("");
            Project.UpdateProjectCompleted(false);
            Project.UpdateNeedsAttention(false);
            Project.UpdateProjectPriority(1);
            Project.UpdateCommissionerShare(false);
            Project.UpdateInfrastructureShare(false);
            Project.UpdateLegislativeTracking(false);
            Project.UpdateProjectEstimatedCompletionDate("");
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
            Project.UpdateProjectTimeline(project.timeline);
            Project.UpdateProjectCompleted(project.completed);
            Project.UpdateCommissionerShare(project.commissioner_share);
            Project.UpdateInfrastructureShare(project.infrastructure_share);
            Project.UpdateLegislativeTracking(project.legislative_tracking);
            Project.UpdateNeedsAttention(project.needs_attention);
            Project.UpdateProjectEstimatedCompletionDate(project.estimated_completion_date);
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
            milestones.appendChild(ProjectTracking.Milestone.MilestonesView(project.milestones));
            tr.appendChild(milestones);
            var timeline = document.createElement("td");
            timeline.appendChild(document.createTextNode(project.timeline));
            tr.appendChild(timeline);
            tr.appendChild(comments);
            var dateUpdated = document.createElement("td");
            var dateUpdatedContainer = document.createElement("div");
            dateUpdatedContainer.classList.add("has-text-centered");
            dateUpdated.appendChild(dateUpdatedContainer);
            dateUpdatedContainer.appendChild(document.createTextNode(Utilities.Format_Date(project.date_last_updated)));
            if (new Date(project.estimated_completion_date.toString()).getFullYear() > 1000) {
                var hr = document.createElement("hr");
                dateUpdatedContainer.appendChild(hr);
                var p = document.createElement("p");
                p.appendChild(document.createTextNode(Utilities.Format_Date(project.estimated_completion_date)));
                dateUpdatedContainer.appendChild(p);
            }
            tr.appendChild(dateUpdated);
            return tr;
        };
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
            ProjectTracking.selected_project.project_name = projectName;
            ProjectTracking.selected_project.milestones = ProjectTracking.Milestone.ReadMilestones();
            ProjectTracking.selected_project.department_id = parseInt(Utilities.Get_Value("projectDepartment"));
            ProjectTracking.selected_project.funding_id = parseInt(Utilities.Get_Value("projectFunding"));
            ProjectTracking.selected_project.timeline = Utilities.Get_Value("projectTimeline");
            ProjectTracking.selected_project.comment = Utilities.Get_Value("projectComment");
            ProjectTracking.selected_project.priority = PriorityLevel[Utilities.Get_Value("projectPriority")];
            ProjectTracking.selected_project.estimated_completion_date = Utilities.Get_Value("projectEstimatedCompletionDate");
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
        return Project;
    }());
    ProjectTracking.Project = Project;
})(ProjectTracking || (ProjectTracking = {}));
//# sourceMappingURL=Project.js.map