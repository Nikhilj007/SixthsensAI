import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [year, setYear] = useState('');
    const navigate = useNavigate();
    const [login, setLogin] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(login){
          if(!email || !password) return console.log('Please fill all the fields');
        const res = await fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
        .catch((err) => {console.error(err);return});
        const data = await res.json();
        if (data.error) {
            console.log(data.error);
        }
          localStorage.setItem('userData', JSON.stringify(data));
            navigate('/home');
        console.log(data);
        }

        else{
          if(!email || !password || !username || !year) return console.log('Please fill all the fields');
        const res = await fetch('http://localhost:8080/signup', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password, year }),
        })
        .catch((err) => {console.error(err);return});
        const data = await res.json();
        if (data.error) {
            console.log(data.error);
            return;
        }
        localStorage.setItem('userData', JSON.stringify(data));
            navigate('/home');
        console.log(data);
        }
    }


  return (
    <div className='flex flex-col items-center justify-center min-h-screen ]'>
      <div className=' p-8 rounded shadow-md'>
        <div className='flex space-x-4'>
          <button onClick={() => setLogin(true)} className={`py-2 px-4 rounded ${login?'bg-green-500':''}  text-white`}>
            Login
          </button>
          <button onClick={() => setLogin(false)} className={`py-2 px-4 rounded ${!login?'bg-green-500':''} text-white`}>
            Signup
          </button>
        </div>
        {login ? <form className='flex flex-col space-y-4'>
          <input
            className='border rounded p-2'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder='Write your email'
            required 
          />
          <input
            className='border rounded p-2'
            value={password}
            autoComplete='current-password'
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder='Write your password'
            required
          />
          <button onClick={handleSubmit} className=' py-2 rounded '>
            Submit
          </button>
        </form> : 
          <form className='flex flex-col space-y-4'>
            <input
              className='border rounded p-2'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder='Write your username'
              required 
            />
            <input
              className='border rounded p-2'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder='Write your email'
              required 
            />
            <input
              className='border rounded p-2'
              value={password}
              autoComplete='current-password'
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder='Write your password'
              required
            />
            <input
              className='border rounded p-2'
              value={year}
              onChange={(e) => setYear(e.target.value)}
              type="text"
              placeholder='Write your year'
              required 
            />
            <button onClick={handleSubmit} className=' py-2 rounded '>
              Submit
            </button>
          </form>
          }
      </div>

    </div>
  );
};

export default Login;
