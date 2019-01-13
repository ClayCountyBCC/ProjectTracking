﻿namespace ProjectTracking
{
  "use strict";

  interface IMilestone
  {
    id: number;
    project_id: number;
    name: string;
    display_order: number;
  }

  export class Milestone implements IMilestone
  {
    public id: number = -1;
    public project_id: number = -1;
    public name: string = "";
    public display_order: number = -1;

    constructor() { }

    public static AddMilestone(): void
    {
      ProjectTracking.number_of_milestones++;
      let nm = ProjectTracking.number_of_milestones.toString();

      let container = Milestone.GetContainer();
      let df = document.createDocumentFragment();

      let tr = document.createElement("tr");
      tr.id = "milestone" + nm;

      let count = document.createElement("td");
      count.style.textAlign = "center";
      count.style.verticalAlign = "middle";
      count.appendChild(document.createTextNode(nm))
      tr.appendChild(count);

      let inputCell = document.createElement("td");
      let field = document.createElement("div");
      field.classList.add("field");
      let control = document.createElement("div");
      control.classList.add("control");
      control.classList.add("is-medium");
      let input = document.createElement("input");
      input.classList.add("input");
      input.classList.add("is-medium");
      input.type = "text";
      input.id = "projectMilestone" + nm;
      control.appendChild(input);
      field.appendChild(control);
      inputCell.appendChild(field);
      tr.appendChild(inputCell);

      let buttonCell = document.createElement("td");
      let buttonField = document.createElement("div");
      buttonField.classList.add("field");
      buttonField.classList.add("is-grouped");

      let controlUp = document.createElement("div");
      controlUp.classList.add("control");

      let moveUp = document.createElement("button");
      moveUp.id = "milestoneUp" + nm;
      moveUp.type = "button";
      moveUp.style.borderRadius = "99px";
      moveUp.setAttribute("aria-label", "Move Milestone Up");
      moveUp.classList.add("button");
      moveUp.classList.add("is-medium");
      moveUp.disabled = ProjectTracking.number_of_milestones === 1;
      moveUp.onclick = function ()
      {
        Milestone.MoveUp(nm);
      }

      let moveUpIconspan = document.createElement("span");
      moveUpIconspan.classList.add("icon");
      moveUpIconspan.classList.add("is-large");
      let moveUpIcon = document.createElement("i");
      moveUpIcon.classList.add("fas");
      moveUpIcon.classList.add("fa-arrow-circle-up");
      moveUpIcon.classList.add("fa-2x");
      moveUpIconspan.appendChild(moveUpIcon);
      moveUp.appendChild(moveUpIconspan);
      controlUp.appendChild(moveUp);

      let controlDown = document.createElement("div");
      controlDown.classList.add("control");

      let moveDown = document.createElement("button");
      moveDown.id = "milestoneDown" + nm;
      moveDown.type = "button";
      moveDown.style.borderRadius = "99px";
      moveDown.setAttribute("aria-label", "Move Milestone Down");
      moveDown.classList.add("button");
      moveDown.classList.add("is-medium");
      moveDown.disabled = true;
      moveDown.onclick = function ()
      {
        Milestone.MoveDown(nm);
      }

      let moveDownIconspan = document.createElement("span");
      moveDownIconspan.classList.add("icon");
      moveDownIconspan.classList.add("is-large");
      let moveDownIcon = document.createElement("i");
      moveDownIcon.classList.add("fas");
      moveDownIcon.classList.add("fa-arrow-circle-down");
      moveDownIcon.classList.add("fa-2x");
      moveDownIconspan.appendChild(moveDownIcon);
      moveDown.appendChild(moveDownIconspan);
      controlUp.appendChild(moveDown);

      let controlRemove = document.createElement("div");
      controlRemove.classList.add("control");

      let removeButton = document.createElement("button");
      removeButton.id = "milestoneRemove" + nm;
      removeButton.classList.add("is-warning");
      removeButton.classList.add("button");
      removeButton.classList.add("is-medium");
      removeButton.disabled = ProjectTracking.number_of_milestones === 1;
      removeButton.appendChild(document.createTextNode("Remove"));
      removeButton.onclick = function ()
      {
        Milestone.Remove(nm);
      }
      controlRemove.appendChild(removeButton);


      buttonField.appendChild(controlUp);
      buttonField.appendChild(controlDown);
      buttonField.appendChild(controlRemove);
      buttonCell.appendChild(buttonField);

      tr.appendChild(buttonCell);
      df.appendChild(tr);
      container.appendChild(df);

      Milestone.UpdateMilestoneButtons();
    }

    public static MoveUp(rowId: string): void
    {
      let row = parseInt(rowId);
      if (row > 1)
      {
        let currentId = "projectMilestone" + rowId;
        let upId = "projectMilestone" + (row - 1).toString()
        let current = Utilities.Get_Value(currentId);
        let up = Utilities.Get_Value(upId);
        Utilities.Set_Value(currentId, up);
        Utilities.Set_Value(upId, current);
      }
    }

    public static MoveDown(rowId: string): void
    {
      let row = parseInt(rowId);
      if (row < ProjectTracking.number_of_milestones)
      {
        let currentId = "projectMilestone" + rowId;
        let downId = "projectMilestone" + (row + 1).toString()
        let current = Utilities.Get_Value(currentId);
        let down = Utilities.Get_Value(downId);
        Utilities.Set_Value(currentId, down);
        Utilities.Set_Value(downId, current);
      }
    }

    public static Remove(rowId: string): void
    {
      // what we'll do here is move all of the milestones above this one up one and then remove
      // the last one.
      let row = parseInt(rowId);
      if (row < ProjectTracking.number_of_milestones)
      {
        for (var m = row; m <= ProjectTracking.number_of_milestones; m++)
        {
          Milestone.MoveDown(m.toString());
        }
      }

      let e = document.getElementById("milestone" + ProjectTracking.number_of_milestones.toString());
      e.parentNode.removeChild(e);
      ProjectTracking.number_of_milestones--;
      Milestone.UpdateMilestoneButtons();
    }

    public static UpdateMilestoneButtons(): void
    {
      for (var i = 1; i <= ProjectTracking.number_of_milestones; i++)
      {
        let moveDown = <HTMLButtonElement>document.getElementById("milestoneDown" + i.toString());
        moveDown.disabled = (i === ProjectTracking.number_of_milestones);
        let remove = <HTMLButtonElement>document.getElementById("milestoneRemove" + i.toString());
        remove.disabled = (ProjectTracking.number_of_milestones === 1);
      }
    }

    private static GetContainer(): HTMLElement
    {
      return document.getElementById("projectMilestones");
    }

    public static ClearMilestones(): void
    {
      ProjectTracking.number_of_milestones = 0;
      Utilities.Clear_Element(Milestone.GetContainer());
    }

    public static LoadMilestones(milestones: Array<Milestone>)
    {
      Milestone.ClearMilestones();
      for (let m of milestones)
      {
        Milestone.AddMilestone();
      }
      for (let m of milestones)
      {
        Milestone.UpdateMilestone(m);
      }
      Milestone.UpdateMilestoneButtons();
    }

    public static UpdateMilestone(milestone: Milestone)
    {
      Utilities.Set_Value("projectMilestone" + milestone.display_order.toString(), milestone.name);
    }

    public static MilestonesView(milestones: Array<Milestone>): DocumentFragment
    {
      milestones.sort(function (a, b) { return a.display_order - b.display_order; });

      let df = document.createDocumentFragment();
      if (milestones.length === 0) return df;
      let ol = document.createElement("ol");
      ol.classList.add("comments");
      for (let m of milestones)
      {
        let li = document.createElement("li");
        li.appendChild(document.createTextNode(m.name));
        ol.appendChild(li);
      }
      df.appendChild(ol);
      return df;
    }

  }
}