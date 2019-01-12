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
    
    Project.LoadProject(p);
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