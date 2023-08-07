import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { LOGIN } from '../../utils/mutations';



const Login = () => {
  let navigate = useNavigate();
  const [login, { error }] = useMutation(LOGIN);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await login({
        variables: { username, password },
      });
      localStorage.setItem('token', data.login.token);
      console.log("Token stored successfully!");
      navigate("/profile"); //redirects the user to the profile page after successful login
    } catch (e) {
      console.error(JSON.stringify(e, null, 2));
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <button type="submit">Log in</button>
      </form>
      {error && <p>{error.message}</p>}
    </div>
  );
}

export default Login;
