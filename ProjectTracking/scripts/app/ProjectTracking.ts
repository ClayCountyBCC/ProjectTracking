/// <reference path="../utilities/utilities.ts" />

namespace ProjectTracking
{
  "use strict";

  export let projects: Array<Project> = [];
  export let departments: Array<DataValue> = [];
  export let number_of_milestones: number = 0;
  export let new_project: Project = new Project();

  export function Start():void
  {
    DataValue.GetDepartments();
    //GetDepartmentList()
    //GetDefaultProjectList()
    let p = new Project();
    p.project_name = "test";
    p.department = "0107";
    p.date_last_updated = new Date();

    let m1 = new Milestone();
    m1.display_order = 1;
    m1.name = "test 1";
    p.milestones.push(m1);
    let m2 = new Milestone();
    m2.display_order = 2;
    m2.name = "test 2";
    p.milestones.push(m2);

    p.timeline = "soon";

    let c1 = new Comment();
    c1.id = 1;
    c1.comment = "test 1";
    c1.added_by = "mccartneyd";    
    p.comments.push(c1);

    let c2 = new Comment();
    c2.id = 2;
    c2.comment = "test 2"
    c2.added_by = "mccartneyd";
    p.comments.push(c2);

    let c3 = new Comment();
    c3.id = 3;
    c3.added_by = "mccartneyd";
    c3.update_only = true;
    c3.comment = "";
    p.comments.push(c3);

    p.commissioner_share = true;
    p.completed = true;
    
    projects.push(p);

    let p2 = new Project();
    p2.project_name = "County Park Plan";
    p2.department = "3201";
    p2.date_last_updated = Date.parse('1/1/2019');

    m1 = new Milestone();
    m1.display_order = 1;
    m1.name = "Safety netting - included in this year's budget";
    p2.milestones.push(m1);

    m2 = new Milestone();
    m2.display_order = 2;
    m2.name = "Department of Agriculture Grants for Fairgrounds improvements: submitted to DOACS (Working with our Lobbyist on this grant)";
    p2.milestones.push(m2);

    let m3 = new Milestone();
    m3.display_order = 3;
    m3.name = "Sharing Facilities with Clay County Schools - Agreement sent to the School District Staff";
    p2.milestones.push(m3);

    let m4 = new Milestone();
    m4.display_order = 4;
    m4.name = "Fleming Island Baseball / Softball - Staff evaluating the bids now";
    p2.milestones.push(m4);

    let m5 = new Milestone();
    m5.display_order = 5;
    m5.name = "Omega Drainage (90%) and Concession. Completion days January 2 (does not include rain days)";
    p2.milestones.push(m5);

    projects.push(p2);
    Project.BuildProjectTrackingList(projects);
  }

  export function ShowAddProject(): void
  {
    document.getElementById("addProject").classList.add("is-active");
  }

  export function CloseModals(): void
  {
    let modals = document.querySelectorAll(".modal");
    if (modals.length > 0)
    {
      for (let i = 0; i < modals.length; i++)
      {
        let modal = modals.item(i);
        modal.classList.remove("is-active");
      }
    }
  }

}