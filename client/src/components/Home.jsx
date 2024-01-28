import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [allPRs, setAllPRs] = useState([]);
  const [userPRs, setUserPRs] = useState([]); // [
  const [allComments, setAllComments] = useState([]);
  const userData = JSON.parse(localStorage.getItem('userData'));
  const [showALlprs, setShowAllPRs] = useState(true); // [
  console.log(localStorage.getItem('userData'));
  const [writeComment, setWriteComment] = useState(false); // [
    const [comment, setComment] = useState(""); 
    const [status, setStatus] = useState(""); // [

  const handleApprove = (id) => {
    fetch("https://sixthsens-ai.onrender.com/approvals/", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        pullRequestId: id,
        status: status,
        approverId: userData._id,
        }),
    })
        .then((res) => res.json())
        .then((data) => {
        console.log(data);
        });
    };
    

  const addComment = (id) => {
    fetch("https://sixthsens-ai.onrender.com/reviews", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        pullRequestId: id,
        comments: comment,
        reviewerId: userData._id,
        }),
    })
        .then((res) => res.json())
        .then((data) => {
        console.log(data);
        });
    };

  const deleteRequest = (id) => {
    fetch("https://sixthsens-ai.onrender.com/pull-requests/" + id, {
        method: "DELETE",
        })
        .then((res) => res.json())
        .then((data) => {
        console.log(data);
        });
    };

  const timeAgo = (val) => {
    const date = new Date(val);
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) {
      return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  };

  const getComments = (id) => {
    if(allComments.length > 0){
        setAllComments([])
        return;
    }
    fetch("https://sixthsens-ai.onrender.com/reviews?pullRequestId="+id)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setAllComments(data);
      });
  }

  useEffect(() => {
    fetch("https://sixthsens-ai.onrender.com/pull-requests")
      .then((res) => res.json())
      .then((data) => {
        setAllPRs(data);
        console.log(data);
      });
    fetch('https://sixthsens-ai.onrender.com/pull-requests?requesterId='+userData._id)
        .then((res) => res.json())
        .then((data) => {
            setUserPRs(data);
            console.log(data);
        });
  }, []);

  return (
    <div className="pb-10">
      <button
        className="fixed top-2 right-2 px-3 py-2 rounded-md"
        onClick={()=>setShowAllPRs(!showALlprs)}
      >{showALlprs?"See your Pull Requests":"See all Pull Requests"}</button>
      {showALlprs?(<><h1 className="text-2xl font-bold  text-center">All Pull Requests</h1>
      {allPRs.length === 0 && <div
        className="text-center "
      >Please wait, sometime it takes 10 seconds</div>}
      <div className="flex flex-col items-center">
        {allPRs.map((pr) => (
          <div
            key={pr._id}
            className="border relative border-gray-400 rounded-lg p-4 m-4 w-1/2"
          >
            <span className="text-xl font-bold">{pr.title}</span>
            <p className="text-gray-400">{pr.description}</p>
            <div className="flex justify-between py-1">
              <span className="text-gray-400">
                Status:
                {pr.status === "Open" ? (
                  <span className="text-green-500 ml-2">Open</span>
                ) : (
                  <span className="text-red-500 ml-2">Closed</span>
                )}
              </span>
              <span className="text-gray-400 ml-2 text-right">
                {timeAgo(pr.createdAt)} ago
              </span>
            </div>
            <button onClick={()=>getComments(pr._id)}>
                see comments
            </button>
            {userData.roles.includes('Reviewer') && <button
                    onClick={()=>setWriteComment(!writeComment)}
              className="bg-green-500 py-1 rounded-md px-3 ml-2 absolute bottom-6 right-2 cursor-pointer">
                Add Comment
              </button>
            }
            <div>
            {writeComment && <div className="flex flex-col items-center">
                <textarea
                    className="border rounded p-2"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    type="text"
                    placeholder='Write your comment'
                />
                <button onClick={()=>addComment(pr._id)} className=' py-2 rounded '>
                    Submit
                </button>
            </div>}
            {!userData.roles.includes('Approver') && <><button
                onClick={()=>{setStatus('Approved');handleApprove(pr._id)}}
                className="bg-green-500 py-1 rounded-md px-3 ml-2 absolute bottom-8 right-2 cursor-pointer">
                    Approve
                </button>
                <button 
                onClick={()=>{setStatus('Rejected');handleApprove(pr._id)}}
                className="bg-red-500 py-1 rounded-md px-3 ml-2 absolute bottom-0 right-2 cursor-pointer"
                >
                    Reject
                </button></>
            }
              {allComments.map((comment) => (
                <div key={comment._id} className="border-[1px] mt-1 rounded-sm border-gray-400 p-2 bg-slate-900">
                  <p className="text-sm text-gray-400">{timeAgo(comment.createdAt)} ago</p> 
                  <p>{comment.comments}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div></>):(<>
        <h1  className="text-2xl font-bold text-center border-t-2 border-gray-500">Your pull requests</h1>
        <div className="flex flex-col items-center">
            {userPRs.map((pr) => (
            <div
                key={pr._id}
                className="border relative border-gray-400 rounded-lg p-4 m-4 w-1/2"
            >
                <h2 className="text-xl font-bold">{pr.title}</h2>
                <button
                className="bg-red-500 py-1 ml-2 absolute top-1 right-1 cursor-pointer"
                onClick={() => deleteRequest(pr._id)}
            >Delete</button>
                <Link 
                className="bg-green-500 py-1 rounded-md px-3 ml-2 absolute top-10 right-1 cursor-pointer"
                to={'/edit/'+pr._id}
                >Edit</Link>
                <p className="text-gray-400">{pr.description}</p>
                <div className="flex justify-between py-1">
                <span className="text-gray-400">
                    Status:
                    {pr.status === "Open" ? (
                    <span className="text-green-500 ml-2">Open</span>
                    ) : (
                    <span className="text-red-500 ml-2">Closed</span>
                    )}
                </span>
                <span className="text-gray-400 ml-2 text-right">
                    {timeAgo(pr.createdAt)} ago
                </span>
                </div>
                <button onClick={()=>getComments(pr._id)}>
                    see comments
                </button>
                {userData.roles.includes('Reviewer') && <button
                 onClick={()=>setWriteComment(!writeComment)}
              className="bg-green-500 py-1 rounded-md px-3 ml-2 absolute bottom-6 right-2 cursor-pointer">
                Add Comment
              </button>
            }
            <div>
            {writeComment && <div className="flex flex-col items-center">
                <textarea
                    className="border rounded p-2"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    type="text"
                    placeholder='Write your comment'
                />
                <button onClick={()=>addComment(pr._id)} className=' py-2 rounded '>
                    Submit
                </button>
            </div>}
            {userData.roles.includes('Approver') && <button
                className="bg-green-500 py-1 rounded-md px-3 ml-2 absolute bottom-6 right-2 cursor-pointer">
                    Approve
                </button>
            }
                {allComments.map((comment) => (
                    <div key={comment._id} className="border-[1px] mt-1 rounded-sm border-gray-400 p-2 bg-slate-900">
                    <p className="text-sm text-gray-400">{timeAgo(comment.createdAt)} ago</p> 
                    <p>{comment.comments}</p>
                    </div>
                ))}
                </div>
            </div>
            ))}
      </div></>)}
      
      <Link
        className="fixed bottom-2 right-2 px-3 py-2 rounded-md"
       to={'/create'}>
        Create a new pull request
      </Link>
    </div>
  );
};

export default Home;
