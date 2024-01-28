// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import LoginPage from './components/AccountProfile/LoginPage/LoginPage';
import SignUpPage from './components/AccountProfile/SignUpPage/SignUpPage';
import HomePage from './components/MainPage/MainPage';
import PositionsWidget from './components/MainPage/PositionsWidget/PositionsWidget';
import './App.css';
import TransactionsWidget from './components/MainPage/TransactionsWidget/TransactionsWidget';

function App() {
  return (
    <Router>
      <div className="App">
        <Header /> {/* No prop is passed by default */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/positions" element={<PositionsWidget />} />
          <Route path="/transactions" element={<TransactionsWidget />} />
          {/* Add other routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
