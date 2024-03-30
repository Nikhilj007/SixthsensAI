import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const CreatePR = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requesterId, setRequesterId] = useState(JSON.parse(localStorage.getItem('userData'))._id);
  const [approvers, setApprovers] = useState([]);
  const [allUsers, setAllUsers] = useState([]); // [
  const [flow, setFlow] = useState('Parallel'); // [
  const prId = useLocation().pathname.split('/')[2];
  const navigate = useNavigate();

  useEffect(() => {
    if(prId){
        fetch('http://localhost:8080/pull-requests/'+prId)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            setTitle(data.title);
            setDescription(data.description);
        });
    }
    else {
        fetch('http://localhost:8080/getusers')
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            setAllUsers(data);
        });
    }
    }, []);
  
    const handleEdit = async (e) => {
    e.preventDefault();
    console.log({ title, description, requesterId })
    
    // Assuming you have a function to handle the form submission
    // (You can replace this with your actual fetch logic)
    const res = await fetch('http://localhost:8080/pull-requests/'+prId, {
        method: 'PATCH',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, requesterId, approvers }),
    })
    .catch((err) => console.error(err));

    const data = await res.json();

    // Handle the response as needed
    console.log(data);
    navigate('/home');
    }


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ title, description, requesterId, approvers })

    // Assuming you have a function to handle the form submission
    // (You can replace this with your actual fetch logic)
    const res = await fetch('http://localhost:8080/pull-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description, requesterId, approvers, flow }),
    })
    .catch((err) => console.error(err));

    const data = await res.json();

    // Handle the response as needed
    console.log(data);
    navigate('/home');
  };

  return (
    <div className="mx-auto max-w-md p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create Pull Request</h2>
      <div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600">Title:</label>
          <input
            className="w-full p-2 border rounded-md"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600">Description:</label>
          <textarea
            className="w-full p-2 border rounded-md"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {!prId &&<div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600">Approvers:</label>
          <select
            className="w-full p-2 border rounded-md"
            multiple={true} 
            value={approvers}
            onChange={(e) => setApprovers(Array.from(e.target.selectedOptions, (option) => option.value))}
            required
          >
            {/* Replace the options below with your actual list of approvers except if user._id matches userData._id */}
            {allUsers.map((user) => {console.log(user);
             if(user._id == JSON.parse(localStorage.getItem('userData'))._id) return;
             return (
               <option key={user._id} value={user._id}>{user.username}</option>
            )})}
          </select>
        </div>}

        {!prId && <><label>Flow of approval</label><select
            className="w-full p-2 border rounded-md"
            value={flow}
            onChange={(e) => setFlow(e.target.value)}
            required
          >
            <option value="Parallel">Parallel</option>
            <option value="Sequential">Sequential</option>
          </select></>}

        {prId?<button
            onClick={handleEdit}
          className="w-full py-2 rounded-md"
        >
          Edit Pull Request
        </button>:<button
            onClick={handleSubmit}
          className="w-full py-2 rounded-md"
        >
          Create Pull Request
        </button>}
      </div>
    </div>
  );
};

export default CreatePR;
