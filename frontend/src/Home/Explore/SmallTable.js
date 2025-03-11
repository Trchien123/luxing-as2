import React, { useEffect, useState } from "react";
import '../../style/sphere.css';

export const coinData = [
  { name: "Bitcoin", icon: require("../../asset/cryptos/bitcoin-btc-logo.png"), id: "bitcoin" },
  { name: "Ethereum", icon: require("../../asset/cryptos/ethereum-eth-logo.png"), id: "ethereum" },
  { name: "Shiba Inu", icon: require("../../asset/cryptos/shiba-inu-shib-logo.png"), id: "shiba-inu" },
  { name: "Dogecoin", icon: require("../../asset/cryptos/dogecoin-doge-logo.png"), id: "dogecoin" },
  { name: "Popcat", icon: require("../../asset/cryptos/popcat-sol-popcat-logo.png"), id: "popcat" },
  { name: "Polkadot", icon: require("../../asset/cryptos/polkadot-new-dot-logo.png"), id: "polkadot" },
  { name: "Stellar", icon: require("../../asset/cryptos/stellar-xlm-logo.png"), id: "stellar" },
  { name: "Cardano", icon: require("../../asset/cryptos/cardano-ada-logo.png"), id: "cardano" },
];

const Small = ({ dotData, onClose }) => {
  const [allCoinData, setAllCoinData] = useState(null); // Store data for all coins
  const [coinInfo, setCoinInfo] = useState(null); // Display data for selected coin
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data for all coins once when the component mounts
  useEffect(() => {
    const fetchAllCoinData = async () => {
      setLoading(true);
      setError(null);

      const coinIds = coinData.map(coin => coin.id).join(",");
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data from CoinGecko");
        }

        const data = await response.json();
        setAllCoinData(data); // Store the full response
      } catch (err) {
        setError(err.message);
        setAllCoinData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCoinData();
  }, []); // Empty dependency array = fetch once on mount

  // Update displayed coin info when dotData changes
  useEffect(() => {
    if (!dotData || !allCoinData) return;

    const coin = coinData[dotData.coinIndex];
    const coinId = coin.id;
    const coinDataFromAPI = allCoinData[coinId];

    if (coinDataFromAPI) {
      setCoinInfo({
        name: coin.name,
        price: `$${coinDataFromAPI.usd.toLocaleString()}`,
        marketCap: `$${(coinDataFromAPI.usd_market_cap / 1e6).toFixed(2)}M`, // Millions
        volume: `$${(coinDataFromAPI.usd_24h_vol / 1e6).toFixed(2)}M`, // Millions
        change24h: `${coinDataFromAPI.usd_24h_change.toFixed(2)}%`,
        lastUpdated: new Date(coinDataFromAPI.last_updated_at * 1000).toLocaleString(), // Convert Unix timestamp to readable date
      });
    }
  }, [dotData, allCoinData]);

  if (!dotData) return null;

  return (
    <div className="sphere-smalltable">
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {coinInfo && !loading && !error && (
        <>
          <h2>{coinInfo.name}</h2>
          <h3>Current Price: {coinInfo.price}</h3>
          <hr />
          <p>
            <strong>Name Index:</strong> {dotData.coinIndex + 1} <br />
            <strong>Market Cap:</strong> {coinInfo.marketCap} <br />
            <strong>Volume (24h):</strong> {coinInfo.volume} <br />
            <strong>24h Change:</strong> {coinInfo.change24h} <br />
            <strong>Last Updated:</strong> {coinInfo.lastUpdated}
          </p>
          <button onClick={onClose}>Close</button>
        </>
      )}
      {!coinInfo && !loading && !error && <p>Data not available yet.</p>}
    </div>
  );
};

export default Small;