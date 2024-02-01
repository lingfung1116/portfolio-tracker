// App.js
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
  return (
    <Router>
      <div className="App">
        <Header /> {/* No prop is passed by default */}
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
