var ProjectTracking;
(function (ProjectTracking) {
    "use strict";
    var Milestone = /** @class */ (function () {
        function Milestone() {
            this.id = -1;
            this.project_id = -1;
            this.name = "";
            this.display_order = -1;
        }
        Milestone.AddMilestone = function () {
            ProjectTracking.number_of_milestones++;
            var nm = ProjectTracking.number_of_milestones.toString();
            var container = Milestone.GetContainer();
            var df = document.createDocumentFragment();
            var tr = document.createElement("tr");
            tr.id = "milestone" + nm;
            var count = document.createElement("td");
            count.style.textAlign = "center";
            count.style.verticalAlign = "middle";
            count.appendChild(document.createTextNode(nm));
            tr.appendChild(count);
            var inputCell = document.createElement("td");
            var field = document.createElement("div");
            field.classList.add("field");
            var control = document.createElement("div");
            control.classList.add("control");
            control.classList.add("is-medium");
            var input = document.createElement("input");
            input.classList.add("input");
            input.classList.add("is-medium");
            input.type = "text";
            input.id = "projectMilestone" + nm;
            control.appendChild(input);
            field.appendChild(control);
            inputCell.appendChild(field);
            tr.appendChild(inputCell);
            var buttonCell = document.createElement("td");
            var buttonField = document.createElement("div");
            buttonField.classList.add("field");
            buttonField.classList.add("is-grouped");
            var controlUp = document.createElement("div");
            controlUp.classList.add("control");
            var moveUp = document.createElement("button");
            moveUp.id = "milestoneUp" + nm;
            moveUp.type = "button";
            moveUp.style.borderRadius = "99px";
            moveUp.setAttribute("aria-label", "Move Milestone Up");
            moveUp.classList.add("button");
            moveUp.classList.add("is-medium");
            moveUp.disabled = ProjectTracking.number_of_milestones === 1;
            moveUp.onclick = function () {
                Milestone.MoveUp(nm);
            };
            var moveUpIconspan = document.createElement("span");
            moveUpIconspan.classList.add("icon");
            moveUpIconspan.classList.add("is-large");
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
            moveDown.id = "milestoneDown" + nm;
            moveDown.type = "button";
            moveDown.style.borderRadius = "99px";
            moveDown.setAttribute("aria-label", "Move Milestone Down");
            moveDown.classList.add("button");
            moveDown.classList.add("is-medium");
            moveDown.disabled = true;
            moveDown.onclick = function () {
                Milestone.MoveDown(nm);
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
            removeButton.id = "milestoneRemove" + nm;
            removeButton.classList.add("is-warning");
            removeButton.classList.add("button");
            removeButton.classList.add("is-medium");
            removeButton.disabled = ProjectTracking.number_of_milestones === 1;
            removeButton.appendChild(document.createTextNode("Remove"));
            removeButton.onclick = function () {
                Milestone.Remove(nm);
            };
            controlRemove.appendChild(removeButton);
            buttonField.appendChild(controlUp);
            buttonField.appendChild(controlDown);
            buttonField.appendChild(controlRemove);
            buttonCell.appendChild(buttonField);
            tr.appendChild(buttonCell);
            df.appendChild(tr);
            container.appendChild(df);
            Milestone.UpdateMilestoneButtons();
        };
        Milestone.MoveUp = function (rowId) {
            var row = parseInt(rowId);
            if (row > 1) {
                var currentId = "projectMilestone" + rowId;
                var upId = "projectMilestone" + (row - 1).toString();
                var current = Utilities.Get_Value(currentId);
                var up = Utilities.Get_Value(upId);
                Utilities.Set_Value(currentId, up);
                Utilities.Set_Value(upId, current);
            }
        };
        Milestone.MoveDown = function (rowId) {
            var row = parseInt(rowId);
            if (row < ProjectTracking.number_of_milestones) {
                var currentId = "projectMilestone" + rowId;
                var downId = "projectMilestone" + (row + 1).toString();
                var current = Utilities.Get_Value(currentId);
                var down = Utilities.Get_Value(downId);
                Utilities.Set_Value(currentId, down);
                Utilities.Set_Value(downId, current);
            }
        };
        Milestone.Remove = function (rowId) {
            // what we'll do here is move all of the milestones above this one up one and then remove
            // the last one.
            var row = parseInt(rowId);
            if (row < ProjectTracking.number_of_milestones) {
                for (var m = row; m <= ProjectTracking.number_of_milestones; m++) {
                    Milestone.MoveDown(m.toString());
                }
            }
            var e = document.getElementById("milestone" + ProjectTracking.number_of_milestones.toString());
            e.parentNode.removeChild(e);
            ProjectTracking.number_of_milestones--;
            Milestone.UpdateMilestoneButtons();
        };
        Milestone.UpdateMilestoneButtons = function () {
            for (var i = 1; i <= ProjectTracking.number_of_milestones; i++) {
                var moveDown = document.getElementById("milestoneDown" + i.toString());
                moveDown.disabled = (i === ProjectTracking.number_of_milestones);
                var remove = document.getElementById("milestoneRemove" + i.toString());
                remove.disabled = (ProjectTracking.number_of_milestones === 1);
            }
        };
        Milestone.GetContainer = function () {
            return document.getElementById("projectMilestones");
        };
        Milestone.ClearMilestones = function () {
            ProjectTracking.number_of_milestones = 0;
            Utilities.Clear_Element(Milestone.GetContainer());
        };
        Milestone.LoadMilestones = function (milestones) {
            Milestone.ClearMilestones();
            for (var _i = 0, milestones_1 = milestones; _i < milestones_1.length; _i++) {
                var m = milestones_1[_i];
                Milestone.AddMilestone();
            }
            for (var _a = 0, milestones_2 = milestones; _a < milestones_2.length; _a++) {
                var m = milestones_2[_a];
                Milestone.UpdateMilestone(m);
            }
            Milestone.UpdateMilestoneButtons();
        };
        Milestone.UpdateMilestone = function (milestone) {
            Utilities.Set_Value("projectMilestone" + milestone.display_order.toString(), milestone.name);
        };
        Milestone.MilestonesView = function (milestones) {
            milestones.sort(function (a, b) { return a.display_order - b.display_order; });
            var df = document.createDocumentFragment();
            if (milestones.length === 0)
                return df;
            var ol = document.createElement("ol");
            ol.classList.add("comments");
            for (var _i = 0, milestones_3 = milestones; _i < milestones_3.length; _i++) {
                var m = milestones_3[_i];
                var li = document.createElement("li");
                li.appendChild(document.createTextNode(m.name));
                ol.appendChild(li);
            }
            df.appendChild(ol);
            return df;
        };
        return Milestone;
    }());
    ProjectTracking.Milestone = Milestone;
})(ProjectTracking || (ProjectTracking = {}));
//# sourceMappingURL=Milestone.js.map