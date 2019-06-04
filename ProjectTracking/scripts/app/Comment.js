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