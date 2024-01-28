import React, { useState, useEffect } from 'react';
import './PositionsWidget.css';
import AddTransactionModal from '../../../components/AddTransactionModal/AddTransactionModal';
import defaultLogo from '../../../assets/defaultLogo.png';

const PositionsWidget = () => {
  const [positions, setPositions] = useState([]); // State to store positions
  const [logos, setLogos] = useState({});
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility

  // Function to fetch positions data
  const fetchPositions = () => {
    const userId = localStorage.getItem('userId');
    const jwtToken = localStorage.getItem('jwt');

    if (!userId || !jwtToken) {
      console.error('No user ID or JWT token found in local storage.');
      return;
    }

    fetch(`http://localhost:8080/api/positions/user/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
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
    const requests = symbols.map((symbol) =>
      fetch(
        `https://api.benzinga.com/api/v2/logos/search?token=b2d218693a4b4510a1f9fc49be531956&search_keys=${symbol}&search_keys_type=symbol&fields=mark_vector_light`,
        {
          method: 'GET',
          headers: { accept: 'application/json' },
        }
      )
    );

    try {
      const responses = await Promise.all(requests);
      const logosData = await Promise.all(responses.map((res) => res.json()));

      const newLogos = logosData.reduce((acc, data) => {
        if (data.ok && data.data.length > 0) {
          const symbolData = data.data[0]; // Assuming the first item is the desired one
          const logoUrl = symbolData.files.mark_vector_light;
          acc[symbolData.search_key] = logoUrl;
        }
        return acc;
      }, {});
      setLogos(newLogos);
    } catch (error) {
      console.error('Error fetching logos:', error);
    }
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
    fetchPositions(); // Fetch positions again after closing the modal
  };

  return (
    <div className="PositionWidget__container">
      <div className="PositionWidget__widget">
        <div className="PositionWidget__widget-header">
          <h1 className="PositionWidget__positions-title">Positions</h1>
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
              <th className="PositionWidget__th">Position</th>
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
                      src={logos[position.symbol] || defaultLogo}
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
          Real-Time data powered by marketstack
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
