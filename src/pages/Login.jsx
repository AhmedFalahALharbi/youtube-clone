import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = () => {
    axios
      .get('https://66f1060c41537919154f2fc1.mockapi.io/users', {
        params: { username, password },
      })
      .then((response) => {
        if (response.data.length > 0) {
          // Store the username in localStorage
          localStorage.setItem('username', username);
          navigate('/');
        } else {
          setError('Invalid username or password');
        }
      })
      .catch(() => setError('An error occurred. Please try again.'));
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-neutral text-gray-200">
      {/* Card Container */}
      <div className="bg-secondary shadow-md rounded-lg p-10 w-full max-w-sm">
        <div className="flex flex-col items-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/368px-Google_2015_logo.svg.png"
            alt="Google Logo"
            className="w-32 mb-6"
          />
          <h2 className="text-2xl font-semibold mb-2 text-gray-100">Sign in</h2>
          <p className="text-sm text-gray-400 mb-8">
            Use your Google Account
          </p>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {/* Input Fields */}
        <input
          type="text"
          placeholder="Username"
          className="border border-gray-600 bg-neutral rounded-md p-3 mb-4 w-full text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-600 bg-neutral rounded-md p-3 mb-6 w-full text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md w-full mb-6"
        >
          Next
        </button>

        {/* Signup Link */}
        <p className="text-sm text-gray-400">
          Don`t have an account?{' '}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      
    </div>
  );
};

export default Login;
