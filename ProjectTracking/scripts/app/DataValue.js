var ProjectTracking;
(function (ProjectTracking) {
    var DataValue = /** @class */ (function () {
        function DataValue(label, value, selected) {
            if (selected === void 0) { selected = false; }
            this.label = label;
            this.value = value;
            this.selected = selected;
        }
        DataValue.GetDepartments = function () {
            ProjectTracking.departments = [];
            ProjectTracking.departments.push(new DataValue("Choose Department", ""));
            ProjectTracking.departments.push(new DataValue("My Departments Only", "mine", true));
            ProjectTracking.departments.push(new DataValue("MIS", "0107"));
            ProjectTracking.departments.push(new DataValue("Fire", "1703"));
            ProjectTracking.departments.push(new DataValue("PS Admin", "2103"));
            ProjectTracking.departments.push(new DataValue("Parks & Rec", "3201"));
            DataValue.BuildDepartmentSelect("projectDepartment", ProjectTracking.departments);
            DataValue.BuildDepartmentSelect("departmentFilter", ProjectTracking.departments);
        };
        DataValue.BuildDepartmentSelect = function (elementId, departments) {
            var departmentSelect = document.getElementById(elementId);
            Utilities.Clear_Element(departmentSelect);
            for (var _i = 0, departments_1 = departments; _i < departments_1.length; _i++) {
                var d = departments_1[_i];
                var o = document.createElement("option");
                o.value = d.value;
                o.selected = d.selected;
                o.appendChild(document.createTextNode(d.label));
                departmentSelect.add(o, null);
            }
        };
        return DataValue;
    }());
    ProjectTracking.DataValue = DataValue;
})(ProjectTracking || (ProjectTracking = {}));
//# sourceMappingURL=DataValue.js.map