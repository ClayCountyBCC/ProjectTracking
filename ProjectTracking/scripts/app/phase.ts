namespace ProjectTracking
{
  interface IPhase
  {
    project_id: number;
    phase_order: number;
    name: string;
    started_on: Date;
    estimated_completion: Date;
    completed_on: Date;

  }
  export class Phase implements IPhase
  {
    public project_id: number = -1;
    public phase_order: number = -1;
    public name: string = "";
    public started_on: Date;
    public estimated_completion: Date;
    public completed_on: Date;

    constructor() { }

    public static AddPhase(): void
    {
      let phase_names = [
        "Develop Specifications",
        "Procurement",
        "Design",
        "Bid - Contract Development",
        "Bid",
        "Right of Way - Property Acquisition",
        "RFQ - Contract Development",
        "Regulatory Approval",
        "Implementation",
        "Construction"
      ]

      ProjectTracking.number_of_phases++;
      let nm = ProjectTracking.number_of_phases.toString();

      let container = Phase.GetContainer();
      let df = document.createDocumentFragment();

      let tr = document.createElement("tr");
      tr.id = "phase" + nm;

      let count = document.createElement("td");
      count.style.textAlign = "center";
      count.style.verticalAlign = "middle";
      count.appendChild(document.createTextNode(nm))
      tr.appendChild(count);

      let inputCell = document.createElement("td");
      let field_input = document.createElement("div");
      field_input.classList.add("field");
      let control_input = document.createElement("div");
      control_input.classList.add("control");
      control_input.classList.add("is-medium");
      let control_select = document.createElement("div");
      control_select.classList.add("select");
      control_input.appendChild(control_select);
      let phase_select = document.createElement("select");
      phase_select.classList.add("is-medium");
      phase_select.id = "projectPhase" + nm;
      phase_select.add(Utilities.Create_Option("", "Select Phase Name", true));
      for (let name of phase_names)
      {
        phase_select.add(Utilities.Create_Option(name, name, false));
      }
      control_select.appendChild(phase_select);
      //let input = document.createElement("input");
      //input.classList.add("input");
      //input.classList.add("is-medium");
      //input.type = "text";
      //input.id = "projectPhase" + nm;
      //control_input.appendChild(input);
      field_input.appendChild(control_input);
      inputCell.appendChild(field_input);
      tr.appendChild(inputCell);

      let start_cell = document.createElement("td");
      let start_field_input = document.createElement("div");
      start_field_input.classList.add("field");
      let start_control_input = document.createElement("div");
      start_control_input.classList.add("control");
      start_control_input.classList.add("is-medium");
      let start_input = document.createElement("input");
      start_input.classList.add("input");
      start_input.classList.add("is-medium");
      start_input.type = "date";
      start_input.id = "projectPhaseStart" + nm;
      start_control_input.appendChild(start_input);
      start_field_input.appendChild(start_control_input);
      start_cell.appendChild(start_field_input);
      tr.appendChild(start_cell);

      let est_cell = document.createElement("td");
      let est_field_input = document.createElement("div");
      est_field_input.classList.add("field");
      let est_control_input = document.createElement("div");
      est_control_input.classList.add("control");
      est_control_input.classList.add("is-medium");
      let est_input = document.createElement("input");
      est_input.classList.add("input");
      est_input.classList.add("is-medium");
      est_input.type = "Date";
      est_input.id = "projectPhaseEst" + nm;
      est_control_input.appendChild(est_input);
      est_field_input.appendChild(est_control_input);
      est_cell.appendChild(est_field_input);
      tr.appendChild(est_cell);

      let completion_cell = document.createElement("td");
      let completion_field_input = document.createElement("div");
      completion_field_input.classList.add("field");
      let completion_control_input = document.createElement("div");
      completion_control_input.classList.add("control");
      completion_control_input.classList.add("is-medium");
      let completion_input = document.createElement("input");
      completion_input.classList.add("input");
      completion_input.classList.add("is-medium");
      completion_input.type = "Date";
      completion_input.id = "projectPhaseCompletion" + nm;
      completion_control_input.appendChild(completion_input);
      completion_field_input.appendChild(completion_control_input);
      completion_cell.appendChild(completion_field_input);
      tr.appendChild(completion_cell);



      let buttonCell = document.createElement("td");
      let buttonField = document.createElement("div");
      buttonField.classList.add("field");
      buttonField.classList.add("is-grouped");

      let controlUp = document.createElement("div");
      controlUp.classList.add("control");

      let moveUp = document.createElement("button");
      moveUp.id = "phaseUp" + nm;
      moveUp.type = "button";
      moveUp.style.borderRadius = "99px";
      moveUp.setAttribute("aria-label", "Move Phase Up");
      moveUp.setAttribute("title", "Move Phase Up");
      moveUp.classList.add("button");
      moveUp.classList.add("is-medium");
      moveUp.disabled = ProjectTracking.number_of_phases === 1;
      moveUp.onclick = function ()
      {
        Phase.MoveUp(nm);
      }

      let moveUpIconspan = document.createElement("span");
      moveUpIconspan.classList.add("icon");
      moveUpIconspan.classList.add("is-medium");
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
      moveDown.id = "phaseDown" + nm;
      moveDown.type = "button";
      moveDown.style.borderRadius = "99px";
      moveDown.setAttribute("aria-label", "Move Phase Down");
      moveDown.classList.add("button");
      moveDown.classList.add("is-medium");
      moveDown.disabled = true;
      moveDown.onclick = function ()
      {
        Phase.MoveDown(nm);
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
      removeButton.id = "phaseRemove" + nm;
      removeButton.classList.add("is-warning");
      removeButton.classList.add("button");
      removeButton.classList.add("is-medium");
      //removeButton.disabled = ProjectTracking.number_of_phases === 1;
      removeButton.appendChild(document.createTextNode("Remove"));
      removeButton.onclick = function ()
      {
        Phase.Remove(nm);
      }
      controlRemove.appendChild(removeButton);


      buttonField.appendChild(controlUp);
      buttonField.appendChild(controlDown);
      buttonField.appendChild(controlRemove);
      buttonCell.appendChild(buttonField);

      tr.appendChild(buttonCell);
      //tr.appendChild(completedCell);
      df.appendChild(tr);
      container.appendChild(df);

      Phase.UpdatePhaseButtons();
    }

    public static MoveUp(rowId: string): void
    {
      let row = parseInt(rowId);
      if (row > 1)
      {
        let currentId = "projectPhase" + rowId;
        let upId = "projectPhase" + (row - 1).toString()
        let current = Utilities.Get_Value(currentId);
        let up = Utilities.Get_Value(upId);
        Utilities.Set_Value(currentId, up);
        Utilities.Set_Value(upId, current);
      }
    }

    public static MoveDown(rowId: string): void
    {
      let row = parseInt(rowId);
      if (row < ProjectTracking.number_of_phases)
      {
        let currentId = "projectPhase" + rowId;
        let downId = "projectPhase" + (row + 1).toString()
        let current = Utilities.Get_Value(currentId);
        let down = Utilities.Get_Value(downId);
        Utilities.Set_Value(currentId, down);
        Utilities.Set_Value(downId, current);
      }
    }

    public static Remove(rowId: string): void
    {
      // what we'll do here is move all of the phase above this one up one and then remove
      // the last one.
      let row = parseInt(rowId);
      if (row < ProjectTracking.number_of_phases)
      {
        for (var m = row; m <= ProjectTracking.number_of_phases; m++)
        {
          Phase.MoveDown(m.toString());
        }
      }

      let e = document.getElementById("phase" + ProjectTracking.number_of_phases.toString());
      e.parentNode.removeChild(e);
      ProjectTracking.number_of_phases--;
      Phase.UpdatePhaseButtons();
    }

    public static UpdatePhaseButtons(): void
    {
      for (var i = 1; i <= ProjectTracking.number_of_phases; i++)
      {
        let moveDown = <HTMLButtonElement>document.getElementById("phaseDown" + i.toString());
        moveDown.disabled = (i === ProjectTracking.number_of_phases);
        let remove = <HTMLButtonElement>document.getElementById("phaseRemove" + i.toString());
        //remove.disabled = (ProjectTracking.number_of_phases === 1);
      }
    }

    private static GetContainer(): HTMLElement
    {
      return document.getElementById("projectPhases");
    }

    public static ClearPhases(): void
    {
      ProjectTracking.number_of_phases = 0;
      Utilities.Clear_Element(Phase.GetContainer());
      Utilities.Clear_Element(document.getElementById("phase_entry_errors"));
    }

    public static LoadPhases(phase: Array<Phase>)
    {
      Phase.ClearPhases();
      for (let p of phase)
      {
        Phase.AddPhase();
      }
      for (let p of phase)
      {
        Phase.UpdatePhase(p);
      }
      Phase.UpdatePhaseButtons();
    }

    public static UpdatePhase(phase: Phase)
    {
      Utilities.Set_Value("projectPhase" + phase.phase_order.toString(), phase.name);
      Utilities.Set_Date_Value("projectPhaseStart" + phase.phase_order.toString(), phase.started_on);
      Utilities.Set_Date_Value("projectPhaseEst" + phase.phase_order.toString(), phase.estimated_completion);
      Utilities.Set_Date_Value("projectPhaseCompletion" + phase.phase_order.toString(), phase.completed_on);

    }

    public static PhaseView(phases: Array<Phase>): DocumentFragment
    {
      phases.sort(function (a, b) { return a.phase_order - b.phase_order; });

      let df = document.createDocumentFragment();
      if (phases.length === 0) return df;
      let ol = document.createElement("ol");
      ol.classList.add("comments");
      for (let p of phases)
      {
        let li = document.createElement("li");
        li.appendChild(document.createTextNode(p.name));
        ol.appendChild(li);
      }
      return df;
    }

    public static ReadPhases(): Array<Phase>
    {
      let phases: Array<Phase> = [];
      // first let's remove any phases that are blank
      // in order to do this we have to work backwards
      //for (var i = 50; i > 0; i--)
      //{
      //  let e = <HTMLInputElement>document.getElementById("projectPhase" + i.toString());
      //  if (e !== null)
      //  {
      //    if (Utilities.Get_Value(e).trim().length === 0)
      //    {
      //      Phase.Remove(i.toString());
      //    }
      //  }
      //}

      for (var i = 1; i <= ProjectTracking.number_of_phases; i++)
      {
        let p = new Phase();
        p.phase_order = i;
        p.name = Utilities.Get_Value("projectPhase" + i.toString()).trim();
        p.started_on = Utilities.Get_Date_Value("projectPhaseStart" + i.toString(), true);
        p.estimated_completion = Utilities.Get_Date_Value("projectPhaseEst" + i.toString(), true);
        p.completed_on = Utilities.Get_Date_Value("projectPhaseCompletion" + i.toString(), true);
        phases.push(p);
      }
      console.log('phases read', phases);
      return phases;
    }

    public static ValidatePhases(phases: Array<Phase>): boolean
    {
      let error_text = [];
      // if they picked a name, they should also pick a start date
      // if they picked any dates but didn't pick a name, they should have to pick a name too.
      // estimated completion date should be after on or after start date
      // completion date can't be greater than today
      for (let phase of phases)
      {
        let current_phase = "Phase " + phase.phase_order.toString() + " ";
        let has_name = phase.name.length > 0;
        let has_start_date = phase.started_on !== null;
        let has_estimated_date = phase.estimated_completion !== null;
        let has_completion_date = phase.completed_on !== null;
        let has_any_date = phase.completed_on !== null || phase.started_on !== null || phase.estimated_completion !== null;
        if (!has_name && !has_any_date) error_text.push(current_phase + "has no information entered.  You must either remove it or add a phase name and a start date.");
        if (has_name && !has_start_date) error_text.push(current_phase + "is missing a start date.");
        if (has_start_date && has_estimated_date)
        {
          if (phase.started_on > phase.estimated_completion)
          {
            error_text.push(current_phase + "has an estimated completion date set prior to it's start date.");
          }
        }
        if (has_start_date && has_completion_date)
        {
          if (phase.started_on > phase.completed_on)
          {
            error_text.push(current_phase + "has an completion date set prior to it's start date.");
          }
        }
        if (has_completion_date && phase.completed_on > new Date())
        {
          error_text.push(current_phase + "has an completion date set in the future.");
        }
        for (let duplicate of phases)
        {
          if (phase.phase_order !== duplicate.phase_order && duplicate.phase_order > phase.phase_order)
          {
            if (has_name && duplicate.name.length > 0 && duplicate.name === phase.name)
            {
              error_text.push(current_phase + " and " + duplicate.phase_order.toString() + " are set to the same phase.");
            }
          }

        }
      }
      if (error_text.length > 0)
      {
        // set error
        Utilities.Error_Show("phase_entry_errors", error_text, false);
        let e = document.getElementById("phase_entry_errors");
        e.scrollTo();
      }
      else
      {
        Utilities.Clear_Element(document.getElementById("phase_entry_errors"));
      }
      // return true/false
      return error_text.length === 0;
    }

    public static GetCurrentPhases(project: Project, show_images: boolean, gant_rows: Array<any>): HTMLUListElement
    {

      let container = document.createElement("ul");
      if (project.completed)
      {
        let completed = document.createElement("li");
        if (show_images) completed.appendChild(Phase.GetImage("green"));
        completed.appendChild(document.createTextNode("Project Completed"));
        container.appendChild(completed);
        return container;
      }
      if (project.phases.length === 0)
      {
        
        let not_entered = document.createElement("li");
        if (show_images) not_entered.appendChild(Phase.GetImage("black"));
        not_entered.appendChild(document.createTextNode("Phases not entered"));
        container.appendChild(not_entered);
        return container;
      }
      let incomplete = project.phases.filter(ic => ic.completed_on === null);
      if (incomplete.length === 0)
      {
        
        let project_incomplete = document.createElement("li");
        if (show_images) project_incomplete.appendChild(Phase.GetImage("green"));
        project_incomplete.appendChild(document.createTextNode("Phases completed; Project is not marked as completed"));
        container.appendChild(project_incomplete);
        return container;
      }
      let first_incomplete_phase: Phase = null;
      let d = new Date();
      let today = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      let phases_added = 0;
      for (let phase of project.phases)
      {
        let has_start = phase.started_on !== null;
        let has_est = phase.estimated_completion !== null;
        let has_completion = phase.completed_on !== null;
        if (!has_completion)
        {
          if (first_incomplete_phase === null) first_incomplete_phase = phase;
          if (has_start)
          {
            let start = new Date(phase.started_on.toString());
            if (start <= today)
            {
              let phase_name = phase.name.replace("Select Phase Name", "Phase Name not entered");
              let phase_text = phase_name + ": ";
              if (start.getFullYear() < 1970)
              {
                phase_text += "No dates entered";
              }
              else
              {
                phase_text += Utilities.Format_Date(phase.started_on);
                if (has_est)
                {
                  phase_text += " - " + Utilities.Format_Date(phase.estimated_completion);
                }
              }

              let li = document.createElement("li");
              if (show_images) li.appendChild(Phase.GetImage(Phase.GetImageColor(phase.started_on, phase.estimated_completion)));
              li.appendChild(document.createTextNode(phase_text));
              container.appendChild(li);
              phases_added++;
            }
          }
        }
      }
      if (phases_added === 0)
      {
        let phase_text = "";
        if (first_incomplete_phase !== null)
        {
          let phase_name = first_incomplete_phase.name.replace("Select Phase Name", "Phase Name not entered");
          phase_text = phase_name + ": "
          //let start = new Date(first_incomplete_phase.started_on.toString());
          if (first_incomplete_phase.started_on === null)
          {
            phase_text += "No dates entered";
          }
          else
          {
            phase_text += Utilities.Format_Date(first_incomplete_phase.started_on);
            if (first_incomplete_phase.estimated_completion !== null)
            {
              phase_text += " - " + Utilities.Format_Date(first_incomplete_phase.estimated_completion);
            }
          }
        }
        else
        {
          phase_text = "No phase is in progress Today";
        }

        let li = document.createElement("li");
        if (show_images) li.appendChild(Phase.GetImage(Phase.GetImageColor(first_incomplete_phase.started_on, first_incomplete_phase.estimated_completion)));
        li.appendChild(document.createTextNode(phase_text));
        container.appendChild(li);
      }
      if (show_images)
      {
        container.onclick = () =>
        {
          console.log('')
          Project.DrawGanttChart(project.id, gant_rows);
        }
        container.style.cursor = "pointer";
      }
      return container;
    }

    private static GetImage(color: string): HTMLImageElement
    {
      let img = document.createElement("img");
      img.src = "content/images/circle-" + color + "128.png";
      return img;
    }

    private static GetImageColor(started_on: any, estimated_completion: any): string
    {
      let d = new Date();
      let today = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      let start = new Date(started_on);
      if (start > today) return "green";
      if (estimated_completion === null) return "black";
      var diff = Math.round((today.getTime() - new Date(<any>estimated_completion).getTime()) / 86400000);
      if (diff > 30)
      {
        return "red";
      }
      else
      {
        if (diff > 0)
        {
          return "yellow";
        }
        else
        {
          return "green";
        }
      }
    }
  }

}