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

          DataValue.BuildDataValueSelect("departmentFilter", ProjectTracking.departments);
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
          DataValue.BuildDataValueSelect("projectDepartment", departments);
          //Toggle_Loading_Search_Buttons(false);

        }, function (e)
          {
            console.log('error getting permits', e);
            //Toggle_Loading_Search_Buttons(false);
          });

    }

    static BuildDataValueSelect(elementId: string, departments: Array<DataValue>): void
    {
      let select = <HTMLSelectElement>document.getElementById(elementId);
      Utilities.Clear_Element(select);
      for (let d of departments)
      {
        let o = document.createElement("option");
        o.value = d.Value;
        o.selected = d.selected;
        o.appendChild(document.createTextNode(d.Label));
        select.add(o, null);
      }
    }


    public static GetFunding(): void
    {
      ProjectTracking.funding_sources = [];
      let path = ProjectTracking.GetPath();
      Utilities.Get<Array<DataValue>>(path + "API/Project/Funding")
        .then(function (funding: Array<DataValue>)
        {
          console.log("all funding", funding);
          //ProjectTracking.funding_sources.push(new DataValue("Select Funding", "0", true));          
          for (let d of funding)
          {
            ProjectTracking.funding_sources.push(d);
          }

          DataValue.BuildDataValueSelect("projectFunding", ProjectTracking.funding_sources);
          //Toggle_Loading_Search_Buttons(false);

        }, function (e)
          {
            console.log('error getting funding', e);
            //Toggle_Loading_Search_Buttons(false);
          });

    }

  }
}