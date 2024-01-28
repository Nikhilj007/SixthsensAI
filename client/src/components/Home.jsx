import React, { useEffect, useState } from "react";

const Home = () => {
  const [allPRs, setAllPRs] = useState([]);
  const [allComments, setAllComments] = useState([]);

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
    fetch("http://localhost:8080/reviews?pullRequestId="+id)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setAllComments(data);
      });
  }

  useEffect(() => {
    fetch("http://localhost:8080/pull-requests")
      .then((res) => res.json())
      .then((data) => {
        setAllPRs(data);
        console.log(data);
      });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-center">All Pull Requests</h1>
      <div className="flex flex-col items-center">
        {allPRs.map((pr) => (
          <div
            key={pr._id}
            className="border border-gray-400 rounded-lg p-4 m-4 w-1/2"
          >
            <h2 className="text-xl font-bold">{pr.title}</h2>
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
            <div>
              {allComments.map((comment) => (
                <div key={comment._id}>
                  <p>{timeAgo(comment.createdAt)}</p> 
                  <p>{comment.comments}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
