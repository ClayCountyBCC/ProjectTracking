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