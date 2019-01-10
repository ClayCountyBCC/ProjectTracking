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
        return Comment;
    }());
    ProjectTracking.Comment = Comment;
})(ProjectTracking || (ProjectTracking = {}));
//# sourceMappingURL=Comment.js.map