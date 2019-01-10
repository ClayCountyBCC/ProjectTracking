namespace ProjectTracking
{
  "use strict";

  interface IProject
  {
    id: number;
    project_name: string;
    department: string;
    timeline: string;
    commissioner_share: boolean;
    completed: boolean;
    date_last_updated: any;
    date_completed: any;
    can_edit: boolean;
  }

  export class Project implements IProject
  {
    public id: number = -1;
    public project_name: string = "";
    public department: string = "";
    public timeline: string = "";
    public commissioner_share: boolean = false;
    public completed: boolean = false;
    public date_last_updated: any = new Date();
    public date_completed: any = new Date();
    public can_edit: boolean = false;

    constructor()
    {

    }


  }

}