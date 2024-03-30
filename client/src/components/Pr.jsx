import { useState } from "react";
import { Link } from "react-router-dom";

function Pr({ pr = {}, handleApprove, timeAgo, getallprs, deleteRequest }) {
  const [showComments, setShowComments] = useState(false);
  const [writeComment, setWriteComment] = useState(false); // [
  const [comment, setComment] = useState(""); // [
  const userData = JSON.parse(localStorage.getItem("userData"));
  const approversStatus = []
  let actionTaken; 
   pr.approvers.map((approver,key) => {
    if(approver==null) return console.log('Approver is null');
    approver.map(a => {
      if(a.action === "Approved") {
        approversStatus.push([1,key]);
      }
      else if(a.action === "Rejected") {
        approversStatus.push([2,key]);
      }
      else {
        approversStatus.push([0,key]);
      }
      if(a.userId === userData._id && a.action !== "Pending") {
        actionTaken = true;
      }
    })
});


  const addComment = async (id) => {
    setWriteComment(false);
    const response = await fetch(
      "http://localhost:8080/pull-requests/comments",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pullRequestId: id,
          comment: comment,
          username: userData.username,
        }),
      }
    ).catch((error) => console.error("Error during fetch:", error));
    console.log("after fetch");
    if (!response.ok) {
      throw new Error("Failed to add comment");
    }

    const data = await response.json();
    setShowComments(true);
    getallprs();
    console.log(data);
  };

  return (
    <div
      key={pr._id}
      className="border relative border-gray-400 rounded-lg p-4 m-4 w-1/2"
    >
      <span className="text-xl font-bold">{pr.title}</span>
      {pr.requesterId === userData._id ? (<><button
        className="bg-red-500 py-1 ml-2 absolute top-1 right-1 cursor-pointer"
        onClick={() => deleteRequest(pr._id)}
      >
        Delete
      </button>
      <Link
        className="bg-green-500 py-1 rounded-md px-3 ml-2 absolute top-10 right-1 cursor-pointer"
        to={"/edit/" + pr._id}
      >
        Edit
      </Link></>) : null}
      <p className="text-gray-400">{pr.description}</p>
      <div className="flex justify-between py-1">
        <span className="text-gray-400">
          Status:
          {pr.status === "Open" ? (
            <span className="text-orange-400 ml-2">Open</span>
          ) : pr.status == "Rejected" ? (
            <span className="text-red-600 ml-2">Rejected</span>
          ) : (
            <span className="text-green-500 ml-2">Approved</span>
          )}
        </span>
        <span className="text-gray-400 ml-2 text-right">
          {timeAgo(pr.createdAt)} ago
        </span>
      </div>
      <button
        onClick={() =>
          showComments ? setShowComments(false) : setShowComments(true)
        }
      >
        {" "}
        {showComments ? "Hide Comments" : "Show Comments"}
      </button>
      <button
        onClick={() => setWriteComment(!writeComment)}
        className="bg-green-500 py-1 rounded-md px-3 ml-2 absolute bottom-6 right-2 cursor-pointer"
      >
        {writeComment ? "Close" : "Write Comment"}
      </button>
        <div className="flex gap-2 items-end py-3 pl-4">
            {approversStatus.map((status ,key) => {
                if(status[0] === 0) {
                    return <div key={key} className={`rounded-sm bg-yellow-500 ${status[1]==0?'w-2 h-2':status[1]==1?'w-4 h-4':'w-6 h-6'}`}></div>
                }
                else if(status[0] === 1) {
                    return <div key={key} className={`rounded-sm bg-green-500  ${status[1]==0?'w-2 h-2':status[1]==1?'w-4 h-4':'w-6 h-6'}`}></div>
                }
                else {
                    return <div key={key} className={`rounded-sm bg-red-600 ${status[1]==0?'w-2 h-2':status[1]==1?'w-4 h-4':'w-6 h-6'}`}></div>
                }
            })
        }
        </div>

      <div>
        {writeComment && (
          <div className="flex flex-col items-center">
            <textarea
              className="border rounded p-2"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              type="text"
              placeholder="Write your comment"
            />
            <button
              onClick={() => addComment(pr._id)}
              className=" py-2 rounded "
            >
              Submit
            </button>
          </div>
        )}
        {/* check if prs array contains the pr id and if the status is open then show the approve and reject button */}
        {(pr.flow!='Parallel'?pr.status == "Open":true) && userData.prs.includes(pr._id) && !actionTaken && (pr.flow!='Parallel'?pr.index==userData.year-1:true)
        && (
          <>
            <button
              onClick={() => {
                handleApprove(pr._id, "Approved");
              }}
              className="bg-green-500 py-1 rounded-md px-3 ml-2 mt-2  bottom-8 right-2 cursor-pointer"
            >
              Approve
            </button>
            <button
              onClick={() => {
                handleApprove(pr._id, "Rejected");
              }}
              className="bg-red-500 py-1 rounded-md px-3 ml-2 mt-2  bottom-0 right-2 cursor-pointer"
            >
              Reject
            </button>
          </>
        )}
        {
            (pr.flow!='Parallel' && pr.status == "Open" && pr.index<userData.year-1 && !actionTaken) && (
                <div>Action Pending from Juniors</div>)
        }
        {showComments
          ? pr.comments.map((c) => (
              <div
                key={c._id}
                className="border-[1px] mt-1 rounded-sm border-gray-400 p-2 bg-slate-900"
              >
                <div className="flex justify-between p-2">
                  <p>{c.username}</p>
                  <p className="text-sm text-gray-400">
                    {timeAgo(c.createdAt)} ago
                  </p>
                </div>
                <p className="bg-black px-3 py-1 rounded-lg">{c.comment}</p>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}

export default Pr;
