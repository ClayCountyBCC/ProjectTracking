var ProjectTracking;
(function (ProjectTracking) {
    var DataValue = /** @class */ (function () {
        function DataValue(Label, Value, selected) {
            if (selected === void 0) { selected = false; }
            this.Label = Label;
            this.Value = Value;
            this.selected = selected;
        }
        //public static GetDepartments(): void
        //{
        //  ProjectTracking.departments = [];
        //  departments.push(new DataValue("MIS", "0107"));
        //  departments.push(new DataValue("Fire", "1703"));
        //  departments.push(new DataValue("PS Admin", "2103"));
        //  departments.push(new DataValue("Parks & Rec", "3201"));
        //}
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
                DataValue.BuildDepartmentSelect("departmentFilter", ProjectTracking.departments);
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
                DataValue.BuildDepartmentSelect("projectDepartment", departments);
                //Toggle_Loading_Search_Buttons(false);
            }, function (e) {
                console.log('error getting permits', e);
                //Toggle_Loading_Search_Buttons(false);
            });
        };
        DataValue.BuildDepartmentSelect = function (elementId, departments) {
            var departmentSelect = document.getElementById(elementId);
            Utilities.Clear_Element(departmentSelect);
            for (var _i = 0, departments_2 = departments; _i < departments_2.length; _i++) {
                var d = departments_2[_i];
                var o = document.createElement("option");
                o.value = d.Value;
                o.selected = d.selected;
                o.appendChild(document.createTextNode(d.Label));
                departmentSelect.add(o, null);
            }
        };
        return DataValue;
    }());
    ProjectTracking.DataValue = DataValue;
})(ProjectTracking || (ProjectTracking = {}));
//# sourceMappingURL=DataValue.js.map