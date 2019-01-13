var ProjectTracking;
(function (ProjectTracking) {
    "use strict";
    var Project = /** @class */ (function () {
        function Project() {
            this.id = -1;
            this.project_name = "";
            this.department = "";
            this.timeline = "";
            this.commissioner_share = false;
            this.completed = false;
            this.date_last_updated = new Date();
            this.date_completed = new Date();
            this.can_edit = false;
            this.milestones = [];
            this.comments = [];
        }
        Project.AddProject = function () {
            // this function is going to reset all of the New
            // project form's values and get it ready to have a new project created.
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
            Project.UpdateProjectDepartment(project.department);
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
        Project.UpdateCommissionerShare = function (complete) {
            var share = document.getElementById("projectCommissionerShare");
            share.checked = complete;
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
            var a = document.createElement("a");
            a.appendChild(document.createTextNode(project.project_name));
            a.onclick = function () {
                Project.LoadProject(project);
            };
            projectName.appendChild(a);
            tr.appendChild(projectName);
            var department = document.createElement("td");
            var departmentNames = ProjectTracking.departments.filter(function (d) { return d.value === project.department; });
            var departmentName = departmentNames.length > 0 ? departmentNames[0].label : "";
            department.appendChild(document.createTextNode(departmentName));
            tr.appendChild(department);
            var milestones = document.createElement("td");
            milestones.appendChild(ProjectTracking.Milestone.MilestonesView(project.milestones));
            tr.appendChild(milestones);
            var timeline = document.createElement("td");
            timeline.appendChild(document.createTextNode(project.timeline));
            tr.appendChild(timeline);
            var comments = document.createElement("td");
            var df = ProjectTracking.Comment.CommentsView(project.comments, false);
            var addComments = document.createElement("a");
            //addComments.classList.add("button");
            addComments.classList.add("is-primary");
            addComments.appendChild(document.createTextNode("Add Comment"));
            df.appendChild(addComments);
            comments.appendChild(df);
            tr.appendChild(comments);
            var dateUpdated = document.createElement("td");
            dateUpdated.appendChild(document.createTextNode(Utilities.Format_Date(project.date_last_updated)));
            tr.appendChild(dateUpdated);
            return tr;
        };
        return Project;
    }());
    ProjectTracking.Project = Project;
})(ProjectTracking || (ProjectTracking = {}));
//# sourceMappingURL=Project.js.map