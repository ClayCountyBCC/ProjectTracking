/// <reference path="../utilities/utilities.ts" />

namespace ProjectTracking
{
  "use strict";

  export let projects: Array<Project> = [];

  export function Start():void
  {
    //GetDepartmentList()
    //GetDefaultProjectList()

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