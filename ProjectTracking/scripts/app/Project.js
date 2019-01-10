var ProjectTracking;
(function (ProjectTracking) {
    "use strict";
    var Project = /** @class */ (function () {
        function Project() {
            this.id = -1;
            this.project_name = "";
            this.department = "";
            this.timeline = "";
            this.commissioner_share = false;
            this.completed = false;
            this.date_last_updated = new Date();
            this.date_completed = new Date();
            this.can_edit = false;
            this.milestones = [];
            this.comments = [];
        }
        return Project;
    }());
    ProjectTracking.Project = Project;
})(ProjectTracking || (ProjectTracking = {}));
//# sourceMappingURL=Project.js.map