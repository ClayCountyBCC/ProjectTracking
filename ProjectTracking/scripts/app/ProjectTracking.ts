/// <reference path="../utilities/utilities.ts" />

namespace ProjectTracking
{
  "use strict";

  export let selected_project: Project = new Project();
  export let projects: Array<Project> = [];
  export let filtered_projects: Array<Project> = [];
  export let departments: Array<DataValue> = [];
  export let my_departments: Array<DataValue> = [];
  export let number_of_milestones: number = 0;

  export function Start(): void
  {
    DataValue.GetDepartments();
    DataValue.GetMyDepartments();
    Project.GetProjects();
  }

  export function ShowAddProject(): void
  {
    document.getElementById("addProject").classList.add("is-active");
  }

  export function CloseModals(): void
  {
    Utilities.Toggle_Loading_Button("saveProject", false);
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

  export function GetPath(): string
  {
    let path = "/";
    let i = window.location.pathname.toLowerCase().indexOf("/projecttracking");
    if (i == 0)
    {
      path = "/projecttracking/";
    }
    return path;
  }  

  export function FilterProjects()
  {
    Project.BuildProjectTrackingList(Project.ApplyFilters(ProjectTracking.projects));
  }

  export function FinishedLoading()
  {
    //let button = document.getElementById("addProjectButton");
    Utilities.Toggle_Loading_Button("addProjectButton", false);
    Utilities.Show("filters");
  }

}