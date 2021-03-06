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
                //ProjectTracking.funding_sources.push(new DataValue("Select Funding", "0", true));          
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
    function Get_Date_Value(e, adjust_for_timezone) {
        if (typeof e == "string") {
            e = document.getElementById(e);
        }
        var input_date = e;
        var d = input_date.valueAsDate;
        if (input_date.value.length === 0)
            return null;
        if (adjust_for_timezone)
            d.setMinutes(d.getTimezoneOffset());
        return d;
    }
    Utilities.Get_Date_Value = Get_Date_Value;
    function Set_Value(e, value) {
        if (typeof e == "string") {
            e = document.getElementById(e);
        }
        e.value = value;
    }
    Utilities.Set_Value = Set_Value;
    function Set_Date_Value(e, value) {
        var input;
        if (typeof e == "string") {
            input = document.getElementById(e);
        }
        else {
            input = e;
        }
        input.value = "";
        if (typeof value == "string") {
            if (new Date(value).getFullYear() > 1000) {
                input.valueAsDate = new Date(value);
            }
            return;
        }
        if (value instanceof Date) {
            input.valueAsDate = value;
        }
    }
    Utilities.Set_Date_Value = Set_Date_Value;
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
            var _loop_1 = function (c) {
                var li = document.createElement("li");
                var comment = full ? c.added_by + ' - ' + c.comment : c.comment;
                var span = document.createElement("span");
                span.appendChild(document.createTextNode(comment));
                if (c.by_county_manager) {
                    span.style.color = "red";
                    span.style.fontWeight = "bold";
                }
                li.appendChild(span);
                if (full) {
                    var deletebutton = document.createElement("button");
                    deletebutton.classList.add("delete");
                    li.appendChild(deletebutton);
                    var deletecontainer_1 = document.createElement("div");
                    deletecontainer_1.style.display = "none";
                    deletecontainer_1.classList.add("notification");
                    deletecontainer_1.classList.add("is-danger");
                    li.appendChild(deletecontainer_1);
                    var questioncontainer = document.createElement("span");
                    questioncontainer.appendChild(document.createTextNode("Are you sure you want to delete this comment?"));
                    deletecontainer_1.appendChild(questioncontainer);
                    var yespleasedeletebutton_1 = document.createElement("button");
                    yespleasedeletebutton_1.appendChild(document.createTextNode("Delete"));
                    yespleasedeletebutton_1.classList.add("button");
                    yespleasedeletebutton_1.style.marginRight = "1em";
                    yespleasedeletebutton_1.style.marginLeft = "1em";
                    yespleasedeletebutton_1.onclick = function () {
                        // do actual delete stuff here
                        Utilities.Toggle_Loading_Button(yespleasedeletebutton_1, true);
                        Utilities.Toggle_Loading_Button(cancelbutton_1, true);
                        var path = ProjectTracking.GetPath();
                        Utilities.Post_Empty(path + "API/Project/DeleteComment?comment_id=" + c.id.toString(), null)
                            .then(function (r) {
                            console.log('post response', r);
                            if (!r.ok) {
                                // do some error stuff
                                console.log('some errors happened with post response');
                                alert("There was an issue deleting this comment.  Please try again, and put in a help desk ticket if the issue persists.");
                            }
                            Utilities.Toggle_Loading_Button(yespleasedeletebutton_1, false);
                            Utilities.Toggle_Loading_Button(cancelbutton_1, false);
                            deletecontainer_1.style.display = "none";
                            li.style.display = "none";
                        }, function (e) {
                            console.log('error getting delete comment', e);
                            Utilities.Toggle_Loading_Button(yespleasedeletebutton_1, false);
                            Utilities.Toggle_Loading_Button(cancelbutton_1, false);
                        });
                    };
                    deletecontainer_1.appendChild(yespleasedeletebutton_1);
                    var cancelbutton_1 = document.createElement("button");
                    cancelbutton_1.classList.add("button");
                    cancelbutton_1.appendChild(document.createTextNode("Cancel"));
                    cancelbutton_1.onclick = function () {
                        deletecontainer_1.style.display = "none";
                    };
                    deletecontainer_1.appendChild(cancelbutton_1);
                    deletebutton.onclick = function () {
                        // show the delete container
                        deletecontainer_1.style.display = "block";
                    };
                }
                ol.appendChild(li);
            };
            for (var _i = 0, comments_1 = comments; _i < comments_1.length; _i++) {
                var c = comments_1[_i];
                _loop_1(c);
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
var ProjectTracking;
(function (ProjectTracking) {
    "use strict";
    var Milestone = /** @class */ (function () {
        function Milestone() {
            this.id = -1;
            this.project_id = -1;
            this.name = "";
            this.display_order = -1;
            this.completed = false;
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
            var field_input = document.createElement("div");
            field_input.classList.add("field");
            var control_input = document.createElement("div");
            control_input.classList.add("control");
            control_input.classList.add("is-medium");
            var input = document.createElement("input");
            input.classList.add("input");
            input.classList.add("is-medium");
            input.type = "text";
            input.id = "projectMilestone" + nm;
            control_input.appendChild(input);
            field_input.appendChild(control_input);
            inputCell.appendChild(field_input);
            var completedCell = document.createElement("td");
            var field_completed = document.createElement("div");
            field_completed.classList.add("field");
            var control_completed = document.createElement("div");
            control_completed.classList.add("control");
            control_completed.classList.add("is-medium");
            control_completed.classList.add("has-text-centered");
            var completed_checkbox = document.createElement("input");
            //completed_checkbox.classList.add("input");
            //completed_checkbox.classList.add("is-medium");
            completed_checkbox.type = "checkbox";
            completed_checkbox.id = "projectMilestoneCompleted" + nm;
            control_completed.appendChild(completed_checkbox);
            field_completed.appendChild(control_completed);
            completedCell.appendChild(field_completed);
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
            //removeButton.disabled = ProjectTracking.number_of_milestones === 1;
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
            tr.appendChild(completedCell);
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
                //remove.disabled = (ProjectTracking.number_of_milestones === 1);
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
            var completed_checkbox = document.getElementById("projectMilestoneCompleted" + milestone.display_order.toString());
            completed_checkbox.checked = milestone.completed;
        };
        Milestone.MilestonesView = function (milestones, project_completed) {
            milestones.sort(function (a, b) { return a.display_order - b.display_order; });
            var df = document.createDocumentFragment();
            if (milestones.length === 0)
                return df;
            var ol = document.createElement("ol");
            ol.classList.add("comments");
            var hidden = [];
            for (var _i = 0, milestones_3 = milestones; _i < milestones_3.length; _i++) {
                var m = milestones_3[_i];
                var li = document.createElement("li");
                li.appendChild(document.createTextNode(m.name));
                if (m.completed) {
                    li.classList.add("hide");
                    li.classList.add("show-for-print");
                    hidden.push(li);
                }
                ol.appendChild(li);
            }
            var completed_li = document.createElement("li");
            if (hidden.length > 0) {
                completed_li.classList.add("hide-for-print");
                if (project_completed) {
                    completed_li.classList.add("completed_milestones_are_hidden_project_completed");
                }
                else {
                    completed_li.classList.add("completed_milestones_are_hidden_project_incomplete");
                }
                completed_li.appendChild(document.createTextNode("click to view completed milestones"));
                ol.appendChild(completed_li);
                ol.style.cursor = "pointer";
            }
            ol.onclick = function () {
                if (hidden.length === 0)
                    return;
                var is_hidden = hidden[0].classList.contains("hide");
                for (var _i = 0, hidden_1 = hidden; _i < hidden_1.length; _i++) {
                    var e = hidden_1[_i];
                    if (is_hidden) {
                        e.classList.remove("hide");
                    }
                    else {
                        e.classList.add("hide");
                    }
                }
                if (is_hidden) {
                    completed_li.classList.add("hide");
                }
                else {
                    completed_li.classList.remove("hide");
                }
            };
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
                m.completed = document.getElementById("projectMilestoneCompleted" + i.toString()).checked;
                milestones.push(m);
            }
            return milestones;
        };
        return Milestone;
    }());
    ProjectTracking.Milestone = Milestone;
})(ProjectTracking || (ProjectTracking = {}));
//# sourceMappingURL=Milestone.js.map
var google;
var ProjectTracking;
(function (ProjectTracking) {
    "use strict";
    var PriorityLevel;
    (function (PriorityLevel) {
        PriorityLevel[PriorityLevel["Low"] = 0] = "Low";
        PriorityLevel[PriorityLevel["Normal"] = 1] = "Normal";
        PriorityLevel[PriorityLevel["High"] = 2] = "High";
    })(PriorityLevel = ProjectTracking.PriorityLevel || (ProjectTracking.PriorityLevel = {}));
    var Project = /** @class */ (function () {
        function Project() {
            this.id = -1;
            this.project_name = "";
            this.department_id = -1;
            this.funding_id = 1;
            this.timeline = "";
            this.commissioner_share = false;
            this.infrastructure_share = false;
            this.legislative_tracking = false;
            this.completed = false;
            this.date_last_updated = null;
            this.date_completed = null;
            this.can_edit = false;
            this.milestones = [];
            this.comments = [];
            //public phase_1_name: string = "";
            //public phase_2_name: string = "";
            //public phase_3_name: string = "";
            //public phase_4_name: string = "";
            //public phase_5_name: string = "";
            //public phase_1_start: Date;
            //public phase_1_completion: Date;
            //public phase_2_start: Date;
            //public phase_2_completion: Date;
            //public phase_3_start: Date;
            //public phase_3_completion: Date;
            //public phase_4_start: Date;
            //public phase_4_completion: Date;
            //public phase_5_start: Date;
            //public phase_5_completion: Date;
            this.phases = [];
        }
        Project.GetProjects = function () {
            ProjectTracking.charts = {};
            var buttonId = "filterRefreshButton";
            Utilities.Toggle_Loading_Button(buttonId, true);
            var path = ProjectTracking.GetPath();
            Utilities.Get(path + "API/Project/List")
                .then(function (projects) {
                console.log("projects", projects);
                ProjectTracking.projects = projects;
                var filtered = Project.ApplyFilters(projects);
                Project.BuildProjectTrackingList(filtered);
                Project.BuildProjectSummaryList(filtered);
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
            var projectNameFilter = ProjectTracking.project_name_filter.toUpperCase();
            var shareFilter = document.getElementById("projectCommissionerShareFilter").checked;
            var completedFilter = document.getElementById("projectCompleteFilter").checked;
            var infrastructureFilter = document.getElementById("projectInfrastructureFilter").checked;
            var legislativeFilter = document.getElementById("projectLegislativeFilter").checked;
            var highpriorityFilter = document.getElementById("projectHighPriorityFilter").checked;
            var needsAttentionFilter = document.getElementById("projectNeedsAttentionFilter").checked;
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
                return ((legislativeFilter && j.legislative_tracking) || !legislativeFilter);
            });
            projects = projects.filter(function (j) {
                return ((completedFilter && !j.completed) || !completedFilter);
            });
            projects = projects.filter(function (j) {
                return ((needsAttentionFilter && j.needs_attention) || !needsAttentionFilter);
            });
            projects = projects.filter(function (j) {
                return ((highpriorityFilter && j.priority === PriorityLevel.High) || !highpriorityFilter);
            });
            projects = projects.filter(function (j) {
                return ((infrastructureFilter && j.infrastructure_share) || !infrastructureFilter);
            });
            projects = projects.filter(function (j) {
                return (projectNameFilter.length > 0 && j.project_name.toUpperCase().indexOf(projectNameFilter) > -1 || projectNameFilter.length === 0);
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
            Project.UpdateProjectFunding("0");
            ProjectTracking.Milestone.ClearMilestones();
            ProjectTracking.Phase.ClearPhases();
            Project.UpdateProjectTimeline("");
            Project.UpdateProjectCompleted(false);
            Project.UpdateNeedsAttention(false);
            Project.UpdateProjectPriority(1);
            Project.UpdateCommissionerShare(false);
            Project.UpdateInfrastructureShare(false);
            Project.UpdateLegislativeTracking(false);
            Project.UpdateProjectEstimatedCompletionDate("");
            //Project.UpdatePhaseDates(null);
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
            ProjectTracking.Phase.LoadPhases(project.phases);
            Project.UpdateProjectTimeline(project.timeline);
            Project.UpdateProjectCompleted(project.completed);
            Project.UpdateCommissionerShare(project.commissioner_share);
            Project.UpdateInfrastructureShare(project.infrastructure_share);
            Project.UpdateLegislativeTracking(project.legislative_tracking);
            Project.UpdateNeedsAttention(project.needs_attention);
            Project.UpdateProjectEstimatedCompletionDate(project.estimated_completion_date);
            //Project.UpdatePhaseDates(project);
            Project.UpdateProjectPriority(project.priority);
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
        //public static UpdatePhaseDates(project: Project): void
        //{
        //  if (project === null)
        //  {
        //    Utilities.Set_Value("phase_1_name", "");
        //    Utilities.Set_Value("phase_2_name", "");
        //    Utilities.Set_Value("phase_3_name", "");
        //    Utilities.Set_Value("phase_4_name", "");
        //    Utilities.Set_Value("phase_5_name", "");
        //    Utilities.Set_Value("phase_1_start", "");
        //    Utilities.Set_Value("phase_2_start", "");
        //    Utilities.Set_Value("phase_3_start", "");
        //    Utilities.Set_Value("phase_4_start", "");
        //    Utilities.Set_Value("phase_5_start", "");
        //    Utilities.Set_Value("phase_1_completion", "");
        //    Utilities.Set_Value("phase_2_completion", "");
        //    Utilities.Set_Value("phase_3_completion", "");
        //    Utilities.Set_Value("phase_4_completion", "");
        //    Utilities.Set_Value("phase_5_completion", "");
        //  }
        //  else
        //  {
        //    Utilities.Set_Value("phase_1_name", project.phase_1_name);
        //    Utilities.Set_Value("phase_2_name", project.phase_2_name);
        //    Utilities.Set_Value("phase_3_name", project.phase_3_name);
        //    Utilities.Set_Value("phase_4_name", project.phase_4_name);
        //    Utilities.Set_Value("phase_5_name", project.phase_5_name);
        //    Project.UpdateDateInput("phase_1_start", project.phase_1_start);
        //    Project.UpdateDateInput("phase_2_start", project.phase_2_start);
        //    Project.UpdateDateInput("phase_3_start", project.phase_3_start);
        //    Project.UpdateDateInput("phase_4_start", project.phase_4_start);
        //    Project.UpdateDateInput("phase_5_start", project.phase_5_start);
        //    Project.UpdateDateInput("phase_1_completion", project.phase_1_completion);
        //    Project.UpdateDateInput("phase_2_completion", project.phase_2_completion);
        //    Project.UpdateDateInput("phase_3_completion", project.phase_3_completion);
        //    Project.UpdateDateInput("phase_4_completion", project.phase_4_completion);
        //    Project.UpdateDateInput("phase_5_completion", project.phase_5_completion);
        //  }
        //}
        Project.UpdateDateInput = function (id, value) {
            var input = document.getElementById(id);
            input.value = "";
            if (value === null)
                return;
            var s = value.toString();
            if (new Date(s).getFullYear() > 1000) {
                input.valueAsDate = new Date(s);
            }
        };
        Project.UpdateProjectName = function (projectName) {
            Utilities.Set_Value("projectName", projectName);
        };
        Project.UpdateProjectDepartment = function (departmentId) {
            Utilities.Set_Value("projectDepartment", departmentId);
        };
        Project.UpdateProjectPriority = function (priority) {
            Utilities.Set_Value("projectPriority", priority.toString());
        };
        Project.UpdateProjectEstimatedCompletionDate = function (estimatedDate) {
            var input = document.getElementById("projectEstimatedCompletionDate");
            input.value = "";
            if (new Date(estimatedDate.toString()).getFullYear() > 1000) {
                //let formatted_date = Utilities.Format_Date(estimatedDate);
                input.valueAsDate = new Date(estimatedDate);
            }
            //Utilities.Set_Value("projectEstimatedCompletionDate", estimatedDate);
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
        Project.UpdateLegislativeTracking = function (legislative) {
            var tracking = document.getElementById("projectLegislativeTracking");
            tracking.checked = legislative;
        };
        Project.UpdateCommissionerShare = function (share) {
            var shared = document.getElementById("projectCommissionerShare");
            shared.checked = share;
        };
        Project.UpdateNeedsAttention = function (share) {
            var shared = document.getElementById("projectNeedsAttention");
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
        Project.BuildProjectSummaryList = function (projects) {
            var container = document.getElementById("projectSummary");
            Utilities.Clear_Element(container);
            var df = document.createDocumentFragment();
            for (var _i = 0, projects_2 = projects; _i < projects_2.length; _i++) {
                var p = projects_2[_i];
                var phase_rows = Project.CreateNewGanttChartRows(p);
                df.appendChild(Project.CreateProjectSummaryRow(p, phase_rows));
                if (phase_rows.length > 0) {
                    var tr = document.createElement("tr");
                    tr.classList.add("hide");
                    var td = document.createElement("td");
                    td.colSpan = 5;
                    var chart_container = document.createElement("div");
                    chart_container.id = "chart_" + p.id.toString();
                    chart_container.style.width = "100%";
                    td.appendChild(chart_container);
                    tr.appendChild(td);
                    df.appendChild(tr);
                }
            }
            container.appendChild(df);
        };
        Project.CreateProjectSummaryRow = function (project, phase_rows) {
            //project.comments = project.comments.filter(function (j) { return j.comment.length > 0; });
            var tr = document.createElement("tr");
            //if (project.needs_attention)
            //{
            //  tr.classList.add("needs-attention");
            //}
            //else
            //{
            //  if (project.completed)
            //  {
            //    tr.classList.add("completed");
            //  }
            //}
            tr.classList.add("pagebreak");
            var projectName = document.createElement("td");
            var projectNameContainer = document.createElement("div");
            projectName.appendChild(projectNameContainer);
            if (project.can_edit) {
                var a = document.createElement("a");
                a.appendChild(document.createTextNode(project.project_name));
                a.onclick = function () {
                    ProjectTracking.selected_project = project; // this is the project we'll be attempting to update.
                    Project.LoadProject(project);
                    console.log('selected_project', ProjectTracking.selected_project);
                };
                projectNameContainer.appendChild(a);
            }
            else {
                projectNameContainer.appendChild(document.createTextNode(project.project_name));
            }
            //if (project.priority !== PriorityLevel.Normal)
            //{
            //  let p = document.createElement("p");
            //  p.appendChild(document.createTextNode(PriorityLevel[project.priority].toString() + " priority"));
            //  projectNameContainer.appendChild(p);
            //}
            //if (project.needs_attention)
            //{
            //  let p = document.createElement("p");
            //  p.appendChild(document.createTextNode("Needs Attention"));
            //  projectNameContainer.appendChild(p);
            //}
            //let comments = document.createElement("td");
            //let dfComments = Comment.CommentsView(project.comments, false);
            //comments.appendChild(dfComments);
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
            //let milestones = document.createElement("td");
            //milestones.appendChild(Milestone.MilestonesView(project.milestones, project.completed));
            //tr.appendChild(milestones);
            //let oldCurrentPhase = Project.GetCurrentPhase(project, true, phase_rows);
            //oldCurrentPhase.style.backgroundColor = "#00FFFF";
            var newCurrentPhase = ProjectTracking.Phase.GetCurrentPhases(project, true, phase_rows);
            var phase_td = document.createElement("td");
            //phase_td.appendChild(oldCurrentPhase);
            phase_td.appendChild(newCurrentPhase);
            tr.appendChild(phase_td); // get the current phase
            //let timeline = document.createElement("td");
            //timeline.appendChild(document.createTextNode(project.timeline));
            //tr.appendChild(timeline);
            //tr.appendChild(comments);
            var dateUpdated = document.createElement("td");
            var dateUpdatedContainer = document.createElement("div");
            dateUpdatedContainer.classList.add("has-text-centered");
            dateUpdated.appendChild(dateUpdatedContainer);
            //dateUpdatedContainer.appendChild(document.createTextNode(Utilities.Format_Date(project.date_last_updated)));
            if (new Date(project.estimated_completion_date.toString()).getFullYear() > 1000) {
                //  let hr = document.createElement("hr");
                //  dateUpdatedContainer.appendChild(hr);
                //  let p = document.createElement("p");
                dateUpdatedContainer.appendChild(document.createTextNode(Utilities.Format_Date(project.estimated_completion_date)));
                //  dateUpdatedContainer.appendChild(p);
            }
            tr.appendChild(dateUpdated);
            return tr;
        };
        Project.CreateProjectRow = function (project) {
            project.comments = project.comments.filter(function (j) { return j.comment.length > 0; });
            var tr = document.createElement("tr");
            if (project.needs_attention) {
                tr.classList.add("needs-attention");
            }
            else {
                if (project.completed) {
                    tr.classList.add("completed");
                }
            }
            tr.classList.add("pagebreak");
            var projectName = document.createElement("td");
            var projectNameContainer = document.createElement("div");
            projectName.appendChild(projectNameContainer);
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
                projectNameContainer.appendChild(a);
            }
            else {
                projectNameContainer.appendChild(document.createTextNode(project.project_name));
            }
            if (project.priority !== PriorityLevel.Normal) {
                var p = document.createElement("p");
                p.appendChild(document.createTextNode(PriorityLevel[project.priority].toString() + " priority"));
                projectNameContainer.appendChild(p);
            }
            if (project.needs_attention) {
                var p = document.createElement("p");
                p.appendChild(document.createTextNode("Needs Attention"));
                projectNameContainer.appendChild(p);
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
            milestones.appendChild(ProjectTracking.Milestone.MilestonesView(project.milestones, project.completed));
            tr.appendChild(milestones);
            //let oldCurrentPhase = Project.GetCurrentPhase(project, false, []);
            //oldCurrentPhase.style.backgroundColor = "#00FFFF";
            var newCurrentPhase = ProjectTracking.Phase.GetCurrentPhases(project, false, []);
            var phase_td = document.createElement("td");
            //phase_td.appendChild(oldCurrentPhase);
            phase_td.appendChild(newCurrentPhase);
            tr.appendChild(phase_td); // get the current phase
            //tr.appendChild(Project.GetCurrentPhase(project, false, [])); // get the current phase
            //let timeline = document.createElement("td");
            //timeline.appendChild(document.createTextNode(project.timeline));
            //tr.appendChild(timeline);
            tr.appendChild(comments);
            var dateUpdated = document.createElement("td");
            var dateUpdatedContainer = document.createElement("div");
            dateUpdatedContainer.classList.add("has-text-centered");
            dateUpdated.appendChild(dateUpdatedContainer);
            dateUpdatedContainer.appendChild(document.createTextNode(Utilities.Format_Date(project.date_last_updated)));
            //if (new Date(project.estimated_completion_date.toString()).getFullYear() > 1000)
            //{
            //  let hr = document.createElement("hr");
            //  dateUpdatedContainer.appendChild(hr);
            //  let p = document.createElement("p");
            //  p.appendChild(document.createTextNode(Utilities.Format_Date(project.estimated_completion_date)));
            //  dateUpdatedContainer.appendChild(p);
            //}
            tr.appendChild(dateUpdated);
            return tr;
        };
        //private static GetCurrentPhase(project: Project, add_aging_color: boolean, phase_rows: Array<any>): HTMLDivElement
        //{
        //  let ignore = "Ignore this Phase";
        //  //let td = document.createElement("td");
        //  let container = document.createElement("div");
        //  let span = document.createElement("span");
        //  let color = "";
        //  let has_been_completed: boolean = false;
        //  if (project.completed)
        //  {
        //    if (add_aging_color)
        //    {
        //      let img = document.createElement("img");
        //      img.src = "content/images/circle-green128.png";
        //      container.appendChild(img);
        //    }
        //    span.appendChild(document.createTextNode("Project Completed"));
        //    container.appendChild(span);
        //    return container;
        //  }
        //  let current_phase = 0;
        //  let current_phase_start: Date = null;
        //  let current_phase_end: Date = null;
        //  for (let i = 1; i < 6; i++)
        //  {
        //    let name = <string>project["phase_" + i.toString() + "_name"];
        //    let start = <Date>project["phase_" + i.toString() + "_start"];
        //    let completion = <Date>project["phase_" + i.toString() + "_completion"];
        //    if (completion !== null) has_been_completed = true;
        //    if (completion === null && name !== ignore && name.length > 0)
        //    {
        //      if (start !== null && name !== ignore && name.length > 0)
        //      {
        //        current_phase = i;
        //        current_phase_start = <Date>project["phase_" + i.toString() + "_start"];
        //        for (let j = i + 1; j < 6; j++)
        //        {
        //          let name_end = <string>project["phase_" + j.toString() + "_name"];
        //          let start_end = <Date>project["phase_" + j.toString() + "_start"];
        //          if (name_end !== ignore && start_end !== null)
        //          {
        //            current_phase_end = start_end;
        //            break;
        //          }
        //        }
        //        if (current_phase_end === null)
        //        {
        //          current_phase_end = project.estimated_completion_date;
        //        }
        //        //if (i < 5)
        //        //{
        //        //  current_phase_end = <Date>project["phase_" + (i + 1).toString() + "_start"];
        //        //}
        //        //else
        //        //{
        //        //}
        //      }
        //      break;
        //    }
        //  }
        //  if (current_phase === 0)
        //  {
        //    if (has_been_completed)
        //    {
        //      span.appendChild(document.createTextNode("Phases Completed, Project not marked as completed."));
        //      color = "green";
        //    }
        //    else
        //    {
        //      span.appendChild(document.createTextNode("Phases not entered."));
        //      color = "black";
        //    }
        //    //return td;
        //  }
        //  else
        //  {
        //    let phase_name = Project.GetPhaseName(current_phase, project);
        //    let text = phase_name + ":  " + Utilities.Format_Date(current_phase_start);
        //    text += " - ";
        //    if (current_phase_end === null)
        //    {
        //      text += "No Ending Date";
        //    }
        //    else
        //    {
        //      text += Utilities.Format_Date(current_phase_end);
        //      let d = new Date();
        //      let today = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        //      var diff = Math.round((today.getTime() - new Date(<any>current_phase_end).getTime()) / 86400000); 
        //      if (diff > 30)
        //      {
        //        color = "red";
        //      }
        //      else
        //      {
        //        if (diff > 0)
        //        {
        //          color = "yellow";
        //        }
        //        else
        //        {
        //          color = "green";   
        //        }
        //      }
        //    }
        //    span.appendChild(document.createTextNode(text));
        //  }
        //  if (add_aging_color && color.length > 0)
        //  {
        //    let img = document.createElement("img");
        //    img.src = "content/images/circle-" + color + "128.png";
        //    container.appendChild(img);
        //  }
        //  container.appendChild(span);
        //  if (phase_rows.length > 0)
        //  {
        //    span.onclick = () =>
        //    {
        //      Project.DrawGanttChart(project.id, phase_rows);
        //    }
        //    span.style.cursor = "pointer";
        //  }
        //  //if (!add_aging_color) 
        //  return container;
        //}
        //private static GetPhaseName(phase_number: number, project: Project): string
        //{
        //  if (phase_number === 6) return "Completed";
        //  return <string>project["phase_" + phase_number.toString() + "_name"];
        //  //return Utilities.Get_Value("phase_" + phase_number.toString() + "_name");
        //  //switch (phase_number)
        //  //{
        //  //  case 1:
        //  //    return "Develop Specifications";
        //  //  case 2:
        //  //    return "Procurement";
        //  //  case 3:
        //  //    return "Design (Construction)";
        //  //  case 4:
        //  //    return "Bid (Construction)";
        //  //  case 5:
        //  //    return "Construction / Implementation";
        //  //  case 6:
        //  //    return "Completed";
        //  //  default:
        //  //    return "";
        //  //}
        //}
        // summary view
        //private static ValidatePhaseDate(project: Project, phase_number: number): boolean
        //{
        //  let ignore = "Ignore this Phase";
        //  if (<string>project["phase_" + phase_number.toString() + "_name"] === ignore) return true;
        //  let start = <Date>project["phase_" + phase_number + "_start"];
        //  let completion = <Date>project["phase_" + phase_number + "_completion"];
        //  if (start !== null && completion !== null)
        //  {
        //    return (start <= completion);
        //  }
        //  return true;
        //}
        //private static ValidatePhaseDates(): boolean
        //{
        //  let ignore = "Ignore this Phase";
        //  let error_text = "";
        //  ProjectTracking.selected_project.estimated_completion_date = Utilities.Get_Date_Value("projectEstimatedCompletionDate", true);
        //  ProjectTracking.selected_project.phase_1_name = Utilities.Get_Value("phase_1_name");
        //  ProjectTracking.selected_project.phase_2_name = Utilities.Get_Value("phase_2_name");
        //  ProjectTracking.selected_project.phase_3_name = Utilities.Get_Value("phase_3_name");
        //  ProjectTracking.selected_project.phase_4_name = Utilities.Get_Value("phase_4_name");
        //  ProjectTracking.selected_project.phase_5_name = Utilities.Get_Value("phase_5_name");
        //  // get date values;
        //  ProjectTracking.selected_project.phase_1_start = Utilities.Get_Date_Value("phase_1_start", true);
        //  ProjectTracking.selected_project.phase_2_start = Utilities.Get_Date_Value("phase_2_start", true);
        //  ProjectTracking.selected_project.phase_3_start = Utilities.Get_Date_Value("phase_3_start", true);
        //  ProjectTracking.selected_project.phase_4_start = Utilities.Get_Date_Value("phase_4_start", true);
        //  ProjectTracking.selected_project.phase_5_start = Utilities.Get_Date_Value("phase_5_start", true);
        //  ProjectTracking.selected_project.phase_1_completion = Utilities.Get_Date_Value("phase_1_completion", true);
        //  ProjectTracking.selected_project.phase_2_completion = Utilities.Get_Date_Value("phase_2_completion", true);
        //  ProjectTracking.selected_project.phase_3_completion = Utilities.Get_Date_Value("phase_3_completion", true);
        //  ProjectTracking.selected_project.phase_4_completion = Utilities.Get_Date_Value("phase_4_completion", true);
        //  ProjectTracking.selected_project.phase_5_completion = Utilities.Get_Date_Value("phase_5_completion", true);
        //  // check for error
        //  // validation logic should be as follows:
        //  // successive phase dates should be after or the same as previous phase dates.
        //  // ie: phase 1 start date should be:
        //  // less than or equal to phase 1 completion date
        //  // less than or equal to phase 2 start date
        //  // we only compare each phase's start date to it's completion date
        //  // so that they can leave the start dates alone if a phase is completed late.
        //  // and so on
        //  // null values are ignored
        //  let p = ProjectTracking.selected_project;
        //  let date_compare: Array<Date> = [];
        //  for (let i = 1; i < 6; i++)
        //  {
        //    let start = <Date>p["phase_" + i.toString() + "_start"];
        //    let name = <string>p["phase_" + i.toString() + "_name"];
        //    if (name !== ignore && name.length > 0 && start === null)
        //    {
        //      error_text = "You have selected a phase name but not put in a start date.";
        //      break;
        //    }
        //    if (start !== null) date_compare.push(start);
        //    if (!Project.ValidatePhaseDate(p, i))
        //    {
        //      error_text = "Actual Completion Dates must be no earlier than the same date as the Start Date.";
        //    }
        //  }
        //  if (date_compare.length > 0 && error_text.length === 0)
        //  {
        //    if (p.estimated_completion_date === null)
        //    {
        //      error_text = "The Estimated Project Completion date is required if the phase dates are utilized.";
        //    }
        //    else
        //    {
        //      for (let i = 0; i < date_compare.length; i++)
        //      {
        //        if ((i + 1) < date_compare.length)
        //        {
        //          if (date_compare[i] > date_compare[i + 1] || date_compare[i] > p.estimated_completion_date)
        //          {
        //            error_text = "Phase dates must be in order.  An earlier phase cannot have a start date greater than a later phase or the project's estimated completion date.";
        //            break;
        //          }
        //        }
        //      }
        //    }
        //  }
        //  // set error
        //  Utilities.Set_Text("phase_dates_error", error_text);
        //  if (error_text.length > 0)
        //  {
        //    let e = document.getElementById("phase_dates_error");
        //    e.scrollTo();
        //  }
        //  // return true/false
        //  return error_text.length === 0;
        //}
        //private static ValidatePhases(): boolean
        //{
        //  let ignore = "Ignore this Phase";
        //  let error_text = "";
        //  // check for error
        //  // validation logic should be as follows:
        //  // successive phase dates should be after or the same as previous phase dates.
        //  // ie: phase 1 start date should be:
        //  // less than or equal to phase 1 completion date
        //  // less than or equal to phase 2 start date
        //  // we only compare each phase's start date to it's completion date
        //  // so that they can leave the start dates alone if a phase is completed late.
        //  // and so on
        //  // null values are ignored
        //  let p = ProjectTracking.selected_project;
        //  for (let phase of p.phases)
        //  {
        //  }
        //  let date_compare: Array<Date> = [];
        //  for (let i = 1; i < 6; i++)
        //  {
        //    let start = <Date>p["phase_" + i.toString() + "_start"];
        //    let name = <string>p["phase_" + i.toString() + "_name"];
        //    if (name !== ignore && name.length > 0 && start === null)
        //    {
        //      error_text = "You have selected a phase name but not put in a start date.";
        //      break;
        //    }
        //    if (start !== null) date_compare.push(start);
        //    if (!Project.ValidatePhaseDate(p, i))
        //    {
        //      error_text = "Actual Completion Dates must be no earlier than the same date as the Start Date.";
        //    }
        //  }
        //  if (date_compare.length > 0 && error_text.length === 0)
        //  {
        //    if (p.estimated_completion_date === null)
        //    {
        //      error_text = "The Estimated Project Completion date is required if the phase dates are utilized.";
        //    }
        //    else
        //    {
        //      for (let i = 0; i < date_compare.length; i++)
        //      {
        //        if ((i + 1) < date_compare.length)
        //        {
        //          if (date_compare[i] > date_compare[i + 1] || date_compare[i] > p.estimated_completion_date)
        //          {
        //            error_text = "Phase dates must be in order.  An earlier phase cannot have a start date greater than a later phase or the project's estimated completion date.";
        //            break;
        //          }
        //        }
        //      }
        //    }
        //  }
        //  // set error
        //  Utilities.Set_Text("phase_dates_error", error_text);
        //  if (error_text.length > 0)
        //  {
        //    let e = document.getElementById("phase_dates_error");
        //    e.scrollTo();
        //  }
        //  // return true/false
        //  return error_text.length === 0;
        //}
        Project.Save = function () {
            // let's lock the button down so the user can't click it multiple times
            // we'll also want to update it to show that it's loading
            //let saveButton = document.getElementById("saveProject");
            Utilities.Toggle_Loading_Button("saveProject", true);
            var projectName = Utilities.Get_Value("projectName").trim();
            if (projectName.length === 0) {
                //alert("You must have a project name in order to save, or you can click the Cancel button to exit without saving any changes.");
                var projectNameInput = document.getElementById("projectName");
                var e = document.getElementById("projectNameEmpty");
                Utilities.Error_Show(e, "", true);
                projectNameInput.focus();
                projectNameInput.scrollTo();
                Utilities.Toggle_Loading_Button("saveProject", false);
                return;
            }
            //if (!Project.ValidatePhaseDates())
            //{
            //  Utilities.Toggle_Loading_Button("saveProject", false);
            //  return;
            //}
            ProjectTracking.selected_project.project_name = projectName;
            ProjectTracking.selected_project.milestones = ProjectTracking.Milestone.ReadMilestones();
            ProjectTracking.selected_project.phases = ProjectTracking.Phase.ReadPhases();
            if (!ProjectTracking.Phase.ValidatePhases(ProjectTracking.selected_project.phases)) {
                Utilities.Toggle_Loading_Button("saveProject", false);
                return;
            }
            ProjectTracking.selected_project.department_id = parseInt(Utilities.Get_Value("projectDepartment"));
            ProjectTracking.selected_project.funding_id = parseInt(Utilities.Get_Value("projectFunding"));
            ProjectTracking.selected_project.timeline = Utilities.Get_Value("projectTimeline");
            ProjectTracking.selected_project.comment = Utilities.Get_Value("projectComment");
            ProjectTracking.selected_project.priority = PriorityLevel[Utilities.Get_Value("projectPriority")];
            ProjectTracking.selected_project.estimated_completion_date = Utilities.Get_Value("projectEstimatedCompletionDate");
            //ProjectTracking.selected_project.phase_1_name = Utilities.Get_Value("phase_1_name");
            //ProjectTracking.selected_project.phase_2_name = Utilities.Get_Value("phase_2_name");
            //ProjectTracking.selected_project.phase_3_name = Utilities.Get_Value("phase_3_name");
            //ProjectTracking.selected_project.phase_4_name = Utilities.Get_Value("phase_4_name");
            //ProjectTracking.selected_project.phase_5_name = Utilities.Get_Value("phase_5_name");
            //ProjectTracking.selected_project.phase_1_start = Utilities.Get_Date_Value("phase_1_start", true);
            //ProjectTracking.selected_project.phase_2_start = Utilities.Get_Date_Value("phase_2_start", true);
            //ProjectTracking.selected_project.phase_3_start = Utilities.Get_Date_Value("phase_3_start", true);
            //ProjectTracking.selected_project.phase_4_start = Utilities.Get_Date_Value("phase_4_start", true);
            //ProjectTracking.selected_project.phase_5_start = Utilities.Get_Date_Value("phase_5_start", true);
            //ProjectTracking.selected_project.phase_1_completion = Utilities.Get_Date_Value("phase_1_completion", true);
            //ProjectTracking.selected_project.phase_2_completion = Utilities.Get_Date_Value("phase_2_completion", true);
            //ProjectTracking.selected_project.phase_3_completion = Utilities.Get_Date_Value("phase_3_completion", true);
            //ProjectTracking.selected_project.phase_4_completion = Utilities.Get_Date_Value("phase_4_completion", true);
            //ProjectTracking.selected_project.phase_5_completion = Utilities.Get_Date_Value("phase_5_completion", true);
            //return;
            var completed = document.getElementById("projectComplete");
            ProjectTracking.selected_project.completed = completed.checked;
            var share = document.getElementById("projectCommissionerShare");
            ProjectTracking.selected_project.commissioner_share = share.checked;
            var ifshare = document.getElementById("projectInfrastructureShare");
            ProjectTracking.selected_project.infrastructure_share = ifshare.checked;
            var legislative = document.getElementById("projectLegislativeTracking");
            ProjectTracking.selected_project.legislative_tracking = legislative.checked;
            var needsattention = document.getElementById("projectNeedsAttention");
            ProjectTracking.selected_project.needs_attention = needsattention.checked;
            console.log("project to save", ProjectTracking.selected_project);
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
        Project.PopulatePriorities = function () {
            var priorities = document.getElementById("projectPriority");
            Utilities.Clear_Element(priorities);
            console.log("prioritylevel", PriorityLevel);
            for (var level in PriorityLevel) {
                if (level.length < 3) {
                    var option = document.createElement("option");
                    option.value = level.toString();
                    option.appendChild(document.createTextNode(PriorityLevel[level].toString()));
                    if (level === PriorityLevel.Normal.toString())
                        option.selected = true;
                    priorities.appendChild(option);
                }
            }
        };
        Project.ToggleSummaryView = function () {
            var button = document.getElementById("toggleSummaryView");
            Utilities.Toggle_Loading_Button(button, true);
            var buttonText = document.createElement("strong");
            Utilities.Clear_Element(button);
            if (ProjectTracking.default_view) {
                Utilities.Set_Text(buttonText, "Switch to Default View");
                Utilities.Hide("projectDefaultView");
                Utilities.Show("projectSummaryView");
            }
            else {
                Utilities.Set_Text(buttonText, "Switch to Summary View");
                //Project.BuildProjectTrackingList(Project.ApplyFilters(projects));
                Utilities.Show("projectDefaultView");
                Utilities.Hide("projectSummaryView");
            }
            button.appendChild(buttonText);
            ProjectTracking.default_view = !ProjectTracking.default_view;
            Utilities.Toggle_Loading_Button(button, false);
        };
        Project.CreateGanttChartRows = function (project) {
            if (project.completed)
                return [];
            var phase_dates = [];
            for (var i = 1; i < 6; i++) {
                var name_1 = project["phase_" + i.toString() + "_name"];
                var start = project["phase_" + i.toString() + "_start"];
                var end = project["phase_" + i.toString() + "_completion"];
                if (name_1.length > 0 && name_1 !== "Ignore this Phase") {
                    phase_dates.push({
                        name: name_1,
                        start: new Date(start),
                        end: end === null ? null : new Date(end)
                    });
                }
            }
            var estimated_completion = new Date(project.estimated_completion_date);
            if (estimated_completion.getFullYear() < 1000)
                estimated_completion = null;
            if (phase_dates.length === 0)
                return phase_dates;
            for (var i = 0; i < phase_dates.length; i++) {
                var pd = phase_dates[i];
                if (pd.end === null) {
                    if (i === phase_dates.length - 1) {
                        pd.end = estimated_completion;
                    }
                    else {
                        pd.end = phase_dates[i + 1].start;
                    }
                }
            }
            var ganttrows = [];
            for (var _i = 0, phase_dates_1 = phase_dates; _i < phase_dates_1.length; _i++) {
                var pd = phase_dates_1[_i];
                ganttrows.push([pd.name, pd.name, null, pd.start, pd.end, null, 100, null]);
            }
            return ganttrows;
        };
        Project.CreateNewGanttChartRows = function (project) {
            if (project.completed)
                return [];
            var phase_dates = [];
            for (var _i = 0, _a = project.phases; _i < _a.length; _i++) 
            //for (let i = 1; i < 6; i++)
            {
                var phase = _a[_i];
                //let name = <string>project["phase_" + i.toString() + "_name"];
                //let start = <string>project["phase_" + i.toString() + "_start"];
                //let end = <string>project["phase_" + i.toString() + "_completion"];
                var name_2 = phase.name.replace("Select Phase Name", "Phase Name not entered");
                var start = phase.started_on;
                var end = phase.completed_on !== null ? phase.completed_on : phase.estimated_completion;
                if (name_2.length > 0 && name_2 !== "Ignore this Phase" && start !== null && end !== null) {
                    phase_dates.push({
                        name: name_2,
                        start: new Date(start.toString()),
                        end: new Date(end.toString())
                    });
                }
            }
            //let estimated_completion = new Date(project.estimated_completion_date);
            //if (estimated_completion.getFullYear() < 1000) estimated_completion = null;
            //if (phase_dates.length === 0) return phase_dates;
            //for (let i = 0; i < phase_dates.length; i++)
            //{
            //  let pd = phase_dates[i];
            //  if (pd.end === null)
            //  {
            //    if (i === phase_dates.length - 1)
            //    {
            //      pd.end = estimated_completion;
            //    }
            //    else
            //    {
            //      pd.end = phase_dates[i + 1].start;
            //    }
            //  }
            //}
            var ganttrows = [];
            for (var _b = 0, phase_dates_2 = phase_dates; _b < phase_dates_2.length; _b++) {
                var pd = phase_dates_2[_b];
                ganttrows.push([pd.name, pd.name, null, pd.start, pd.end, null, 100, null]);
            }
            return ganttrows;
        };
        Project.DrawGanttChart = function (project_id, rows) {
            var chart_container = document.getElementById('chart_' + project_id.toString());
            var generate_chart = false;
            if (ProjectTracking.charts[project_id] === undefined) {
                ProjectTracking.charts[project_id] = new google.visualization.Gantt(chart_container);
                generate_chart = true;
            }
            var grandparent = chart_container.parentElement.parentElement;
            grandparent.classList.toggle("hide");
            if (rows.length === 0 || !generate_chart)
                return;
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Task ID');
            data.addColumn('string', 'Task Name');
            data.addColumn('string', 'Resource');
            data.addColumn('date', 'Start Date');
            data.addColumn('date', 'End Date');
            data.addColumn('number', 'Duration');
            data.addColumn('number', 'Percent Complete');
            data.addColumn('string', 'Dependencies');
            data.addRows(rows);
            var options = {
                height: (rows.length * 50) + 50,
                gantt: {
                    percentEnabled: false,
                    criticalPathEnabled: false,
                    labelStyle: {
                        fontName: "Segoe UI",
                        fontSize: 16,
                        color: '#363636'
                    }
                }
            };
            ProjectTracking.charts[project_id].draw(data, options);
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
    ProjectTracking.charts = {};
    ProjectTracking.selected_project = new ProjectTracking.Project();
    ProjectTracking.projects = [];
    ProjectTracking.filtered_projects = [];
    ProjectTracking.departments = [];
    ProjectTracking.my_departments = [];
    ProjectTracking.funding_sources = [];
    ProjectTracking.number_of_milestones = 0;
    ProjectTracking.number_of_phases = 0;
    ProjectTracking.project_name_filter = '';
    ProjectTracking.default_view = true;
    function Start() {
        //UpdatePhaseNameSelects();
        ProjectTracking.DataValue.GetDepartments();
        ProjectTracking.DataValue.GetFunding();
        ProjectTracking.DataValue.GetMyDepartments();
        ProjectTracking.Project.GetProjects();
        ProjectTracking.Project.PopulatePriorities();
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
        var projects = ProjectTracking.Project.ApplyFilters(ProjectTracking.projects);
        ProjectTracking.Project.BuildProjectTrackingList(projects);
        ProjectTracking.Project.BuildProjectSummaryList(projects);
    }
    ProjectTracking.FilterProjects = FilterProjects;
    function FilterProjectNames(input) {
        var v = input.value.trim();
        ProjectTracking.project_name_filter = v.length > 2 ? v : '';
        var projects = ProjectTracking.Project.ApplyFilters(ProjectTracking.projects);
        ProjectTracking.Project.BuildProjectTrackingList(projects);
        ProjectTracking.Project.BuildProjectSummaryList(projects);
    }
    ProjectTracking.FilterProjectNames = FilterProjectNames;
    function FinishedLoading() {
        //let button = document.getElementById("addProjectButton");
        Utilities.Toggle_Loading_Button("addProjectButton", false);
        Utilities.Toggle_Loading_Button("toggleSummaryView", false);
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
    //function UpdatePhaseNameSelects()
    //{
    //  let phase_names = [      
    //    "Develop Specifications",
    //    "Procurement",
    //    "Design",
    //    "Bid - Contract Development", 
    //    "Bid",
    //    "Right of Way - Property Acquisition",
    //    "RFQ - Contract Development",      
    //    "Regulatory Approval",
    //    "Implementation",
    //    "Construction",
    //    "Ignore this Phase",
    //  ]
    //  for (let i = 1; i < 6; i++) 
    //  {
    //    let select = <HTMLSelectElement>document.getElementById("phase_" + i.toString() + "_name");
    //    select.add(Utilities.Create_Option("", "Select Phase Name", true));
    //    for (let name of phase_names)
    //    {
    //      select.add(Utilities.Create_Option(name, name, false));
    //    }
    //  }
    //}
})(ProjectTracking || (ProjectTracking = {}));
//# sourceMappingURL=ProjectTracking.js.map