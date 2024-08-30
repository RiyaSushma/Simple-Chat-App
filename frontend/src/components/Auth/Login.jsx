import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { emailId, password });
      localStorage.setItem('token', response.data.token);
      navigate('/users');
    } catch (error) {
      setError('Login failed. Please check your credentials and try again.');
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen m-2">
      <div className='flex justify-center mb-5'>
        <h4 className="content-center text-2xl font-bold dark:text-white">Login</h4>
      </div>
      <div className="box-content justify-center p-8 border border-sky-500 shadow-md w-full max-w-md">
        <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter Email</label>
            <input 
              type="email" 
              id="email" 
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
              placeholder="name@flowbite.com" 
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              required 
            />
          </div>
          <div className="mb-5">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
            <input 
              id="password" 
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded" disabled={loading}>
            {loading ? 'Logging in...' : 'Submit'}
          </button>
        </form>
      </div>
      <Link to='/' className='text-blue-600 m-5'>Register</Link>
    </div>
  );
}

export default Login;
