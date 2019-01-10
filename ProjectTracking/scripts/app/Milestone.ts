namespace ProjectTracking
{
  "use strict";

  interface IMilestone
  {
    id: number;
    project_id: number;
    name: string;
    display_order: number;
  }

  export class Milestone implements IMilestone
  {
    public id: number = -1;
    public project_id: number = -1;
    public name: string = "";
    public display_order: number = -1;

    constructor() { }

  }
}