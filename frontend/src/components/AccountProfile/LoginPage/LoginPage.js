// LoginPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';
import hide from '../../../assets/show.png';
import show from '../../../assets/hide.png';

function LoginPage() {
  const [username, setUsername] = useState(''); // State for username input
  const [password, setPassword] = useState(''); // State for password input
  const [error, setError] = useState(''); // State for storing login error messages
  const [loading, setLoading] = useState(false); // State to indicate loading process
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  // Updates the username state as the user types
  const handleUserNameChange = (e) => setUsername(e.target.value);

  // Updates the password state as the user types
  const handlePasswordChange = (e) => setPassword(e.target.value);

  // Toggles the password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    fetch(process.env.REACT_APP_LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        setLoading(false);
        if (response.ok) {
          return response.json().then((data) => {
            // Use the token from the response body instead of headers
            localStorage.setItem('jwt', data.token);
            localStorage.setItem('userId', data.id);
            navigate('/dashboard');
          });
        } else {
          return response.json().then((data) => {
            setError(data.message || 'Unknown error occurred.');
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        setError('There was an error processing your login.');
      });
  };

  // The JSX for the login form
  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="title">Login</div>
        <div className="form-group">
          <input
            type="text"
            value={username}
            onChange={handleUserNameChange}
            placeholder="Username"
            className="login-input"
          />
          <div className="password-group">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              placeholder="Password"
              className="login-input"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="show-password-button"
            >
              <img
                src={showPassword ? hide : show}
                alt="Toggle Password Visibility"
              />
            </button>
          </div>
          {loading && <div>Loading...</div>} {/* Loading indicator */}
          {error && <div className="error-message">{error}</div>}{' '}
          {/* Error message */}
          <button type="submit" className="login-button" disabled={loading}>
            Login
          </button>
          <Link to="/signup" className="signup-link">
            Don't have an account? Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
