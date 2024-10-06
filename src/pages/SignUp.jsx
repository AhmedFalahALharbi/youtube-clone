import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSignUp = () => {
    if (!username || !password) {
      setError('Username and password are required');
      return;
    }

    setError('');
    setSuccess('');

    axios
      .get('https://66f1060c41537919154f2fc1.mockapi.io/users')
      .then((response) => {
        const existingUser = response.data.find((u) => u.username === username);
        if (existingUser) {
          setError('Username already exists. Please choose another.');
        } else {
          axios
            .post('https://66f1060c41537919154f2fc1.mockapi.io/users', {
              username,
              password,
            })
            .then((response) => {
              console.log('User signed up successfully:', response.data);
              setSuccess('Sign-up successful! Redirecting to login...');
              setTimeout(() => navigate('/login'), 2000);
            })
            .catch((err) => {
              console.error('Error during sign-up:', err);
              setError('An error occurred during sign-up. Please try again.');
            });
        }
      })
      .catch((err) => {
        console.error('Error checking username existence:', err);
        setError('An error occurred. Please try again.');
      });
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-neutral text-gray-200">
      <div className="bg-secondary shadow-md rounded-lg p-10 w-full max-w-sm">
        <div className="flex flex-col items-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/368px-Google_2015_logo.svg.png"
            alt="Google Logo"
            className="w-32 mb-6"
          />
          <h2 className="text-2xl font-semibold mb-2 text-gray-100">Create your Google Account</h2>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-400 text-sm mb-4">{success}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-600 bg-neutral rounded-md p-3 mb-4 w-full text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-600 bg-neutral rounded-md p-3 mb-6 w-full text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />

        <button
          onClick={handleSignUp}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md w-full mb-6"
        >
          Sign Up
        </button>

        <p className="text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>

    
    </div>
  );
};

export default SignUp;
