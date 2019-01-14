var ProjectTracking;
(function (ProjectTracking) {
    "use strict";
    var Project = /** @class */ (function () {
        function Project() {
            this.id = -1;
            this.project_name = "";
            this.department_id = -1;
            this.timeline = "";
            this.commissioner_share = false;
            this.completed = false;
            this.date_last_updated = null;
            this.date_completed = null;
            this.can_edit = false;
            this.milestones = [];
            this.comments = [];
        }
        Project.GetProjects = function () {
            ProjectTracking.departments = [];
            var path = ProjectTracking.GetPath();
            Utilities.Get(path + "API/Project/List")
                .then(function (projects) {
                console.log("projects", projects);
                ProjectTracking.projects = projects;
                Project.BuildProjectTrackingList(Project.ApplyFilters(projects));
                ProjectTracking.FinishedLoading();
            }, function (e) {
                var container = document.getElementById("projectList");
                Utilities.Clear_Element(container);
                var tr = document.createElement("tr");
                var td = document.createElement("td");
                td.colSpan = 6;
                td.appendChild(document.createTextNode("There was a problem retrieving a list of projects.  Please try again. If this issue persists, please put in a help desk ticket."));
                container.appendChild(tr);
                console.log('error getting permits', e);
            });
        };
        Project.ApplyFilters = function (projects) {
            var departmentFilter = Utilities.Get_Value("departmentFilter");
            var shareFilter = document.getElementById("projectCommissionerShareFilter").checked;
            var completedFilter = document.getElementById("projectCompleteFilter").checked;
            projects = projects.filter(function (j) {
                return (departmentFilter.length === 0 ||
                    j.department_id.toString() === departmentFilter ||
                    (departmentFilter === "mine" && j.can_edit));
            });
            projects = projects.filter(function (j) {
                return ((shareFilter && j.commissioner_share) || !shareFilter);
            });
            projects = projects.filter(function (j) {
                return ((completedFilter && j.completed) || !completedFilter);
            });
            return projects;
        };
        Project.AddProject = function () {
            // this function is going to reset all of the New
            // project form's values and get it ready to have a new project created.
            ProjectTracking.selected_project = new Project(); // the object we'll be saving
            Project.UpdateProjectName("");
            Project.UpdateProjectDepartment("");
            ProjectTracking.Milestone.ClearMilestones();
            Project.UpdateProjectTimeline("");
            Project.UpdateProjectCompleted(false);
            Project.UpdateCommissionerShare(false);
            var commentsContainer = document.getElementById("existingCommentsContainer");
            Utilities.Hide(commentsContainer);
            Utilities.Clear_Element(commentsContainer);
            Project.ClearComment();
            ProjectTracking.ShowAddProject();
        };
        Project.LoadProject = function (project) {
            project.comments = project.comments.filter(function (j) { return j.comment.length > 0; });
            Project.UpdateProjectName(project.project_name);
            Project.UpdateProjectDepartment(project.department_id.toString());
            ProjectTracking.Milestone.LoadMilestones(project.milestones);
            Project.UpdateProjectTimeline(project.timeline);
            Project.UpdateProjectCompleted(project.completed);
            Project.UpdateCommissionerShare(project.commissioner_share);
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
        Project.UpdateProjectTimeline = function (timeline) {
            Utilities.Set_Value("projectTimeline", timeline);
        };
        Project.UpdateProjectCompleted = function (complete) {
            var completed = document.getElementById("projectComplete");
            completed.checked = complete;
        };
        Project.UpdateCommissionerShare = function (share) {
            var shared = document.getElementById("projectCommissionerShare");
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
            var projectName = document.createElement("td");
            var comments = document.createElement("td");
            var dfComments = ProjectTracking.Comment.CommentsView(project.comments, false);
            if (project.can_edit) {
                var a = document.createElement("a");
                a.appendChild(document.createTextNode(project.project_name));
                a.onclick = function () {
                    console.log("update this project", project);
                    ProjectTracking.selected_project = project; // this is the project we'll be attempting to update.
                    Project.LoadProject(project);
                    console.log('selected_project', ProjectTracking.selected_project);
                };
                projectName.appendChild(a);
                // handle add comments button here
                var addComments = document.createElement("a");
                addComments.classList.add("is-primary");
                addComments.appendChild(document.createTextNode("Add Comment"));
                dfComments.appendChild(addComments);
            }
            else {
                projectName.appendChild(document.createTextNode(project.project_name));
            }
            comments.appendChild(dfComments);
            tr.appendChild(projectName);
            var department = document.createElement("td");
            var departmentNames = ProjectTracking.departments.filter(function (d) { return d.Value === project.department_id.toString(); });
            var departmentName = departmentNames.length > 0 ? departmentNames[0].Label : "";
            department.appendChild(document.createTextNode(departmentName));
            tr.appendChild(department);
            var milestones = document.createElement("td");
            milestones.appendChild(ProjectTracking.Milestone.MilestonesView(project.milestones));
            tr.appendChild(milestones);
            var timeline = document.createElement("td");
            timeline.appendChild(document.createTextNode(project.timeline));
            tr.appendChild(timeline);
            tr.appendChild(comments);
            var dateUpdated = document.createElement("td");
            dateUpdated.appendChild(document.createTextNode(Utilities.Format_Date(project.date_last_updated)));
            tr.appendChild(dateUpdated);
            return tr;
        };
        Project.Save = function () {
            // let's lock the button down so the user can't click it multiple times
            // we'll also want to update it to show that it's loading
            var saveButton = document.getElementById("saveProject");
            Utilities.Toggle_Loading_Button("saveProject", true);
            ProjectTracking.selected_project.project_name = Utilities.Get_Value("projectName");
            ProjectTracking.selected_project.milestones = ProjectTracking.Milestone.ReadMilestones();
            ProjectTracking.selected_project.department_id = parseInt(Utilities.Get_Value("projectDepartment"));
            ProjectTracking.selected_project.timeline = Utilities.Get_Value("projectTimeline");
            ProjectTracking.selected_project.comment = Utilities.Get_Value("projectComment");
            var completed = document.getElementById("projectComplete");
            ProjectTracking.selected_project.completed = completed.checked;
            var share = document.getElementById("projectCommissionerShare");
            ProjectTracking.selected_project.commissioner_share = share.checked;
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
        return Project;
    }());
    ProjectTracking.Project = Project;
})(ProjectTracking || (ProjectTracking = {}));
//# sourceMappingURL=Project.js.map