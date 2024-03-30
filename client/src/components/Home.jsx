import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pr from "./Pr";

const Home = () => {
  const [allPRs, setAllPRs] = useState([]);
  const [userPRs, setUserPRs] = useState([]); // [
  const [allComments, setAllComments] = useState([]);
  const userData = JSON.parse(localStorage.getItem('userData'));
  const [showALlprs, setShowAllPRs] = useState(true); // [
    const [comment, setComment] = useState(""); 

  const handleApprove = (id,status) => {
    if(status === "") return console.log('Please select a status'
    );
    
    fetch("http://localhost:8080/approvals/", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        pullRequestId: id,
        action: status,
        userId: userData._id,
        }),
    })
        .then((res) => res.json())
        .then((data) => {
        getallprs();
        console.log(data);
        });
    };




  const deleteRequest = (id) => {
    fetch("http://localhost:8080/pull-requests/" + id, {
        method: "DELETE",
        })
        .then((res) => res.json())
        .then((data) => {
        getallprs();
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
    console.log(id)
    if(allComments.length > 0){
        setAllComments([])
        return;
    }
    const comments = allPRs.map((pr) => {
        if(pr._id === id){
            return pr.comments;
        }
    });
    setAllComments(...allComments, comments);
  }

  function getallprs(){
    fetch("http://localhost:8080/pull-requests")
      .then((res) => res.json())
      .then((data) => {
        setAllPRs(data);
        console.log(data);
      });
    fetch('http://localhost:8080/pull-requests?requesterId='+userData._id)
        .then((res) => res.json())
        .then((data) => {
            setUserPRs(data);
            console.log(data);
        });
  }

  useEffect(() => {
    getallprs();
  }, []);

  return (
    <div className="pb-10 sm:mt-0 mt-12">
      <button
        className="sm:fixed absolute sm:top-2 top-[4.5rem] right-2 px-3 py-2 rounded-md"
        onClick={()=>setShowAllPRs(!showALlprs)}
      >{showALlprs?"See your Pull Requests":"See all Pull Requests"}</button>
      {showALlprs?(<><h1 className="text-2xl font-bold  text-center">All Pull Requests</h1>
      {allPRs.length === 0 && <div
        className="text-center "
      >Please wait</div>}
      <div className="flex flex-col items-center">
        {allPRs.map((pr) => <Pr key={pr._id} pr={pr} timeAgo={timeAgo} getallprs={getallprs} deleteRequest={deleteRequest}   handleApprove={handleApprove} allComments={allComments} />)}
      </div></>):(<>
        <h1  className="text-2xl font-bold text-center border-t-2 border-gray-500">Your pull requests</h1>
        <div className="flex flex-col items-center">
            {userPRs.map((pr) => (
                <Pr key={pr._id} pr={pr} timeAgo={timeAgo} getallprs={getallprs} deleteRequest={deleteRequest}  allComments={allComments} getComments={getComments} />
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
