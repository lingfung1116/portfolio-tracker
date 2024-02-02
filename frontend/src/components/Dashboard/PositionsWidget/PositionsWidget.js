import React, { useState, useEffect } from 'react';
import './PositionsWidget.css';
import AddTransactionModal from '../../AddTransactionModal/AddTransactionModal';
import fetchCompanyLogos from '../../../utils/fetchCompanyLogos'; // Import the utility function

const PositionsWidget = ({ userId, jwt, onTransactionAdded }) => {
  const [positions, setPositions] = useState([]); // State to store positions
  const [logos, setLogos] = useState({});
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility

  // Function to fetch positions data
  const fetchPositions = () => {
    if (!userId || !jwt) {
      console.error('No user ID or JWT token found in local storage.');
      return;
    }

    fetch(`${process.env.REACT_APP_POSITION_WIDGET_URL}${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setPositions(data);
      })
      .catch((error) => {
        console.error('Error fetching positions:', error);
      });
  };

  // Function to fetch logos using the API
  const fetchLogos = async (symbols) => {
    try {
      const newLogos = await fetchCompanyLogos(symbols); // Use the utility function
      setLogos(newLogos);
    } catch (error) {
      console.error('Error fetching logos:', error);
    }
  };

  // Calculating total position and unrealized P/L
  const calculateTotals = (positions) => {
    return positions.reduce(
      (totals, position) => {
        const currentPositionValue = position.currentPrice * position.quantity;
        const individualPL =
          currentPositionValue - position.buyInPrice * position.quantity;

        totals.totalPosition += currentPositionValue;
        totals.totalPL += individualPL;

        return totals;
      },
      { totalPosition: 0, totalPL: 0 }
    );
  };

  // Use the calculateTotals function to get the total values
  const { totalPosition, totalPL } = calculateTotals(positions);

  // Use a single function to format currency with color based on P/L value
  const formatCurrencyWithPLColor = (value) => {
    const plClass =
      value >= 0 ? 'PositionWidget__positive' : 'PositionWidget__negative';
    return (
      <span className={plClass}>
        {value >= 0 ? `+${formatCurrency(value)}` : formatCurrency(value)}
      </span>
    );
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  // When positions are updated, fetch the logos for new symbols
  useEffect(() => {
    const symbols = positions.map((position) => position.symbol);
    if (symbols.length > 0) {
      fetchLogos(symbols);
    }
  }, [positions]);

  // Formatting functions
  const formatCurrency = (value) => `$${Math.abs(value).toFixed(2)}`;
  const formatCurrencyPL = (value) =>
    `${value >= 0 ? '+' : '-'}$${Math.abs(value).toFixed(2)}`;
  const formatPercentage = (value) =>
    `${value >= 0 ? '+' : ''}${(value * 100).toFixed(2)}%`;

  // Open and close modal functions
  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    fetchPositions();
    onTransactionAdded(); // Notify parent component that a transaction was added
  };

  return (
    <div className="PositionWidget__container">
      <div className="PositionWidget__widget">
        <div className="PositionWidget__widget-header">
          <h1 className="PositionWidget__positions-title">Positions</h1>
          <div className="PositionWidget__header-totals">
            <div className="PositionWidget__net-liq">
              <span className="PositionWidget__label">Net Liq Value: </span>
              <span className="PositionWidget__value">
                {formatCurrency(totalPosition)}
              </span>
            </div>
            <div className="PositionWidget__unrealized-pl">
              <span className="PositionWidget__label">Unrealized P/L: </span>
              {formatCurrencyWithPLColor(totalPL)}
            </div>
          </div>
          <button
            className="PositionWidget__add-transaction-btn"
            onClick={openModal}
          >
            Add transaction
          </button>
        </div>
        <table className="PositionWidget__table" id="myTable">
          <thead>
            <tr className="PositionWidget__tr">
              <th className="PositionWidget__th">Title</th>
              <th className="PositionWidget__th">Buy in</th>
              <th className="PositionWidget__th">Current Position</th>
              <th className="PositionWidget__th">P/L</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position) => {
              const totalBuyIn = position.buyInPrice * position.quantity;
              const currentPosition = position.currentPrice * position.quantity;
              const totalPL = currentPosition - totalBuyIn;
              const plClass =
                totalPL >= 0
                  ? 'PositionWidget__positive'
                  : 'PositionWidget__negative';

              return (
                <tr key={position.id} className="PositionWidget__tr">
                  <td className="PositionWidget__td">
                    <img
                      src={logos[position.symbol]}
                      alt={`${position.symbol} logo`}
                      className="PositionWidget__logo"
                    />
                    {position.symbol}{' '}
                    <span className="PositionWidget__quantity">
                      x {position.quantity}
                    </span>
                  </td>
                  <td className="PositionWidget__td">
                    {formatCurrency(totalBuyIn)}{' '}
                    <div className="PositionWidget__secondary-text">
                      {formatCurrency(position.buyInPrice)}
                    </div>
                  </td>
                  <td className="PositionWidget__td">
                    {formatCurrency(currentPosition)}{' '}
                    <div className="PositionWidget__secondary-text">
                      {formatCurrency(position.currentPrice)}
                    </div>
                  </td>
                  <td className={`PositionWidget__td ${plClass}`}>
                    {formatCurrencyPL(totalPL)}{' '}
                    <div className={`PositionWidget__percentage ${plClass}`}>
                      {formatPercentage(position.profitLoss)}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="PositionWidget__footer">
          Latest End-Of-Day data powered by marketstack
        </div>
      </div>
      <AddTransactionModal
        showModal={showModal}
        closeModal={closeModal}
        onTransactionAdded={fetchPositions}
      />
    </div>
  );
};

export default PositionsWidget;
