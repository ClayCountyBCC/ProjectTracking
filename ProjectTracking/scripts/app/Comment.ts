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


    public static CommentsView(comments: Array<Comment>, full: boolean): DocumentFragment
    {
      //comments = comments.filter(function (j) { return j.comment.length > 0; });
      comments.sort(function (a, b) { return a.id - b.id; });

      let df = document.createDocumentFragment();
      if (comments.length === 0) return df;
      let ol = document.createElement("ol");
      ol.style.marginLeft = "1em";
      for (let c of comments)
      {
        let li = document.createElement("li");
        let comment = full ? c.added_by + ' - ' + c.comment : c.comment;
        li.appendChild(document.createTextNode(comment));
        ol.appendChild(li);
      }
      df.appendChild(ol);
      return df;
    }

    public static PopulateCommentsFieldset(comments: Array<Comment>): void
    {
      let container = document.getElementById("existingCommentsContainer");
      let legend = document.createElement("legend");
      legend.classList.add("label");
      legend.appendChild(document.createTextNode("Comments"));
      container.appendChild(legend);
      container.appendChild(Comment.CommentsView(comments, true));
    }


  }

}