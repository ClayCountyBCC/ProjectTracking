/// <reference path="../utilities/utilities.ts" />
var ProjectTracking;
(function (ProjectTracking) {
    "use strict";
    ProjectTracking.selected_project = new ProjectTracking.Project();
    ProjectTracking.projects = [];
    ProjectTracking.filtered_projects = [];
    ProjectTracking.departments = [];
    ProjectTracking.my_departments = [];
    ProjectTracking.funding_sources = [];
    ProjectTracking.number_of_milestones = 0;
    ProjectTracking.project_name_filter = '';
    function Start() {
        ProjectTracking.DataValue.GetDepartments();
        ProjectTracking.DataValue.GetFunding();
        ProjectTracking.DataValue.GetMyDepartments();
        ProjectTracking.Project.GetProjects();
        ProjectTracking.Project.PopulatePriorities();
    }
    ProjectTracking.Start = Start;
    function ShowAddProject() {
        document.getElementById("addProject").classList.add("is-active");
    }
    ProjectTracking.ShowAddProject = ShowAddProject;
    function CloseModals() {
        Utilities.Toggle_Loading_Button("saveProject", false);
        var modals = document.querySelectorAll(".modal");
        if (modals.length > 0) {
            for (var i = 0; i < modals.length; i++) {
                var modal = modals.item(i);
                modal.classList.remove("is-active");
            }
        }
    }
    ProjectTracking.CloseModals = CloseModals;
    function GetPath() {
        var path = "/";
        var i = window.location.pathname.toLowerCase().indexOf("/projecttracking");
        if (i == 0) {
            path = "/projecttracking/";
        }
        return path;
    }
    ProjectTracking.GetPath = GetPath;
    function FilterProjects() {
        ProjectTracking.Project.BuildProjectTrackingList(ProjectTracking.Project.ApplyFilters(ProjectTracking.projects));
    }
    ProjectTracking.FilterProjects = FilterProjects;
    function FilterProjectNames(input) {
        var v = input.value.trim();
        ProjectTracking.project_name_filter = v.length > 2 ? v : '';
        ProjectTracking.Project.BuildProjectTrackingList(ProjectTracking.Project.ApplyFilters(ProjectTracking.projects));
    }
    ProjectTracking.FilterProjectNames = FilterProjectNames;
    function FinishedLoading() {
        //let button = document.getElementById("addProjectButton");
        Utilities.Toggle_Loading_Button("addProjectButton", false);
        Utilities.Show("filters");
    }
    ProjectTracking.FinishedLoading = FinishedLoading;
    function AddProjectResultsMessage(message) {
        var container = document.getElementById("projectList");
        Utilities.Clear_Element(container);
        var tr = document.createElement("tr");
        var td = document.createElement("td");
        td.colSpan = 6;
        td.appendChild(document.createTextNode(message));
        tr.appendChild(td);
        container.appendChild(tr);
    }
    ProjectTracking.AddProjectResultsMessage = AddProjectResultsMessage;
})(ProjectTracking || (ProjectTracking = {}));
//# sourceMappingURL=ProjectTracking.js.map