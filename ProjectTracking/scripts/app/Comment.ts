namespace ProjectTracking
{
  "use strict";

  interface IComment
  {
    id: number;
    project_id: number;
    comment: string;
    update_only: boolean;
    added_by: string;
    added_on: any; // Date
    by_county_manager: boolean;
  }

  export class Comment implements IComment
  {
    public id: number = -1;
    public project_id: number = -1;
    public comment: string = "";
    public update_only: boolean = false;
    public added_by: string = "";
    public added_on: any = new Date(); // Date
    public by_county_manager: boolean = false;

    constructor() { }

  }

}