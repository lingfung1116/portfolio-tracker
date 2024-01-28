import React from 'react';
import './TransactionsWidget.css'; // Make sure the path to your CSS file is correct

const transactions = [
  {
    id: 1,
    date: '06.01',
    company: 'Microsoft',
    details: 'Bought x10 at $368.40',
    total: '$3,684.00',
  },
  {
    id: 2,
    date: '04.01',
    company: 'Apple',
    details: 'Sold x10 at $175.00',
    total: '$1,750.00',
  },
  // ... add the rest of your transactions here
];

const TransactionsWidget = () => {
  const getArrow = (action) =>
    action.toLowerCase().includes('bought') ? '→' : '←';

  return (
    <div className="TransactionsWidget">
      <h2 className="TransactionsWidget__Title">Transactions</h2>
      <h4 className="TransactionsWidget__Month">January 2024</h4>
      <ul className="TransactionsWidget__List">
        {transactions.map((transaction, index) => (
          <React.Fragment key={transaction.id}>
            <li className="TransactionsWidget__Item">
              <div className="TransactionsWidget__DateContainer">
                <span className="TransactionsWidget__Date">
                  {transaction.date}
                </span>
                <span className="TransactionsWidget__Arrow">
                  {getArrow(transaction.details)}
                </span>
              </div>
              <div className="TransactionsWidget__Details">
                <span className="TransactionsWidget__Company">
                  {transaction.company}
                </span>
                <span className="TransactionsWidget__Action">
                  {transaction.details}
                </span>
              </div>
              <span className="TransactionsWidget__Total">
                {transaction.total}
              </span>
            </li>
            {index < transactions.length - 1 && (
              <hr className="TransactionsWidget__Divider" />
            )}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};

export default TransactionsWidget;
