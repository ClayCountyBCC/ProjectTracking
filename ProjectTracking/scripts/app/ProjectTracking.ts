/// <reference path="../utilities/utilities.ts" />

namespace ProjectTracking
{
  "use strict";

  export let selected_project: Project = new Project();
  export let projects: Array<Project> = [];
  export let filtered_projects: Array<Project> = [];
  export let departments: Array<DataValue> = [];
  export let my_departments: Array<DataValue> = [];
  export let funding_sources: Array<DataValue> = [];
  export let number_of_milestones: number = 0;
  export let project_name_filter = '';

  export function Start(): void
  {
    DataValue.GetDepartments();
    DataValue.GetFunding();
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

  export function FilterProjectNames(input: HTMLInputElement)
  {
    let v = input.value.trim();
    project_name_filter = v.length > 2 ? v : '';    
    Project.BuildProjectTrackingList(Project.ApplyFilters(ProjectTracking.projects));
  }

  export function FinishedLoading()
  {
    //let button = document.getElementById("addProjectButton");
    Utilities.Toggle_Loading_Button("addProjectButton", false);
    Utilities.Show("filters");
  }

  export function AddProjectResultsMessage(message: string):void
  {
    let container = document.getElementById("projectList");
    Utilities.Clear_Element(container);
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    td.colSpan = 6;
    td.appendChild(document.createTextNode(message));
    tr.appendChild(td);
    container.appendChild(tr);
  }

}