namespace ProjectTracking
{
  interface IDataValue
  {
    Label: string;
    Value: string;
  }
  export class DataValue implements IDataValue
  {
    constructor(public Label: string, public Value: string, public selected: boolean = false) { }

    //public static GetDepartments(): void
    //{
    //  ProjectTracking.departments = [];

    //  departments.push(new DataValue("MIS", "0107"));
    //  departments.push(new DataValue("Fire", "1703"));
    //  departments.push(new DataValue("PS Admin", "2103"));
    //  departments.push(new DataValue("Parks & Rec", "3201"));

    
    //}

    public static GetDepartments(): void
    {
      ProjectTracking.departments = [];
      let path = ProjectTracking.GetPath();
      Utilities.Get<Array<DataValue>>(path + "API/Project/Departments/All")
        .then(function (departments: Array<DataValue>)
        {
          console.log("all departments", departments);
          ProjectTracking.departments.push(new DataValue("All Departments", ""));
          ProjectTracking.departments.push(new DataValue("My Departments Only", "mine", true));          
          for (let d of departments)
          {
            ProjectTracking.departments.push(d);
          }

          DataValue.BuildDepartmentSelect("departmentFilter", ProjectTracking.departments);
          //Toggle_Loading_Search_Buttons(false);

        }, function (e)
          {
            console.log('error getting permits', e);
            //Toggle_Loading_Search_Buttons(false);
          });

    }

    public static GetMyDepartments(): void
    {
      ProjectTracking.my_departments = [];
      let path = ProjectTracking.GetPath();
      Utilities.Get<Array<DataValue>>(path + "API/Project/Departments/My")
        .then(function (departments: Array<DataValue>)
        {
          console.log("my departments", departments);
          ProjectTracking.my_departments = departments;
          DataValue.BuildDepartmentSelect("projectDepartment", departments);
          //Toggle_Loading_Search_Buttons(false);

        }, function (e)
          {
            console.log('error getting permits', e);
            //Toggle_Loading_Search_Buttons(false);
          });

    }

    static BuildDepartmentSelect(elementId: string, departments: Array<DataValue>): void
    {
      let departmentSelect = <HTMLSelectElement>document.getElementById(elementId);
      Utilities.Clear_Element(departmentSelect);
      for (let d of departments)
      {
        let o = document.createElement("option");
        o.value = d.Value;
        o.selected = d.selected;
        o.appendChild(document.createTextNode(d.Label));

        departmentSelect.add(o, null);
      }
    }

  }
}