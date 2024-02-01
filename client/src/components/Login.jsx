import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (data.error) {
            console.log(data.error);
        }
          localStorage.setItem('userData', JSON.stringify(data));
            navigate('/home');
        console.log(data);
        }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen ]'>
      <div className=' p-8 rounded shadow-md'>
        <h2 className='text-2xl mb-4 font-bold'>Login Page</h2>
        <form className='flex flex-col space-y-4'>
          <input
            className='border rounded p-2'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder='Write your email'
          />
          <input
            className='border rounded p-2'
            value={password}
            autoComplete='current-password'
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder='Write your password'
          />
          <button onClick={handleSubmit} className=' py-2 rounded '>
            Submit
          </button>
        </form>
      </div>

      <div className='mt-4'>
        <div className='text-lg'>
          Requester Login credentials are:
        </div>
        <div className='text-sm'>
          Email: requester1@gmail.com <br />
          Password: Iamrequester1
        </div>
      </div>

      <div className='mt-4'>
        <div className='text-lg'>
          Approver Login credentials are:
        </div>
        <div className='text-sm' >
          Email: approver1@gmail.com <br />
          Password: Iamapprover1
        </div>
      </div>

      <div className='mt-4'>
        <div className='text-lg'>
          Reviewer Login credentials are:
        </div>
        <div className='text-sm'>
          Email: reviewer1@gmail.com <br />
          Password: Iamreviewer1
        </div>
      </div>
    </div>
  );
};

export default Login;
