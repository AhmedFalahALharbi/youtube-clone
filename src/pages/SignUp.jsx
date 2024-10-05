import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

    // Clear previous error and success messages
    setError('');
    setSuccess('');

    // First, check if the username already exists using a GET request
    axios
      .get('https://66f1060c41537919154f2fc1.mockapi.io/users')
      .then((response) => {
        // Check if the username exists
        const existingUser = response.data.find((u) => u.username === username);
        if (existingUser) {
          setError('Username already exists. Please choose another.');
        } else {
          // If the username doesn't exist, proceed with the POST request to create the user
          axios
            .post('https://66f1060c41537919154f2fc1.mockapi.io/users', {
              username,
              password,
            })
            .then((response) => {
              console.log('User signed up successfully:', response.data);
              setSuccess('Sign-up successful! Redirecting to login...');
              // Redirect to login after 2 seconds
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
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-3xl font-bold mb-4">Sign Up</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 mb-2 w-80"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mb-2 w-80"
      />
      <button
        onClick={handleSignUp}
        className="bg-blue-500 text-white p-2 mt-2 w-80"
      >
        Sign Up
      </button>
    </div>
  );
};

export default SignUp;
