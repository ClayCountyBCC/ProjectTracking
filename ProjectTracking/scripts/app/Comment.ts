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


    public static UpdateOnly()
    {
      let buttonId = "updateProjectAsUpToDate";
      Utilities.Toggle_Loading_Button(buttonId, true);
      console.log('current project', ProjectTracking.selected_project);
      if (ProjectTracking.selected_project.id === -1)
      {

        return;
      }
      let path = ProjectTracking.GetPath();
      Utilities.Post_Empty(path + "API/Project/AddUpdateComment?project_id="+ProjectTracking.selected_project.id.toString(), null)
        .then(function (r: Response)
        {
          console.log('post response', r);
          if (!r.ok)
          {
            // do some error stuff
            console.log('some errors happened with post response');
            alert("There was an issue saving this update.  Please try again, and put in a help desk ticket if the issue persists.");
          }
          else
          {
            // we good
            //console.log('post response good');
            ProjectTracking.Project.GetProjects();
            ProjectTracking.CloseModals();
          }
          Utilities.Toggle_Loading_Button(buttonId, false);
        }, function (e)
          {
            console.log('error getting permits', e);
            //Toggle_Loading_Search_Buttons(false);
            Utilities.Toggle_Loading_Button(buttonId, false);
          });
      
    }

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
        let span = document.createElement("span");
        span.appendChild(document.createTextNode(comment));
        if (c.by_county_manager)
        {
          span.style.color = "red";
          span.style.fontWeight = "bold";
        }
        li.appendChild(span);
        if (full)
        {
          let deletebutton = document.createElement("button");
          deletebutton.classList.add("delete");
          li.appendChild(deletebutton);
          let deletecontainer = document.createElement("div");
          deletecontainer.style.display = "none";
          deletecontainer.classList.add("notification");
          deletecontainer.classList.add("is-danger");
          li.appendChild(deletecontainer);
          let questioncontainer = document.createElement("span");
          questioncontainer.appendChild(document.createTextNode("Are you sure you want to delete this comment?"));
          deletecontainer.appendChild(questioncontainer);
          let yespleasedeletebutton = document.createElement("button");
          yespleasedeletebutton.appendChild(document.createTextNode("Delete"));
          yespleasedeletebutton.classList.add("button");
          yespleasedeletebutton.style.marginRight = "1em";
          yespleasedeletebutton.style.marginLeft = "1em";
          yespleasedeletebutton.onclick = function ()
          {
            // do actual delete stuff here
            Utilities.Toggle_Loading_Button(yespleasedeletebutton, true);
            Utilities.Toggle_Loading_Button(cancelbutton, true);

            let path = ProjectTracking.GetPath();
            Utilities.Post_Empty(path + "API/Project/DeleteComment?comment_id=" + c.id.toString(), null)
              .then(function (r: Response)
              {
                console.log('post response', r);
                if (!r.ok)
                {
                  // do some error stuff
                  console.log('some errors happened with post response');
                  alert("There was an issue deleting this comment.  Please try again, and put in a help desk ticket if the issue persists.");
                }
                Utilities.Toggle_Loading_Button(yespleasedeletebutton, false);
                Utilities.Toggle_Loading_Button(cancelbutton, false);
                deletecontainer.style.display = "none";
                li.style.display = "none";
              }, function (e)
                {
                  console.log('error getting delete comment', e);
                  Utilities.Toggle_Loading_Button(yespleasedeletebutton, false);
                  Utilities.Toggle_Loading_Button(cancelbutton, false);
                });


          }
          deletecontainer.appendChild(yespleasedeletebutton);
          let cancelbutton = document.createElement("button");
          cancelbutton.classList.add("button");
          cancelbutton.appendChild(document.createTextNode("Cancel"));
          cancelbutton.onclick = function ()
          {
            deletecontainer.style.display = "none";
          }
          deletecontainer.appendChild(cancelbutton);
          deletebutton.onclick = function ()
          {
            // show the delete container
            deletecontainer.style.display = "block";
          }
        }


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