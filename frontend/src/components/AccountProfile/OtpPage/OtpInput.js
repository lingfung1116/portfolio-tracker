import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './OtpInput.css';

function OtpInput({ onOtpValidated }) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // Use location to access the state passed from the navigate function
  const phoneNumber = location.state?.phoneNumber; // Access phoneNumber from the state
  const username = localStorage.getItem('username'); // Get username from localStorage

  const validateOtp = () => {
    fetch(process.env.REACT_APP_VERIFY_OTP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        otpNumber: otp,
        username, // Include the username from localStorage in the request
      }),
    })
      .then((response) => {
        if (!response.ok) {
          // If the response is not ok, throw an error
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
        return response.text(); // Assuming the response is plain text
      })
      .then((text) => {
        if (text === 'OTP is valid.') {
          navigate('/'); // Navigate to home page
        } else {
          setError('Invalid OTP, please try again.');
        }
      })
      .catch((error) => {
        setError(error.message || 'An unknown error occurred');
      });
  };

  const handleChange = (e) => {
    setOtp(e.target.value);
    setError(''); // Clear error when user edits input
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateOtp();
  };

  const handleEditNumber = () => {
    navigate('/otp-phone'); // Navigate to PhoneNumberInput page
  };

  // If OTP is validated, you may want to navigate to another page or perform some action
  const handleOtpValidated = () => {
    navigate('/'); // Navigate to home page
  };

  return (
    <div className="otpInput__otp-container">
      <form className="otpInput__otp-form" onSubmit={handleSubmit}>
        <div className="otpInput__title">Verify Your Identity</div>
        <div className="otpInput__instruction">
          We've sent a message to your phone number {phoneNumber}
        </div>
        <div className="otpInput__form-group">
          <input
            type="text"
            name="otp"
            value={otp}
            onChange={handleChange}
            placeholder="Enter the 6-digit code"
            maxLength="6"
            className="otpInput__otp-input"
            autoComplete="one-time-code"
          />
          <button type="submit" className="otpInput__otp-button">
            Continue
          </button>
          {error && <div className="otpInput__error-message">{error}</div>}
        </div>
        <div className="otpInput__edit-number">
          <button onClick={handleEditNumber} className="otpInput__edit-button">
            Invalid code or did't receive a code? Edit phone number
          </button>
        </div>
      </form>
    </div>
  );
}

export default OtpInput;
