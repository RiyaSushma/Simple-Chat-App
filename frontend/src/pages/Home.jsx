import React from 'react';
import Register from '../components/Auth/Register';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-100">
      <div className="mb-6 flex justify-center">
        <h4 className="text-2xl font-bold dark:text-white">Welcome to Chat App</h4>
      </div>
      <Register />
      <Link to="/login" className='text-blue-600 m-2'>Login</Link>
    </div>
  );
}

export default Home;
