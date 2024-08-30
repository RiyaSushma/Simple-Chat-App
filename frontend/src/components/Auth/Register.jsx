import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(role);
      await axios.post('http://localhost:5000/api/auth/register', { username, emailId, password, role });
      navigate('/login');
    } catch (error) {
      setError('Registration failed. Please check your credentials and try again.');
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-md p-6 border border-gray-300 rounded-lg shadow-md">
      <div className="mb-4">
        <h4 className="text-xl font-bold dark:text-white">Register</h4>
      </div>
      <form className="w-full" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-2 w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={emailId}
          onChange={(e) => setEmailId(e.target.value)}
          className="mb-2 w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full p-2 border border-gray-300 rounded"
        />
        <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select role</label>
        <select value={role} onChange={(e) => {setRole(e.target.value)}} id="role" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4">
          <option value="">Choose role</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="institute">Institute</option>
        </select>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}

export default Register;
