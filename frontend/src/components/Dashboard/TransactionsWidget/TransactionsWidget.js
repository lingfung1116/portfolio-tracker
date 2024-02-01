// TransactionsWidget.js
import React, { useState, useEffect } from 'react';
import './TransactionsWidget.css';
import fetchCompanyLogos from '../../../utils/fetchCompanyLogos';

const TransactionsWidget = ({ userId, jwt, updateData }) => {
  const [groupedTransactions, setGroupedTransactions] = useState({});
  const [logos, setLogos] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sort and group transactions by month and year
  const sortAndGroupTransactions = (transactions) => {
    // Sort transactions by date in descending order
    const sortedTransactions = transactions.sort(
      (a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)
    );
    // Group transactions by month and year
    return sortedTransactions.reduce((acc, transaction) => {
      const monthYear = new Date(transaction.transactionDate).toLocaleString(
        'default',
        {
          month: 'long',
          year: 'numeric',
        }
      );
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(transaction);
      return acc;
    }, {});
  };

  // Fetch transactions and logos
  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_TRANSACTION_WIDGET_URL}${userId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${jwt}`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const groupedData = sortAndGroupTransactions(data);
        setGroupedTransactions(groupedData);

        // Fetch logos for all unique company symbols in the transactions
        const uniqueSymbols = [...new Set(data.map((tran) => tran.symbol))];
        const logos = await fetchCompanyLogos(uniqueSymbols);
        setLogos(logos);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [userId, jwt, updateData]);

  // Ensure this function matches the corrected types "Bought" or "Sold"
  const getArrow = (action) => {
    const formattedAction = action.toLowerCase() === 'buy' ? 'Bought' : 'Sold';
    return formattedAction === 'Bought' ? '→' : '←';
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="TransactionsWidget__container">
      <div className="TransactionsWidget">
        <h2 className="TransactionsWidget__Title">Transactions</h2>
        {Object.entries(groupedTransactions).map(
          ([monthYear, transactions]) => (
            <React.Fragment key={monthYear}>
              <h4 className="TransactionsWidget__Month">{monthYear}</h4>
              <ul className="TransactionsWidget__List">
                {transactions.map((transaction, index) => (
                  <React.Fragment key={transaction.id}>
                    <li className="TransactionsWidget__Item">
                      <div className="TransactionsWidget__DateContainer">
                        <span className="TransactionsWidget__Date">
                          {new Date(
                            transaction.transactionDate
                          ).toLocaleDateString()}
                        </span>
                        <span className="TransactionsWidget__Arrow">
                          {getArrow(transaction.type)}{' '}
                        </span>
                      </div>
                      <div className="TransactionsWidget__DetailsWithLogo">
                        <img
                          src={logos[transaction.symbol]}
                          alt={`${transaction.symbol} logo`}
                          className="TransactionsWidget__logo"
                        />
                        <div className="TransactionsWidget__Details">
                          <span className="TransactionsWidget__Company">
                            {transaction.symbol}
                          </span>
                          <span className="TransactionsWidget__Action">
                            {`${
                              transaction.type === 'BUY' ? 'Bought' : 'Sold'
                            } x${transaction.quantity} at $${
                              transaction.price
                            }`}
                          </span>
                        </div>
                      </div>
                      <span className="TransactionsWidget__Total">
                        {`$${(transaction.quantity * transaction.price).toFixed(
                          2
                        )}`}
                      </span>
                    </li>
                    {index < transactions.length - 1 && (
                      <hr className="TransactionsWidget__Divider" />
                    )}
                  </React.Fragment>
                ))}
              </ul>
            </React.Fragment>
          )
        )}
      </div>
    </div>
  );
};

export default TransactionsWidget;
