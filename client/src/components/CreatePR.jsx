import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const CreatePR = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requesterId, setRequesterId] = useState(JSON.parse(localStorage.getItem('userData'))._id);
  const [approvers, setApprovers] = useState([]);
  const prId = useLocation().pathname.split('/')[2];
  const navigate = useNavigate();

  useEffect(() => {
    if(prId){
        fetch('https://sixthsens-ai.onrender.com/pull-requests/'+prId)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            setTitle(data.title);
            setDescription(data.description);
        });
    }
    }, []);
  
    const handleEdit = async (e) => {
    e.preventDefault();
    console.log({ title, description, requesterId })
    
    // Assuming you have a function to handle the form submission
    // (You can replace this with your actual fetch logic)
    const res = await fetch('https://sixthsens-ai.onrender.com/pull-requests/'+prId, {
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
    const res = await fetch('https://sixthsens-ai.onrender.com/pull-requests', {
      method: 'POST',
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
            {/* Replace the options below with your actual list of approvers */}
            <option value="approver1">Approver 1</option>
            <option value="approver2">Approver 2</option>
          </select>
        </div>}

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
