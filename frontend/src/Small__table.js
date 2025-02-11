import React, { useEffect, useState } from "react";
import './style/sphere.css';

export const coinData = [
  { name: "Bitcoin", icon: "/icon/icon1.png" },
  { name: "Ethereum", icon: "/icon/icon2.png" },
  { name: "Shiba Inu", icon: "/icon/icon3.png" },
  { name: "Dogecoin", icon: "/icon/icon4.png" },
  { name: "Solana", icon: "/icon/icon5.png" },
  { name: "Polkadot", icon: "/icon/icon6.png" },
  { name: "XRP", icon: "/icon/icon7.png" },
  { name: "Tether USDt", icon: "/icon/icon8.png" },
];

const getRandomValue = (min, max, isPercentage = false) => {
  const value = (Math.random() * (max - min) + min).toFixed(2);
  return isPercentage ? `${value}%` : `$${value}`;
};

const Small = ({ dotData, onClose }) => {
  const [coinInfo, setCoinInfo] = useState(null);

  useEffect(() => {
    if (dotData) {
      const coin = coinData[dotData.coinIndex];
      setCoinInfo({
        name: coin.name,
        price: getRandomValue(100, 50000),
        marketCap: getRandomValue(1, 1000),
        volume: getRandomValue(10, 10000),
        circulatingSupply: `${(Math.random() * 1e9).toFixed(0)} coins`,
        change24h: getRandomValue(-20, 20, true),
      });
    }
  }, [dotData]);

  if (!dotData || !coinInfo) return null;

  return (
    <div className="sphere-smalltable">
      <h2>{coinInfo.name}</h2>
      <h3>Current Price: {coinInfo.price}</h3>

      <hr />

      <p>
        <strong>Name Index:</strong> {dotData.coinIndex + 1} <br />
        <strong>Market Cap:</strong> {coinInfo.marketCap}M <br />
        <strong>Volume (24h):</strong> {coinInfo.volume} <br />
        <strong>Circulating Supply:</strong> {coinInfo.circulatingSupply} <br />
        <strong>24h Change:</strong> {coinInfo.change24h}
      </p>

      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default Small;
