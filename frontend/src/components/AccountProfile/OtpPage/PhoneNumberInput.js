import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PhoneNumberInput.css';

function PhoneNumberInput() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();
  const username = localStorage.getItem('username'); // Get username from localStorage

  const sendOtp = () => {
    fetch(process.env.REACT_APP_SEND_OTP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber,
        username, // Use username from localStorage
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'DELIVERED') {
          navigate('/otp-code', { state: { phoneNumber, username } }); // Navigate to OTP page with state
        } else {
          console.log('OTP not delivered:', data.message);
        }
      })
      .catch((error) => {
        console.error('Error sending OTP:', error);
      });
  };

  const handleChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendOtp();
  };

  return (
    <div className="phoneNumberInput__otp-container">
      <form className="phoneNumberInput__otp-form" onSubmit={handleSubmit}>
        <div className="phoneNumberInput__title">Secure Your Account</div>
        <div className="phoneNumberInput__instruction">
          Enter your phone number below. An SMS will be sent to that number with
          a code to enter on the next screen.
        </div>
        <div className="phoneNumberInput__form-group">
          <input
            type="text"
            name="phoneNumber"
            value={phoneNumber}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="phoneNumberInput__otp-input"
          />
          <button type="submit" className="phoneNumberInput__otp-button">
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}

export default PhoneNumberInput;
