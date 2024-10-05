import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <input
        type="text"
        placeholder="Username"
        className="border p-2 mb-2 w-80"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 mb-2 w-80"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} className="bg-blue-500 text-white p-2 w-80">
        Login
      </button>
    </div>
  );
};

export default Login;
