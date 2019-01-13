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
        p.date_last_updated = new Date();
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
        ProjectTracking.projects.push(p);
        var p2 = new ProjectTracking.Project();
        p2.project_name = "County Park Plan";
        p2.department = "3201";
        p2.date_last_updated = Date.parse('1/1/2019');
        m1 = new ProjectTracking.Milestone();
        m1.display_order = 1;
        m1.name = "Safety netting - included in this year's budget";
        p2.milestones.push(m1);
        m2 = new ProjectTracking.Milestone();
        m2.display_order = 2;
        m2.name = "Department of Agriculture Grants for Fairgrounds improvements: submitted to DOACS (Working with our Lobbyist on this grant)";
        p2.milestones.push(m2);
        var m3 = new ProjectTracking.Milestone();
        m3.display_order = 3;
        m3.name = "Sharing Facilities with Clay County Schools - Agreement sent to the School District Staff";
        p2.milestones.push(m3);
        var m4 = new ProjectTracking.Milestone();
        m4.display_order = 4;
        m4.name = "Fleming Island Baseball / Softball - Staff evaluating the bids now";
        p2.milestones.push(m4);
        var m5 = new ProjectTracking.Milestone();
        m5.display_order = 5;
        m5.name = "Omega Drainage (90%) and Concession. Completion days January 2 (does not include rain days)";
        p2.milestones.push(m5);
        ProjectTracking.projects.push(p2);
        ProjectTracking.Project.BuildProjectTrackingList(ProjectTracking.projects);
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