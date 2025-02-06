import React, { useEffect, useState } from "react";
import './style/sphere.css';

const coinNames = ["Bitcoin", "Ethereum", "Ripple", "Litecoin", "Cardano", "Polkadot", "Solana", "Dogecoin", "Shiba Inu", "Avalanche"];

const getRandomValue = (min, max, isPercentage = false) => {
  const value = (Math.random() * (max - min) + min).toFixed(2);
  return isPercentage ? `${value}%` : `$${value}`;
};

const Small = ({ dotData, onClose }) => {
  const [randomInfo, setRandomInfo] = useState(null);

  useEffect(() => {
    if (dotData) {
      const randomIndex = Math.floor(Math.random() * coinNames.length);
      setRandomInfo({
        name: coinNames[randomIndex],
        price: getRandomValue(100, 50000),
        marketCap: getRandomValue(1, 1000),
        volume: getRandomValue(10, 10000),
        circulatingSupply: `${(Math.random() * 1e9).toFixed(0)} coins`,
        change24h: getRandomValue(-20, 20, true),
      });
    }
  }, [dotData]);

  if (!dotData || !randomInfo) return null;

  return (
    <div className="sphere-smalltable">
      <h2>{randomInfo.name}</h2>
      <h3>Current Price: {randomInfo.price}</h3>

      <hr />

      <p>
        <strong>Name Index:</strong> {dotData.index + 1} <br />
        <strong>Market Cap:</strong> {randomInfo.marketCap}M <br />
        <strong>Volume (24h):</strong> {randomInfo.volume} <br />
        <strong>Circulating Supply:</strong> {randomInfo.circulatingSupply} <br />
        <strong>24h Change:</strong> {randomInfo.change24h}
      </p>

      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default Small;
