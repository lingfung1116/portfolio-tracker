// Dashboard.js
import React, { useState } from 'react';
import PositionsWidget from './PositionsWidget/PositionsWidget';
import TransactionsWidget from './TransactionsWidget/TransactionsWidget';

function HomePage() {
  const [key, setKey] = useState(0); // State to force re-rendering of the child components

  // Retrieve the userID and jwtToken from local storage here
  const userId = localStorage.getItem('userId');
  const jwt = localStorage.getItem('jwt');

  // Callback function to be called when a new transaction is added
  const handleTransactionAdded = () => {
    setKey((prevKey) => prevKey + 1); // Increment the key to force re-render
  };

  return (
    <div>
      {/* Pass the userID, jwtToken, and key as props to the child components */}
      <PositionsWidget
        key={`positions-${key}`}
        userId={userId}
        jwt={jwt}
        onTransactionAdded={handleTransactionAdded}
      />
      <TransactionsWidget
        key={`transactions-${key}`}
        userId={userId}
        jwt={jwt}
      />
    </div>
  );
}

export default HomePage;
