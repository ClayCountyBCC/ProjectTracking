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
      console.log('get departments');
      let departments: Array<DataValue> = [];
      departments.push(new DataValue("Choose Department", "", true));
      departments.push(new DataValue("MIS", "0107"));
      departments.push(new DataValue("Fire", "1703"));
      departments.push(new DataValue("PS Admin", "2103"));

      DataValue.BuildDepartmentSelect("projectDepartment", departments);
    }    

    static BuildDepartmentSelect(elementId: string, departments: Array<DataValue>): void
    {
      let departmentSelect = <HTMLSelectElement>document.getElementById(elementId);
      Utilities.Clear_Element(departmentSelect);
      for (let d of departments)
      {
        let o = document.createElement("option");
        o.label = d.label;
        o.value = d.value;
        o.selected = d.selected;
        departmentSelect.add(o);
      }
    }

  }
}