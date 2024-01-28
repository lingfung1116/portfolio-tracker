// AddTransactionModal.js
import './AddTransactionModal.css';
import React, { useState, useEffect } from 'react';

const AddTransactionModal = ({ showModal, closeModal, onTransactionAdded }) => {
  const [security, setSecurity] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [totalAmount, setTotalAmount] = useState('0.00');

  const getTodaysDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    const total =
      (parseFloat(quantity) || 0) * (parseFloat(purchasePrice) || 0);
    setTotalAmount(total.toFixed(2));
  }, [quantity, purchasePrice]);

  const handleSecurityChange = (event) => {
    setSecurity(event.target.value.toUpperCase());
  };

  const handleSecurityInput = (event) => {
    if (!/[A-Z]/.test(event.key) && event.key.length === 1) {
      event.preventDefault();
    }
  };

  const handleQuantityChange = (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setQuantity(value);
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const userId = localStorage.getItem('userId');
    const jwtToken = localStorage.getItem('jwt');

    if (!userId || !jwtToken) {
      console.error('No user ID or JWT token found in local storage.');
      return; // Exit the function if we don't have the necessary information
    }

    const transactionData = {
      transactionDate: new Date().toISOString(), // Format date as required by your API
      type: document.getElementById('transaction-type').value,
      quantity: parseInt(quantity, 10),
      price: parseFloat(purchasePrice),
      userId: parseInt(userId, 10),
      symbol: security,
    };

    try {
      const response = await fetch('http://localhost:8080/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      console.log('Transaction Created:', responseData);
      closeModal();

      // Check if onTransactionAdded is a function and then call it
      if (typeof onTransactionAdded === 'function') {
        onTransactionAdded();
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  if (!showModal) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <header className="modal-header">
          <h2 className="modal-title">Add Transaction</h2>
          <button onClick={closeModal} className="modal-close-button">
            &times;
          </button>
        </header>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="AddTransactionModal__form-group">
            <label htmlFor="transaction-type">Transaction Type</label>
            <select id="transaction-type" name="transactionType">
              <option value="BUY">Buy</option>
              <option value="SELL">Sell</option>
            </select>
          </div>

          <div className="AddTransactionModal__form-group">
            <label htmlFor="security">Add Security</label>
            <input
              type="text"
              id="security"
              name="security"
              placeholder="Ticker symbol"
              value={security}
              onChange={handleSecurityChange}
              onKeyDown={handleSecurityInput}
            />
          </div>

          <div className="AddTransactionModal__form-group">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="text" // Use text type to prevent default number field behavior
              inputMode="numeric" // Brings up numeric keypad on mobile devices
              id="quantity"
              name="quantity"
              placeholder="e.g., 10"
              value={quantity}
              onChange={handleQuantityChange}
            />
          </div>

          <div className="AddTransactionModal__form-group">
            <label htmlFor="transaction-date">Transaction Date</label>
            <input
              type="date"
              id="transaction-date"
              name="transactionDate"
              defaultValue={getTodaysDate()}
              max={getTodaysDate()}
            />
          </div>

          <div className="AddTransactionModal__form-group">
            <label htmlFor="purchase-price">Purchase Price</label>
            <input
              type="number"
              id="purchase-price"
              name="purchasePrice"
              placeholder="150.00"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
            />
          </div>

          <div className="AddTransactionModal__form-group">
            <label htmlFor="total-amount">Total Amount</label>
            <input
              type="text"
              id="total-amount"
              name="totalAmount"
              readOnly
              value={`$${totalAmount}`}
            />
          </div>

          <div className="AddTransactionModal__form-group">
            <button type="submit">Add Transaction</button>
            <button type="button" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
