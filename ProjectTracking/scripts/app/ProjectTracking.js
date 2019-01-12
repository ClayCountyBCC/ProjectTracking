/// <reference path="../utilities/utilities.ts" />
var ProjectTracking;
(function (ProjectTracking) {
    "use strict";
    ProjectTracking.projects = [];
    ProjectTracking.departments = [];
    ProjectTracking.number_of_milestones = 0;
    ProjectTracking.new_project = new ProjectTracking.Project();
    function Start() {
        ProjectTracking.DataValue.GetDepartments();
        //GetDepartmentList()
        //GetDefaultProjectList()
        var p = new ProjectTracking.Project();
        p.project_name = "test";
        p.department = "0107";
        var m1 = new ProjectTracking.Milestone();
        m1.display_order = 1;
        m1.name = "test 1";
        p.milestones.push(m1);
        var m2 = new ProjectTracking.Milestone();
        m2.display_order = 2;
        m2.name = "test 2";
        p.milestones.push(m2);
        p.timeline = "soon";
        var c1 = new ProjectTracking.Comment();
        c1.id = 1;
        c1.comment = "test 1";
        c1.added_by = "mccartneyd";
        p.comments.push(c1);
        var c2 = new ProjectTracking.Comment();
        c2.id = 2;
        c2.comment = "test 2";
        c2.added_by = "mccartneyd";
        p.comments.push(c2);
        var c3 = new ProjectTracking.Comment();
        c3.id = 3;
        c3.added_by = "mccartneyd";
        c3.update_only = true;
        c3.comment = "";
        p.comments.push(c3);
        p.commissioner_share = true;
        p.completed = true;
        ProjectTracking.Project.LoadProject(p);
    }
    ProjectTracking.Start = Start;
    function ShowAddProject() {
        document.getElementById("addProject").classList.add("is-active");
    }
    ProjectTracking.ShowAddProject = ShowAddProject;
    function CloseModals() {
        var modals = document.querySelectorAll(".modal");
        if (modals.length > 0) {
            for (var i = 0; i < modals.length; i++) {
                var modal = modals.item(i);
                modal.classList.remove("is-active");
            }
        }
    }
    ProjectTracking.CloseModals = CloseModals;
})(ProjectTracking || (ProjectTracking = {}));
//# sourceMappingURL=ProjectTracking.js.map