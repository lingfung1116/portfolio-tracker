import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import LoginPage from './components/AccountProfile/LoginPage/LoginPage';
import SignUpPage from './components/AccountProfile/SignUpPage/SignUpPage';
import PhoneNumberInput from './components/AccountProfile/OtpPage/PhoneNumberInput';
import OtpInput from './components/AccountProfile/OtpPage/OtpInput';
import HomePage from './components/Dashboard/Dashboard';
import PositionsWidget from './components/Dashboard/PositionsWidget/PositionsWidget';
import TransactionsWidget from './components/Dashboard/TransactionsWidget/TransactionsWidget';

function App() {
  // Function to check if the current route should display the Header
  const shouldDisplayHeader = () => {
    const allowedPaths = [
      '/',
      '/signup',
      '/otp-phone',
      '/otp-code',
      '/dashboard',
      '/positions',
      '/transactions',
    ];
    return allowedPaths.includes(window.location.pathname);
  };

  return (
    <Router>
      <div className="App">
        {shouldDisplayHeader() && <Header />}
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/otp-phone" element={<PhoneNumberInput />} />
          <Route path="/otp-code" element={<OtpInput />} />
          <Route path="/dashboard" element={<HomePage />} />
          <Route path="/positions" element={<PositionsWidget />} />
          <Route path="/transactions" element={<TransactionsWidget />} />
          {/* Add other routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
