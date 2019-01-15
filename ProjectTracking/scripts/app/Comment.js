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