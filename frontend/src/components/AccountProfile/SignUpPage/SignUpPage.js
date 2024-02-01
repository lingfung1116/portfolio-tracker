// SignUpPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignUpPage.css'; // Make sure the path to your CSS file is correct
import hide from '../../../assets/show.png'; // Ensure these paths are correct
import show from '../../../assets/hide.png'; // Ensure these paths are correct

function SignUpPage() {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Handles input changes for the form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setError(''); // Reset the error message on input change
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;
    return regex.test(password);
  };

  // Handles the form submission for signing up
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validatePassword(userData.password)) {
      setError(
        'The password should consist of at least 8 characters and include at least one number, one uppercase letter, one lowercase letter and one symbol.'
      );
      return;
    }
    if (userData.password !== userData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    fetch(process.env.REACT_APP_SIGNUP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: userData.username,
        password: userData.password,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json().then((data) => {
            // Handle the token in the response body here as well
            localStorage.setItem('jwt', data.token);
            localStorage.setItem('userId', data.id);
            localStorage.setItem('username', userData.username); // Store username

            navigate('/otp-phone'); // Navigate to phone number input page of otp
          });
        } else {
          return response.json().then((data) => {
            setError(
              data.errors && data.errors.length > 0
                ? data.errors[0]
                : 'An error occurred.'
            );
          });
        }
      })
      .catch((error) => {
        setError('There was an error processing your sign up.');
      });
  };

  // Determine input field classes based on error state
  const inputClass = error ? 'sign-up-input input-error' : 'sign-up-input';

  return (
    <div className="sign-up-container">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <div className="title">Create Account</div>
        <div className="password-requirements">
          Password Requirements:
          <ul>
            <li>A minimum of 8 characters</li>
            <li>A lowercase character</li>
            <li>An uppercase character</li>
            <li>A special character</li>
            <li>A numeric character</li>
          </ul>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleChange}
            placeholder="Username"
            className="sign-up-input"
          />
          <div className="password-group">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={userData.password}
              onChange={handleChange}
              placeholder="Password"
              className={inputClass} // Apply the conditional class here
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="show-password-button"
            >
              <img
                src={showPassword ? hide : show}
                alt="Toggle Password Visibility"
              />
            </button>
          </div>
          <div className="password-group">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className={inputClass} // Apply the conditional class here
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="show-password-button"
            >
              <img
                src={showConfirmPassword ? hide : show}
                alt="Toggle Confirm Password Visibility"
              />
            </button>
          </div>
          {error && <div className="error-message">{error}</div>}{' '}
          {/* Display any error message */}
          <button type="submit" className="sign-up-button">
            Sign Up
          </button>
          <Link to="/" className="login-link">
            Already have an account? Login
          </Link>
        </div>
      </form>
    </div>
  );
}

export default SignUpPage;
