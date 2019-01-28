var ProjectTracking;
(function (ProjectTracking) {
    var DataValue = /** @class */ (function () {
        function DataValue(Label, Value, selected) {
            if (selected === void 0) { selected = false; }
            this.Label = Label;
            this.Value = Value;
            this.selected = selected;
        }
        DataValue.GetDepartments = function () {
            ProjectTracking.departments = [];
            var path = ProjectTracking.GetPath();
            Utilities.Get(path + "API/Project/Departments/All")
                .then(function (departments) {
                console.log("all departments", departments);
                ProjectTracking.departments.push(new DataValue("All Departments", ""));
                ProjectTracking.departments.push(new DataValue("My Departments Only", "mine", true));
                for (var _i = 0, departments_1 = departments; _i < departments_1.length; _i++) {
                    var d = departments_1[_i];
                    ProjectTracking.departments.push(d);
                }
                DataValue.BuildDataValueSelect("departmentFilter", ProjectTracking.departments);
                //Toggle_Loading_Search_Buttons(false);
            }, function (e) {
                console.log('error getting permits', e);
                //Toggle_Loading_Search_Buttons(false);
            });
        };
        DataValue.GetMyDepartments = function () {
            ProjectTracking.my_departments = [];
            var path = ProjectTracking.GetPath();
            Utilities.Get(path + "API/Project/Departments/My")
                .then(function (departments) {
                console.log("my departments", departments);
                ProjectTracking.my_departments = departments;
                DataValue.BuildDataValueSelect("projectDepartment", departments);
                //Toggle_Loading_Search_Buttons(false);
            }, function (e) {
                console.log('error getting permits', e);
                //Toggle_Loading_Search_Buttons(false);
            });
        };
        DataValue.BuildDataValueSelect = function (elementId, departments) {
            var select = document.getElementById(elementId);
            Utilities.Clear_Element(select);
            for (var _i = 0, departments_2 = departments; _i < departments_2.length; _i++) {
                var d = departments_2[_i];
                var o = document.createElement("option");
                o.value = d.Value;
                o.selected = d.selected;
                o.appendChild(document.createTextNode(d.Label));
                select.add(o, null);
            }
        };
        DataValue.GetFunding = function () {
            ProjectTracking.funding_sources = [];
            var path = ProjectTracking.GetPath();
            Utilities.Get(path + "API/Project/Funding")
                .then(function (funding) {
                console.log("all funding", funding);
                ProjectTracking.funding_sources.push(new DataValue("Select Funding", "-1", true));
                for (var _i = 0, funding_1 = funding; _i < funding_1.length; _i++) {
                    var d = funding_1[_i];
                    ProjectTracking.funding_sources.push(d);
                }
                DataValue.BuildDataValueSelect("projectFunding", ProjectTracking.funding_sources);
                //Toggle_Loading_Search_Buttons(false);
            }, function (e) {
                console.log('error getting funding', e);
                //Toggle_Loading_Search_Buttons(false);
            });
        };
        return DataValue;
    }());
    ProjectTracking.DataValue = DataValue;
})(ProjectTracking || (ProjectTracking = {}));
//# sourceMappingURL=DataValue.js.map
/// <reference path="menuitem.ts" />
var Utilities;
(function (Utilities) {
    function Hide(e) {
        if (typeof e == "string") {
            e = document.getElementById(e);
        }
        e.classList.add("hide");
        e.classList.remove("show");
        e.classList.remove("show-inline");
        e.classList.remove("show-flex");
    }
    Utilities.Hide = Hide;
    function Show(e) {
        if (typeof e == "string") {
            e = document.getElementById(e);
        }
        e.classList.add("show");
        e.classList.remove("hide");
        e.classList.remove("show-inline");
        e.classList.remove("show-flex");
    }
    Utilities.Show = Show;
    function Show_Inline(e) {
        if (typeof e == "string") {
            e = document.getElementById(e);
        }
        e.classList.add("show-inline");
        e.classList.remove("hide");
        e.classList.remove("show");
        e.classList.remove("show-flex");
    }
    Utilities.Show_Inline = Show_Inline;
    function Show_Flex(e) {
        if (typeof e == "string") {
            e = document.getElementById(e);
        }
        e.classList.add("show-flex");
        e.classList.remove("hide");
        e.classList.remove("show-inline");
        e.classList.remove("show");
    }
    Utilities.Show_Flex = Show_Flex;
    function Error_Show(e, errorText, timeout) {
        if (typeof e == "string") {
            e = document.getElementById(e);
        }
        if (errorText) {
            //Set_Text(e, errorText);
            Clear_Element(e);
            var notification = document.createElement("div");
            notification.classList.add("notification");
            notification.classList.add("is-danger");
            var deleteButton = document.createElement("button");
            deleteButton.classList.add("delete");
            deleteButton.onclick = function () {
                Hide(e);
            };
            notification.appendChild(deleteButton);
            if (Array.isArray(errorText)) {
                // we're assuming that errorText is an array if we get here.
                var ul_1 = document.createElement("ul");
                errorText.forEach(function (et) {
                    var li = document.createElement("li");
                    li.appendChild(document.createTextNode(et));
                    ul_1.appendChild(li);
                });
                notification.appendChild(ul_1);
            }
            else {
                notification.appendChild(document.createTextNode(errorText));
            }
            e.appendChild(notification);
        }
        Show(e);
        if (timeout == undefined || timeout === true) {
            window.setTimeout(function (j) {
                Hide(e);
            }, 10000);
        }
    }
    Utilities.Error_Show = Error_Show;
    function Clear_Element(node) {
        if (node === null || node === undefined)
            return;
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }
    Utilities.Clear_Element = Clear_Element;
    function Create_Option(value, label, selected) {
        if (selected === void 0) { selected = false; }
        var o = document.createElement("option");
        o.value = value;
        o.text = label;
        o.selected = selected;
        return o;
    }
    Utilities.Create_Option = Create_Option;
    function Get_Value(e) {
        if (typeof e == "string") {
            e = document.getElementById(e);
        }
        return e.value;
    }
    Utilities.Get_Value = Get_Value;
    function Set_Value(e, value) {
        if (typeof e == "string") {
            e = document.getElementById(e);
        }
        e.value = value;
    }
    Utilities.Set_Value = Set_Value;
    function Set_Text(e, value) {
        if (typeof e == "string") {
            e = document.getElementById(e);
        }
        Clear_Element(e);
        e.appendChild(document.createTextNode(value));
    }
    Utilities.Set_Text = Set_Text;
    function Show_Menu(elementId) {
        //let element = e.srcElement;
        // we expect the element's id to be in a "nav-XXX" name format, where 
        // XXX is the element we want to show 
        var id = elementId.replace("nav-", "");
        var menuItems = document.querySelectorAll("#menuTabs > li > a");
        if (menuItems.length > 0) {
            for (var i = 0; i < menuItems.length; i++) {
                var item = menuItems.item(i);
                if (item.id === elementId) {
                    item.parentElement.classList.add("is-active");
                }
                else {
                    item.parentElement.classList.remove("is-active");
                }
            }
        }
        Show_Hide_Selector("#views > section", id);
    }
    Utilities.Show_Menu = Show_Menu;
    function Handle_Tabs(tabSelector, containerSelector, id) {
        Activate_Inactivate_Selector(tabSelector, "nav-" + id);
        Show_Hide_Selector(containerSelector, id);
    }
    Utilities.Handle_Tabs = Handle_Tabs;
    function Activate_Inactivate_Selector(selector, id) {
        var sections = document.querySelectorAll(selector);
        if (sections.length > 0) {
            for (var i = 0; i < sections.length; i++) {
                var item = sections.item(i);
                if (item.id === id) {
                    item.classList.add("is-active");
                }
                else {
                    item.classList.remove("is-active");
                }
            }
        }
    }
    Utilities.Activate_Inactivate_Selector = Activate_Inactivate_Selector;
    function Show_Hide_Selector(selector, id) {
        var sections = document.querySelectorAll(selector);
        if (sections.length > 0) {
            for (var i = 0; i < sections.length; i++) {
                var item = sections.item(i);
                if (item.id === id) {
                    Show(item);
                }
                else {
                    Hide(item);
                }
            }
        }
    }
    Utilities.Show_Hide_Selector = Show_Hide_Selector;
    function Get(url) {
        return fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json" //,"Upgrade-Insecure-Requests": "1"
            },
            cache: "no-cache",
            credentials: "include"
        })
            .then(function (response) {
            console.log('get response', response);
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        });
    }
    Utilities.Get = Get;
    function Post(url, data) {
        return fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        }).then(function (response) {
            console.log('Post Response', response);
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        });
    }
    Utilities.Post = Post;
    function Post_Empty(url, data) {
        return fetch(url, {
            method: "POST",
            body: data !== null ? JSON.stringify(data) : "",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        }).then(function (response) {
            return response;
            //console.log('Post Response', response);
            //if (!response.ok)
            //{
            //  throw new Error(response.statusText)
            //}
            //return response;
        });
    }
    Utilities.Post_Empty = Post_Empty;
    function Format_Amount(amount) {
        return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }
    Utilities.Format_Amount = Format_Amount;
    function Format_Date(date) {
        if (date instanceof Date) {
            return date.toLocaleDateString('en-us');
        }
        return new Date(date).toLocaleDateString('en-US');
    }
    Utilities.Format_Date = Format_Date;
    function Validate_Text(e, errorElementId, errorText) {
        // this should only be used for required elements.
        if (typeof e == "string") {
            e = document.getElementById(e);
        }
        var ele = e;
        ele.tagName.toLowerCase() === "select" ? ele.parentElement.classList.remove("is-danger") : ele.classList.remove("is-danger");
        var v = Get_Value(ele).trim();
        if (v.length == 0) {
            ele.tagName.toLowerCase() === "select" ? ele.parentElement.classList.add("is-danger") : ele.classList.add("is-danger");
            Error_Show(errorElementId, errorText);
            ele.focus();
            ele.scrollTo();
            return "";
        }
        return v;
    }
    Utilities.Validate_Text = Validate_Text;
    function Toggle_Loading_Button(e, disabled) {
        if (typeof e == "string") {
            e = document.getElementById(e);
        }
        var b = e;
        b.disabled = disabled;
        b.classList.toggle("is-loading", disabled);
    }
    Utilities.Toggle_Loading_Button = Toggle_Loading_Button;
    function Create_Menu_Element(menuItem) {
        var li = document.createElement("li");
        if (menuItem.selected)
            li.classList.add("is-active");
        var a = document.createElement("a");
        a.id = menuItem.id;
        a.onclick = function () {
            Update_Menu(menuItem);
        };
        if (menuItem.icon.length > 0) {
            var span = document.createElement("span");
            span.classList.add("icon");
            span.classList.add("is-medium");
            var i = document.createElement("i");
            var icons = menuItem.icon.split(" ");
            for (var _i = 0, icons_1 = icons; _i < icons_1.length; _i++) {
                var icon = icons_1[_i];
                i.classList.add(icon);
            }
            span.appendChild(i);
            a.appendChild(span);
        }
        a.appendChild(document.createTextNode(menuItem.label));
        li.appendChild(a);
        return li;
    }
    Utilities.Create_Menu_Element = Create_Menu_Element;
    function Update_Menu(menuItem) {
        Set_Text("menuTitle", menuItem.title);
        Set_Text("menuSubTitle", menuItem.subTitle);
        Show_Menu(menuItem.id);
        document.getElementById(menuItem.autofocusId).focus();
    }
    Utilities.Update_Menu = Update_Menu;
    function Build_Menu_Elements(target, Menus) {
        var menu = document.getElementById(target);
        for (var _i = 0, Menus_1 = Menus; _i < Menus_1.length; _i++) {
            var menuItem = Menus_1[_i];
            menu.appendChild(Utilities.Create_Menu_Element(menuItem));
        }
    }
    Utilities.Build_Menu_Elements = Build_Menu_Elements;
    function CheckBrowser() {
        var browser = "";
        if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1) {
            browser = 'Opera';
        }
        else if (navigator.userAgent.indexOf("Chrome") != -1) {
            browser = 'Chrome';
        }
        else if (navigator.userAgent.indexOf("Safari") != -1) {
            browser = 'Safari';
        }
        else if (navigator.userAgent.indexOf("Firefox") != -1) {
            browser = 'Firefox';
        }
        else if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!document.DOCUMENT_NODE == true)) //IF IE > 10
         {
            browser = 'IE';
        }
        else {
            browser = 'unknown';
        }
        return browser;
    }
    Utilities.CheckBrowser = CheckBrowser;
})(Utilities || (Utilities = {}));
//# sourceMappingURL=utilities.js.map
var ProjectTracking;
(function (ProjectTracking) {
    "use strict";
    var Comment = /** @class */ (function () {
        function Comment() {
            this.id = -1;
            this.project_id = -1;
            this.comment = "";
            this.update_only = false;
            this.added_by = "";
            this.added_on = new Date(); // Date
            this.by_county_manager = false;
        }
        Comment.UpdateOnly = function () {
            var buttonId = "updateProjectAsUpToDate";
            Utilities.Toggle_Loading_Button(buttonId, true);
            console.log('current project', ProjectTracking.selected_project);
            if (ProjectTracking.selected_project.id === -1) {
                return;
            }
            var path = ProjectTracking.GetPath();
            Utilities.Post_Empty(path + "API/Project/AddUpdateComment?project_id=" + ProjectTracking.selected_project.id.toString(), null)
                .then(function (r) {
                console.log('post response', r);
                if (!r.ok) {
                    // do some error stuff
                    console.log('some errors happened with post response');
                    alert("There was an issue saving this update.  Please try again, and put in a help desk ticket if the issue persists.");
                }
                else {
                    // we good
                    //console.log('post response good');
                    ProjectTracking.Project.GetProjects();
                    ProjectTracking.CloseModals();
                }
                Utilities.Toggle_Loading_Button(buttonId, false);
            }, function (e) {
                console.log('error getting permits', e);
                //Toggle_Loading_Search_Buttons(false);
                Utilities.Toggle_Loading_Button(buttonId, false);
            });
        };
        Comment.CommentsView = function (comments, full) {
            //comments = comments.filter(function (j) { return j.comment.length > 0; });
            comments.sort(function (a, b) { return a.id - b.id; });
            var df = document.createDocumentFragment();
            if (comments.length === 0)
                return df;
            var ol = document.createElement("ol");
            ol.style.marginLeft = "1em";
            for (var _i = 0, comments_1 = comments; _i < comments_1.length; _i++) {
                var c = comments_1[_i];
                var li = document.createElement("li");
                var comment = full ? c.added_by + ' - ' + c.comment : c.comment;
                var span = document.createElement("span");
                span.appendChild(document.createTextNode(comment));
                if (c.by_county_manager) {
                    span.style.color = "red";
                    span.style.fontWeight = "bold";
                }
                li.appendChild(span);
                ol.appendChild(li);
            }
            df.appendChild(ol);
            return df;
        };
        Comment.PopulateCommentsFieldset = function (comments) {
            var container = document.getElementById("existingCommentsContainer");
            var legend = document.createElement("legend");
            legend.classList.add("label");
            legend.appendChild(document.createTextNode("Comments"));
            container.appendChild(legend);
            container.appendChild(Comment.CommentsView(comments, true));
        };
        return Comment;
    }());
    ProjectTracking.Comment = Comment;
})(ProjectTracking || (ProjectTracking = {}));
//# sourceMappingURL=Comment.js.map
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
        Milestone.ReadMilestones = function () {
            var milestones = [];
            // first let's remove any milestones that are blank
            // in order to do this we have to work backwards
            for (var i = 50; i > 0; i--) {
                var e = document.getElementById("projectMilestone" + i.toString());
                if (e !== null) {
                    if (Utilities.Get_Value(e).trim().length === 0) {
                        Milestone.Remove(i.toString());
                    }
                }
            }
            for (var i = 1; i <= ProjectTracking.number_of_milestones; i++) {
                var m = new Milestone();
                m.display_order = i;
                m.name = Utilities.Get_Value("projectMilestone" + i.toString()).trim();
                milestones.push(m);
            }
            return milestones;
        };
        return Milestone;
    }());
    ProjectTracking.Milestone = Milestone;
})(ProjectTracking || (ProjectTracking = {}));
//# sourceMappingURL=Milestone.js.map
var ProjectTracking;
(function (ProjectTracking) {
    "use strict";
    var Project = /** @class */ (function () {
        function Project() {
            this.id = -1;
            this.project_name = "";
            this.department_id = -1;
            this.funding_id = -1;
            this.timeline = "";
            this.commissioner_share = false;
            this.infrastructure_share = false;
            this.completed = false;
            this.date_last_updated = null;
            this.date_completed = null;
            this.can_edit = false;
            this.milestones = [];
            this.comments = [];
        }
        Project.GetProjects = function () {
            var buttonId = "filterRefreshButton";
            Utilities.Toggle_Loading_Button(buttonId, true);
            var path = ProjectTracking.GetPath();
            Utilities.Get(path + "API/Project/List")
                .then(function (projects) {
                console.log("projects", projects);
                ProjectTracking.projects = projects;
                Project.BuildProjectTrackingList(Project.ApplyFilters(projects));
                ProjectTracking.FinishedLoading();
                if (projects.length === 0) {
                    ProjectTracking.AddProjectResultsMessage("No projects were found. You can use the Add Project button to add a new project.");
                }
                Utilities.Toggle_Loading_Button(buttonId, false);
            }, function (e) {
                if (e.message.trim().toLowerCase() === "unauthorized") {
                    ProjectTracking.AddProjectResultsMessage("You do not currently have access to the Project Tracking application.");
                }
                else {
                    if (e) {
                        ProjectTracking.AddProjectResultsMessage("There was a problem retrieving a list of projects.  Please try again. If this issue persists, please put in a help desk ticket.");
                        console.log('error getting permits', e);
                    }
                }
                Utilities.Toggle_Loading_Button(buttonId, false);
            });
        };
        Project.ApplyFilters = function (projects) {
            var departmentFilter = Utilities.Get_Value("departmentFilter");
            var shareFilter = document.getElementById("projectCommissionerShareFilter").checked;
            var completedFilter = document.getElementById("projectCompleteFilter").checked;
            var infrastructureFilter = document.getElementById("projectInfrastructureFilter").checked;
            projects = projects.filter(function (j) {
                return (departmentFilter.length === 0 ||
                    j.department_id.toString() === departmentFilter ||
                    (departmentFilter === "mine" && j.can_edit));
            });
            projects = projects.filter(function (j) {
                return ((shareFilter && j.commissioner_share) || !shareFilter);
            });
            projects = projects.filter(function (j) {
                return ((shareFilter && j.commissioner_share) || !shareFilter);
            });
            projects = projects.filter(function (j) {
                return ((completedFilter && j.completed) || !completedFilter);
            });
            projects = projects.filter(function (j) {
                return ((infrastructureFilter && j.infrastructure_share) || !infrastructureFilter);
            });
            return projects;
        };
        Project.AddProject = function () {
            // this function is going to reset all of the New
            // project form's values and get it ready to have a new project created.
            Utilities.Hide("updateProjectAsUpToDate");
            ProjectTracking.selected_project = new Project(); // the object we'll be saving
            Project.UpdateProjectName("");
            Project.UpdateProjectDepartment("");
            Project.UpdateProjectFunding("-1");
            ProjectTracking.Milestone.ClearMilestones();
            Project.UpdateProjectTimeline("");
            Project.UpdateProjectCompleted(false);
            Project.UpdateCommissionerShare(false);
            Project.UpdateInfrastructureShare(false);
            var commentsContainer = document.getElementById("existingCommentsContainer");
            Utilities.Hide(commentsContainer);
            Utilities.Clear_Element(commentsContainer);
            Project.ClearComment();
            ProjectTracking.ShowAddProject();
        };
        Project.LoadProject = function (project) {
            Utilities.Show("updateProjectAsUpToDate");
            project.comments = project.comments.filter(function (j) { return j.comment.length > 0; });
            Project.UpdateProjectName(project.project_name);
            Project.UpdateProjectDepartment(project.department_id.toString());
            Project.UpdateProjectFunding(project.funding_id.toString());
            ProjectTracking.Milestone.LoadMilestones(project.milestones);
            Project.UpdateProjectTimeline(project.timeline);
            Project.UpdateProjectCompleted(project.completed);
            Project.UpdateCommissionerShare(project.commissioner_share);
            Project.UpdateInfrastructureShare(project.infrastructure_share);
            var commentsContainer = document.getElementById("existingCommentsContainer");
            Utilities.Clear_Element(commentsContainer);
            if (project.comments.length > 0) {
                Utilities.Show(commentsContainer);
                ProjectTracking.Comment.PopulateCommentsFieldset(project.comments);
            }
            else {
                Utilities.Hide(commentsContainer);
            }
            Project.ClearComment();
            ProjectTracking.ShowAddProject();
        };
        Project.UpdateProjectName = function (projectName) {
            Utilities.Set_Value("projectName", projectName);
        };
        Project.UpdateProjectDepartment = function (departmentId) {
            Utilities.Set_Value("projectDepartment", departmentId);
        };
        Project.UpdateProjectFunding = function (sourceId) {
            Utilities.Set_Value("projectFunding", sourceId);
        };
        Project.UpdateProjectTimeline = function (timeline) {
            Utilities.Set_Value("projectTimeline", timeline);
        };
        Project.UpdateProjectCompleted = function (complete) {
            var completed = document.getElementById("projectComplete");
            completed.checked = complete;
        };
        Project.UpdateInfrastructureShare = function (infrastructure) {
            var ifshare = document.getElementById("projectInfrastructureShare");
            ifshare.checked = infrastructure;
        };
        Project.UpdateCommissionerShare = function (share) {
            var shared = document.getElementById("projectCommissionerShare");
            shared.checked = share;
        };
        Project.ClearComment = function () {
            Utilities.Set_Value("projectComment", "");
        };
        Project.BuildProjectTrackingList = function (projects) {
            var container = document.getElementById("projectList");
            Utilities.Clear_Element(container);
            var df = document.createDocumentFragment();
            for (var _i = 0, projects_1 = projects; _i < projects_1.length; _i++) {
                var p = projects_1[_i];
                df.appendChild(Project.CreateProjectRow(p));
            }
            container.appendChild(df);
        };
        Project.CreateProjectRow = function (project) {
            project.comments = project.comments.filter(function (j) { return j.comment.length > 0; });
            var tr = document.createElement("tr");
            tr.classList.add("pagebreak");
            var projectName = document.createElement("td");
            var comments = document.createElement("td");
            var dfComments = ProjectTracking.Comment.CommentsView(project.comments, false);
            if (project.can_edit) {
                var a = document.createElement("a");
                a.appendChild(document.createTextNode(project.project_name));
                a.onclick = function () {
                    ProjectTracking.selected_project = project; // this is the project we'll be attempting to update.
                    Project.LoadProject(project);
                    console.log('selected_project', ProjectTracking.selected_project);
                };
                projectName.appendChild(a);
            }
            else {
                projectName.appendChild(document.createTextNode(project.project_name));
            }
            comments.appendChild(dfComments);
            tr.appendChild(projectName);
            var department = document.createElement("td");
            var departmentNames = ProjectTracking.departments.filter(function (d) { return d.Value === project.department_id.toString(); });
            var departmentName = departmentNames.length > 0 ? departmentNames[0].Label : "";
            department.appendChild(document.createTextNode(departmentName));
            tr.appendChild(department);
            var funding = document.createElement("td");
            var fundingNames = ProjectTracking.funding_sources.filter(function (d) { return d.Value === project.funding_id.toString(); });
            var fundingName = departmentNames.length > 0 && project.funding_id !== -1 ? fundingNames[0].Label : "";
            funding.appendChild(document.createTextNode(fundingName));
            tr.appendChild(funding);
            var milestones = document.createElement("td");
            milestones.appendChild(ProjectTracking.Milestone.MilestonesView(project.milestones));
            tr.appendChild(milestones);
            var timeline = document.createElement("td");
            timeline.appendChild(document.createTextNode(project.timeline));
            tr.appendChild(timeline);
            tr.appendChild(comments);
            var dateUpdated = document.createElement("td");
            dateUpdated.appendChild(document.createTextNode(Utilities.Format_Date(project.date_last_updated)));
            tr.appendChild(dateUpdated);
            return tr;
        };
        Project.Save = function () {
            // let's lock the button down so the user can't click it multiple times
            // we'll also want to update it to show that it's loading
            //let saveButton = document.getElementById("saveProject");
            Utilities.Toggle_Loading_Button("saveProject", true);
            ProjectTracking.selected_project.project_name = Utilities.Get_Value("projectName");
            ProjectTracking.selected_project.milestones = ProjectTracking.Milestone.ReadMilestones();
            ProjectTracking.selected_project.department_id = parseInt(Utilities.Get_Value("projectDepartment"));
            ProjectTracking.selected_project.funding_id = parseInt(Utilities.Get_Value("projectFunding"));
            ProjectTracking.selected_project.timeline = Utilities.Get_Value("projectTimeline");
            ProjectTracking.selected_project.comment = Utilities.Get_Value("projectComment");
            var completed = document.getElementById("projectComplete");
            ProjectTracking.selected_project.completed = completed.checked;
            var share = document.getElementById("projectCommissionerShare");
            ProjectTracking.selected_project.commissioner_share = share.checked;
            var ifshare = document.getElementById("projectInfrastructureShare");
            ProjectTracking.selected_project.infrastructure_share = ifshare.checked;
            var path = ProjectTracking.GetPath();
            var saveType = (ProjectTracking.selected_project.id > -1) ? "Update" : "Add";
            Utilities.Post_Empty(path + "API/Project/" + saveType, ProjectTracking.selected_project)
                .then(function (r) {
                console.log('post response', r);
                if (!r.ok) {
                    // do some error stuff
                    console.log('some errors happened with post response');
                }
                else {
                    // we good
                    console.log('post response good');
                    ProjectTracking.Project.GetProjects();
                    ProjectTracking.CloseModals();
                }
                Utilities.Toggle_Loading_Button("saveProject", false);
            }, function (e) {
                console.log('error getting permits', e);
                //Toggle_Loading_Search_Buttons(false);
                Utilities.Toggle_Loading_Button("saveProject", false);
            });
        };
        return Project;
    }());
    ProjectTracking.Project = Project;
})(ProjectTracking || (ProjectTracking = {}));
//# sourceMappingURL=Project.js.map
/// <reference path="../utilities/utilities.ts" />
var ProjectTracking;
(function (ProjectTracking) {
    "use strict";
    ProjectTracking.selected_project = new ProjectTracking.Project();
    ProjectTracking.projects = [];
    ProjectTracking.filtered_projects = [];
    ProjectTracking.departments = [];
    ProjectTracking.my_departments = [];
    ProjectTracking.funding_sources = [];
    ProjectTracking.number_of_milestones = 0;
    function Start() {
        ProjectTracking.DataValue.GetDepartments();
        ProjectTracking.DataValue.GetFunding();
        ProjectTracking.DataValue.GetMyDepartments();
        ProjectTracking.Project.GetProjects();
    }
    ProjectTracking.Start = Start;
    function ShowAddProject() {
        document.getElementById("addProject").classList.add("is-active");
    }
    ProjectTracking.ShowAddProject = ShowAddProject;
    function CloseModals() {
        Utilities.Toggle_Loading_Button("saveProject", false);
        var modals = document.querySelectorAll(".modal");
        if (modals.length > 0) {
            for (var i = 0; i < modals.length; i++) {
                var modal = modals.item(i);
                modal.classList.remove("is-active");
            }
        }
    }
    ProjectTracking.CloseModals = CloseModals;
    function GetPath() {
        var path = "/";
        var i = window.location.pathname.toLowerCase().indexOf("/projecttracking");
        if (i == 0) {
            path = "/projecttracking/";
        }
        return path;
    }
    ProjectTracking.GetPath = GetPath;
    function FilterProjects() {
        ProjectTracking.Project.BuildProjectTrackingList(ProjectTracking.Project.ApplyFilters(ProjectTracking.projects));
    }
    ProjectTracking.FilterProjects = FilterProjects;
    function FinishedLoading() {
        //let button = document.getElementById("addProjectButton");
        Utilities.Toggle_Loading_Button("addProjectButton", false);
        Utilities.Show("filters");
    }
    ProjectTracking.FinishedLoading = FinishedLoading;
    function AddProjectResultsMessage(message) {
        var container = document.getElementById("projectList");
        Utilities.Clear_Element(container);
        var tr = document.createElement("tr");
        var td = document.createElement("td");
        td.colSpan = 6;
        td.appendChild(document.createTextNode(message));
        tr.appendChild(td);
        container.appendChild(tr);
    }
    ProjectTracking.AddProjectResultsMessage = AddProjectResultsMessage;
})(ProjectTracking || (ProjectTracking = {}));
//# sourceMappingURL=ProjectTracking.js.map