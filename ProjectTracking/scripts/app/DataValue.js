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
            console.log('get departments');
            var departments = [];
            departments.push(new DataValue("Choose Department", "", true));
            departments.push(new DataValue("MIS", "0107"));
            departments.push(new DataValue("Fire", "1703"));
            departments.push(new DataValue("PS Admin", "2103"));
            DataValue.BuildDepartmentSelect("projectDepartment", departments);
        };
        DataValue.BuildDepartmentSelect = function (elementId, departments) {
            var departmentSelect = document.getElementById(elementId);
            Utilities.Clear_Element(departmentSelect);
            for (var _i = 0, departments_1 = departments; _i < departments_1.length; _i++) {
                var d = departments_1[_i];
                var o = document.createElement("option");
                o.label = d.label;
                o.value = d.value;
                o.selected = d.selected;
                departmentSelect.add(o);
            }
        };
        return DataValue;
    }());
    ProjectTracking.DataValue = DataValue;
})(ProjectTracking || (ProjectTracking = {}));
//# sourceMappingURL=DataValue.js.map