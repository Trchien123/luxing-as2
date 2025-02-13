import React, { useEffect, useState } from "react";
import '../../style/sphere.css';

export const coinData = [
  { name: "Bitcoin", icon:  require ("../../asset/cryptos/bitcoin-btc-logo.png" )},
  { name: "Ethereum", icon: require ("../../asset/cryptos/ethereum-eth-logo.png")},
  { name: "Shiba Inu", icon: require ("../../asset/cryptos/shiba-inu-shib-logo.png" )},
  { name: "Dogecoin", icon: require ("../../asset/cryptos/dogecoin-doge-logo.png" )},
  { name: "Popcat", icon: require ("../../asset/cryptos/popcat-sol-popcat-logo.png")},
  { name: "Polkadot", icon: require ("../../asset/cryptos/polkadot-new-dot-logo.png" )},
  { name: "Stellar", icon: require ("../../asset/cryptos/stellar-xlm-logo.png" )},
  { name: "Cardano", icon:require ("../../asset/cryptos/cardano-ada-logo.png" )},
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
