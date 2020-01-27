var ProjectTracking;
(function (ProjectTracking) {
    var Phase = /** @class */ (function () {
        function Phase() {
            this.project_id = -1;
            this.phase_order = -1;
            this.name = "";
        }
        Phase.AddPhase = function () {
            var phase_names = [
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
            ];
            ProjectTracking.number_of_phases++;
            var nm = ProjectTracking.number_of_phases.toString();
            var container = Phase.GetContainer();
            var df = document.createDocumentFragment();
            var tr = document.createElement("tr");
            tr.id = "phase" + nm;
            var count = document.createElement("td");
            count.style.textAlign = "center";
            count.style.verticalAlign = "middle";
            count.appendChild(document.createTextNode(nm));
            tr.appendChild(count);
            var inputCell = document.createElement("td");
            var field_input = document.createElement("div");
            field_input.classList.add("field");
            var control_input = document.createElement("div");
            control_input.classList.add("control");
            control_input.classList.add("is-medium");
            var control_select = document.createElement("div");
            control_select.classList.add("select");
            control_input.appendChild(control_select);
            var phase_select = document.createElement("select");
            phase_select.classList.add("is-medium");
            phase_select.id = "projectPhase" + nm;
            phase_select.add(Utilities.Create_Option("", "Select Phase Name", true));
            for (var _i = 0, phase_names_1 = phase_names; _i < phase_names_1.length; _i++) {
                var name_1 = phase_names_1[_i];
                phase_select.add(Utilities.Create_Option(name_1, name_1, false));
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
            var start_cell = document.createElement("td");
            var start_field_input = document.createElement("div");
            start_field_input.classList.add("field");
            var start_control_input = document.createElement("div");
            start_control_input.classList.add("control");
            start_control_input.classList.add("is-medium");
            var start_input = document.createElement("input");
            start_input.classList.add("input");
            start_input.classList.add("is-medium");
            start_input.type = "date";
            start_input.id = "projectPhaseStart" + nm;
            start_control_input.appendChild(start_input);
            start_field_input.appendChild(start_control_input);
            start_cell.appendChild(start_field_input);
            tr.appendChild(start_cell);
            var est_cell = document.createElement("td");
            var est_field_input = document.createElement("div");
            est_field_input.classList.add("field");
            var est_control_input = document.createElement("div");
            est_control_input.classList.add("control");
            est_control_input.classList.add("is-medium");
            var est_input = document.createElement("input");
            est_input.classList.add("input");
            est_input.classList.add("is-medium");
            est_input.type = "Date";
            est_input.id = "projectPhaseEst" + nm;
            est_control_input.appendChild(est_input);
            est_field_input.appendChild(est_control_input);
            est_cell.appendChild(est_field_input);
            tr.appendChild(est_cell);
            var completion_cell = document.createElement("td");
            var completion_field_input = document.createElement("div");
            completion_field_input.classList.add("field");
            var completion_control_input = document.createElement("div");
            completion_control_input.classList.add("control");
            completion_control_input.classList.add("is-medium");
            var completion_input = document.createElement("input");
            completion_input.classList.add("input");
            completion_input.classList.add("is-medium");
            completion_input.type = "Date";
            completion_input.id = "projectPhaseCompletion" + nm;
            completion_control_input.appendChild(completion_input);
            completion_field_input.appendChild(completion_control_input);
            completion_cell.appendChild(completion_field_input);
            tr.appendChild(completion_cell);
            var buttonCell = document.createElement("td");
            var buttonField = document.createElement("div");
            buttonField.classList.add("field");
            buttonField.classList.add("is-grouped");
            var controlUp = document.createElement("div");
            controlUp.classList.add("control");
            var moveUp = document.createElement("button");
            moveUp.id = "phaseUp" + nm;
            moveUp.type = "button";
            moveUp.style.borderRadius = "99px";
            moveUp.setAttribute("aria-label", "Move Phase Up");
            moveUp.setAttribute("title", "Move Phase Up");
            moveUp.classList.add("button");
            moveUp.classList.add("is-medium");
            moveUp.disabled = ProjectTracking.number_of_phases === 1;
            moveUp.onclick = function () {
                Phase.MoveUp(nm);
            };
            var moveUpIconspan = document.createElement("span");
            moveUpIconspan.classList.add("icon");
            moveUpIconspan.classList.add("is-medium");
            var moveUpIcon = document.createElement("i");
            moveUpIcon.classList.add("fas");
            moveUpIcon.classList.add("fa-arrow-circle-up");
            moveUpIcon.classList.add("fa-2x");
            moveUpIconspan.appendChild(moveUpIcon);
            moveUp.appendChild(moveUpIconspan);
            controlUp.appendChild(moveUp);
            var controlDown = document.createElement("div");
            controlDown.classList.add("control");
            var moveDown = document.createElement("button");
            moveDown.id = "phaseDown" + nm;
            moveDown.type = "button";
            moveDown.style.borderRadius = "99px";
            moveDown.setAttribute("aria-label", "Move Phase Down");
            moveDown.classList.add("button");
            moveDown.classList.add("is-medium");
            moveDown.disabled = true;
            moveDown.onclick = function () {
                Phase.MoveDown(nm);
            };
            var moveDownIconspan = document.createElement("span");
            moveDownIconspan.classList.add("icon");
            moveDownIconspan.classList.add("is-large");
            var moveDownIcon = document.createElement("i");
            moveDownIcon.classList.add("fas");
            moveDownIcon.classList.add("fa-arrow-circle-down");
            moveDownIcon.classList.add("fa-2x");
            moveDownIconspan.appendChild(moveDownIcon);
            moveDown.appendChild(moveDownIconspan);
            controlUp.appendChild(moveDown);
            var controlRemove = document.createElement("div");
            controlRemove.classList.add("control");
            var removeButton = document.createElement("button");
            removeButton.id = "phaseRemove" + nm;
            removeButton.classList.add("is-warning");
            removeButton.classList.add("button");
            removeButton.classList.add("is-medium");
            //removeButton.disabled = ProjectTracking.number_of_phases === 1;
            removeButton.appendChild(document.createTextNode("Remove"));
            removeButton.onclick = function () {
                Phase.Remove(nm);
            };
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
        };
        Phase.MoveUp = function (rowId) {
            var row = parseInt(rowId);
            if (row > 1) {
                var currentId = "projectPhase" + rowId;
                var upId = "projectPhase" + (row - 1).toString();
                var current = Utilities.Get_Value(currentId);
                var up = Utilities.Get_Value(upId);
                Utilities.Set_Value(currentId, up);
                Utilities.Set_Value(upId, current);
            }
        };
        Phase.MoveDown = function (rowId) {
            var row = parseInt(rowId);
            if (row < ProjectTracking.number_of_phases) {
                var currentId = "projectPhase" + rowId;
                var downId = "projectPhase" + (row + 1).toString();
                var current = Utilities.Get_Value(currentId);
                var down = Utilities.Get_Value(downId);
                Utilities.Set_Value(currentId, down);
                Utilities.Set_Value(downId, current);
            }
        };
        Phase.Remove = function (rowId) {
            // what we'll do here is move all of the phase above this one up one and then remove
            // the last one.
            var row = parseInt(rowId);
            if (row < ProjectTracking.number_of_phases) {
                for (var m = row; m <= ProjectTracking.number_of_phases; m++) {
                    Phase.MoveDown(m.toString());
                }
            }
            var e = document.getElementById("phase" + ProjectTracking.number_of_phases.toString());
            e.parentNode.removeChild(e);
            ProjectTracking.number_of_phases--;
            Phase.UpdatePhaseButtons();
        };
        Phase.UpdatePhaseButtons = function () {
            for (var i = 1; i <= ProjectTracking.number_of_phases; i++) {
                var moveDown = document.getElementById("phaseDown" + i.toString());
                moveDown.disabled = (i === ProjectTracking.number_of_phases);
                var remove = document.getElementById("phaseRemove" + i.toString());
                //remove.disabled = (ProjectTracking.number_of_phases === 1);
            }
        };
        Phase.GetContainer = function () {
            return document.getElementById("projectPhases");
        };
        Phase.ClearPhases = function () {
            ProjectTracking.number_of_phases = 0;
            Utilities.Clear_Element(Phase.GetContainer());
            Utilities.Clear_Element(document.getElementById("phase_entry_errors"));
        };
        Phase.LoadPhases = function (phase) {
            Phase.ClearPhases();
            for (var _i = 0, phase_1 = phase; _i < phase_1.length; _i++) {
                var p = phase_1[_i];
                Phase.AddPhase();
            }
            for (var _a = 0, phase_2 = phase; _a < phase_2.length; _a++) {
                var p = phase_2[_a];
                Phase.UpdatePhase(p);
            }
            Phase.UpdatePhaseButtons();
        };
        Phase.UpdatePhase = function (phase) {
            Utilities.Set_Value("projectPhase" + phase.phase_order.toString(), phase.name);
            Utilities.Set_Date_Value("projectPhaseStart" + phase.phase_order.toString(), phase.started_on);
            Utilities.Set_Date_Value("projectPhaseEst" + phase.phase_order.toString(), phase.estimated_completion);
            Utilities.Set_Date_Value("projectPhaseCompletion" + phase.phase_order.toString(), phase.completed_on);
        };
        Phase.PhaseView = function (phases) {
            phases.sort(function (a, b) { return a.phase_order - b.phase_order; });
            var df = document.createDocumentFragment();
            if (phases.length === 0)
                return df;
            var ol = document.createElement("ol");
            ol.classList.add("comments");
            for (var _i = 0, phases_1 = phases; _i < phases_1.length; _i++) {
                var p = phases_1[_i];
                var li = document.createElement("li");
                li.appendChild(document.createTextNode(p.name));
                ol.appendChild(li);
            }
            return df;
        };
        Phase.ReadPhases = function () {
            var phases = [];
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
            for (var i = 1; i <= ProjectTracking.number_of_phases; i++) {
                var p = new Phase();
                p.phase_order = i;
                p.name = Utilities.Get_Value("projectPhase" + i.toString()).trim();
                p.started_on = Utilities.Get_Date_Value("projectPhaseStart" + i.toString(), true);
                p.estimated_completion = Utilities.Get_Date_Value("projectPhaseEst" + i.toString(), true);
                p.completed_on = Utilities.Get_Date_Value("projectPhaseCompletion" + i.toString(), true);
                phases.push(p);
            }
            console.log('phases read', phases);
            return phases;
        };
        Phase.ValidatePhases = function (phases) {
            var error_text = [];
            // if they picked a name, they should also pick a start date
            // if they picked any dates but didn't pick a name, they should have to pick a name too.
            // estimated completion date should be after on or after start date
            // completion date can't be greater than today
            for (var _i = 0, phases_2 = phases; _i < phases_2.length; _i++) {
                var phase = phases_2[_i];
                var current_phase = "Phase " + phase.phase_order.toString() + " ";
                var has_name = phase.name.length > 0;
                var has_start_date = phase.started_on !== null;
                var has_estimated_date = phase.estimated_completion !== null;
                var has_completion_date = phase.completed_on !== null;
                var has_any_date = phase.completed_on !== null || phase.started_on !== null || phase.estimated_completion !== null;
                if (!has_name && !has_any_date)
                    error_text.push(current_phase + "has no information entered.  You must either remove it or add a phase name and a start date.");
                if (has_name && !has_start_date)
                    error_text.push(current_phase + "is missing a start date.");
                if (has_start_date && has_estimated_date) {
                    if (phase.started_on > phase.estimated_completion) {
                        error_text.push(current_phase + "has an estimated completion date set prior to it's start date.");
                    }
                }
                if (has_start_date && has_completion_date) {
                    if (phase.started_on > phase.completed_on) {
                        error_text.push(current_phase + "has an completion date set prior to it's start date.");
                    }
                }
                if (has_completion_date && phase.completed_on > new Date()) {
                    error_text.push(current_phase + "has an completion date set in the future.");
                }
                for (var _a = 0, phases_3 = phases; _a < phases_3.length; _a++) {
                    var duplicate = phases_3[_a];
                    if (phase.phase_order !== duplicate.phase_order && duplicate.phase_order > phase.phase_order) {
                        if (has_name && duplicate.name.length > 0 && duplicate.name === phase.name) {
                            error_text.push(current_phase + " and " + duplicate.phase_order.toString() + " are set to the same phase.");
                        }
                    }
                }
            }
            if (error_text.length > 0) {
                // set error
                Utilities.Error_Show("phase_entry_errors", error_text, false);
                var e = document.getElementById("phase_entry_errors");
                e.scrollTo();
            }
            else {
                Utilities.Clear_Element(document.getElementById("phase_entry_errors"));
            }
            // return true/false
            return error_text.length === 0;
        };
        Phase.GetCurrentPhases = function (project, show_images, gant_rows) {
            var container = document.createElement("ul");
            if (project.completed) {
                var completed = document.createElement("li");
                if (show_images)
                    completed.appendChild(Phase.GetImage("green"));
                completed.appendChild(document.createTextNode("Project Completed"));
                container.appendChild(completed);
                return container;
            }
            if (project.phases.length === 0) {
                var not_entered = document.createElement("li");
                if (show_images)
                    not_entered.appendChild(Phase.GetImage("black"));
                not_entered.appendChild(document.createTextNode("Phases not entered"));
                container.appendChild(not_entered);
                return container;
            }
            var incomplete = project.phases.filter(function (ic) { return ic.completed_on === null; });
            if (incomplete.length === 0) {
                var project_incomplete = document.createElement("li");
                if (show_images)
                    project_incomplete.appendChild(Phase.GetImage("green"));
                project_incomplete.appendChild(document.createTextNode("Phases completed; Project is not marked as completed"));
                container.appendChild(project_incomplete);
                return container;
            }
            var first_incomplete_phase = null;
            var d = new Date();
            var today = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            var phases_added = 0;
            for (var _i = 0, _a = project.phases; _i < _a.length; _i++) {
                var phase = _a[_i];
                var has_start = phase.started_on !== null;
                var has_est = phase.estimated_completion !== null;
                var has_completion = phase.completed_on !== null;
                if (!has_completion) {
                    if (first_incomplete_phase === null)
                        first_incomplete_phase = phase;
                    if (has_start) {
                        var start = new Date(phase.started_on.toString());
                        if (start <= today) {
                            var phase_name = phase.name.replace("Select Phase Name", "Phase Name not entered");
                            var phase_text = phase_name + ": ";
                            if (start.getFullYear() < 1970) {
                                phase_text += "No dates entered";
                            }
                            else {
                                phase_text += Utilities.Format_Date(phase.started_on);
                                if (has_est) {
                                    phase_text += " - " + Utilities.Format_Date(phase.estimated_completion);
                                }
                            }
                            var li = document.createElement("li");
                            if (show_images)
                                li.appendChild(Phase.GetImage(Phase.GetImageColor(phase.started_on, phase.estimated_completion)));
                            li.appendChild(document.createTextNode(phase_text));
                            container.appendChild(li);
                            phases_added++;
                        }
                    }
                }
            }
            if (phases_added === 0) {
                var phase_text = "";
                if (first_incomplete_phase !== null) {
                    var phase_name = first_incomplete_phase.name.replace("Select Phase Name", "Phase Name not entered");
                    phase_text = phase_name + ": ";
                    //let start = new Date(first_incomplete_phase.started_on.toString());
                    if (first_incomplete_phase.started_on === null) {
                        phase_text += "No dates entered";
                    }
                    else {
                        phase_text += Utilities.Format_Date(first_incomplete_phase.started_on);
                        if (first_incomplete_phase.estimated_completion !== null) {
                            phase_text += " - " + Utilities.Format_Date(first_incomplete_phase.estimated_completion);
                        }
                    }
                }
                else {
                    phase_text = "No phase is in progress Today";
                }
                var li = document.createElement("li");
                if (show_images)
                    li.appendChild(Phase.GetImage(Phase.GetImageColor(first_incomplete_phase.started_on, first_incomplete_phase.estimated_completion)));
                li.appendChild(document.createTextNode(phase_text));
                container.appendChild(li);
            }
            if (show_images) {
                container.onclick = function () {
                    console.log('');
                    ProjectTracking.Project.DrawGanttChart(project.id, gant_rows);
                };
                container.style.cursor = "pointer";
            }
            return container;
        };
        Phase.GetImage = function (color) {
            var img = document.createElement("img");
            img.src = "content/images/circle-" + color + "128.png";
            return img;
        };
        Phase.GetImageColor = function (started_on, estimated_completion) {
            var d = new Date();
            var today = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            var start = new Date(started_on);
            if (start > today)
                return "green";
            if (estimated_completion === null)
                return "black";
            var diff = Math.round((today.getTime() - new Date(estimated_completion).getTime()) / 86400000);
            if (diff > 30) {
                return "red";
            }
            else {
                if (diff > 0) {
                    return "yellow";
                }
                else {
                    return "green";
                }
            }
        };
        return Phase;
    }());
    ProjectTracking.Phase = Phase;
})(ProjectTracking || (ProjectTracking = {}));
//# sourceMappingURL=phase.js.map