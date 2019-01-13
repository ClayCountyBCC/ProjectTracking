namespace ProjectTracking
{
  interface IDataValue
  {
    label: string;
    value: string;
  }
  export class DataValue implements IDataValue
  {
    constructor(public label: string, public value: string, public selected: boolean = false) { }

    public static GetDepartments():void
    {
      ProjectTracking.departments = [];
      departments.push(new DataValue("Choose Department", ""));
      departments.push(new DataValue("My Departments Only", "mine", true));
      departments.push(new DataValue("MIS", "0107"));
      departments.push(new DataValue("Fire", "1703"));
      departments.push(new DataValue("PS Admin", "2103"));
      departments.push(new DataValue("Parks & Rec", "3201"));

      DataValue.BuildDepartmentSelect("projectDepartment", departments);
      DataValue.BuildDepartmentSelect("departmentFilter", departments);
    }    

    static BuildDepartmentSelect(elementId: string, departments: Array<DataValue>): void
    {
      let departmentSelect = <HTMLSelectElement>document.getElementById(elementId);
      Utilities.Clear_Element(departmentSelect);
      for (let d of departments)
      {
        let o = document.createElement("option");                
        o.value = d.value;
        o.selected = d.selected;
        o.appendChild(document.createTextNode(d.label));
        
        departmentSelect.add(o, null);
      }
    }

  }
}