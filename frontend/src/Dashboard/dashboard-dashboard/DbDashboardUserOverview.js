import React, { useEffect, useState, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";

const formatLargeNumber = (num) => {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
  if (num < 1e3) return num.toFixed(2);
  return num.toFixed(2);
};
const UserOverview = ({ transactions, address, coinName, coinId }) => {
  const [userData, setUserData] = useState({
    balance: 0,
    balanceUSD: 0,
    firstActive: "",
    lastActive: "",
    sent: 0,
    received: 0,
    total: 0,
  });

  const DataProcessing = useCallback(async () => {
    if (transactions.length === 0) return;

    const firstTx = transactions[transactions.length - 1];
    const lastTx = transactions[0];

    const firstActiveDate = new Date(firstTx.block_timestamp);
    const lastActiveDate = new Date(lastTx.block_timestamp);

    let sentTotal = 0;
    let receivedTotal = 0;

    if (coinName.toLowerCase() === "ethereum") {
      transactions.forEach((tx) => {
        if (tx.input === "0x") {
          if (tx.direction === "inbound") {
            receivedTotal += parseFloat(tx.value);
          } else if (tx.direction === "outbound") {
            sentTotal += parseFloat(tx.value);
          }
        }
      });
    } else {
      transactions.forEach((tx) => {
        if (tx.direction === "inbound") {
          receivedTotal += parseFloat(tx.value);
        } else if (tx.direction === "outbound") {
          sentTotal += parseFloat(tx.value);
        }
      });
    }
    // Define fetch functions inside DataProcessing to prevent ESLint warnings
    const fetchCryptoBalance = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/balance/${coinName.toLowerCase()}/${address}`
        );
        const data = await response.json();
        return data.balance || 0;
      } catch (error) {
        console.error("Error fetching crypto balance:", error);
        return 0;
      }
    };

    const fetchCryptoPrice = async () => {
      const queryCoinName =
        coinName.toLowerCase() === "seele"
          ? "ethereum"
          : coinName.toLowerCase();
      try {
        const response = await fetch(
          `http://localhost:5000/api/crypto-price/${queryCoinName.toLowerCase()}`
        );
        const data = await response.json();
        return data.price;
      } catch (error) {
        console.error("Error fetching crypto price:", error);
        return 0;
      }
    };
    // Run both requests in parallel for better performance
    const [balance, cryptoPrice] = await Promise.all([
      fetchCryptoBalance(coinName, address),
      fetchCryptoPrice(coinName),
    ]);

    const balanceUSD = cryptoPrice ? balance * cryptoPrice : 0;

    setUserData({
      balance: balance,
      balanceUSD,
      firstActive: firstActiveDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      lastActive: lastActiveDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      firstActiveAgo: formatDistanceToNow(firstActiveDate, {
        addSuffix: true,
      }),
      lastActiveAgo: formatDistanceToNow(lastActiveDate, {
        addSuffix: true,
      }),
      sent: sentTotal,
      received: receivedTotal,
      total: sentTotal + receivedTotal,
    });
  }, [transactions, coinName, address]);

  useEffect(() => {
    DataProcessing();
  }, [DataProcessing]); // Ensure it runs only when transactions or dependencies change
  return (
    <div className="DB-main-container-1">
      <DbItem1
        address={address}
        firstActive={userData.firstActive}
        lastActive={userData.lastActive}
        firstActiveAgo={userData.firstActiveAgo}
        lastActiveAgo={userData.lastActiveAgo}
      />
      <DbItem2
        balance={userData.balance}
        balanceUSD={userData.balanceUSD}
        coinId={coinId}
      />
      <DbItem3
        sent={userData.sent}
        received={userData.received}
        total={userData.total}
      />
    </div>
  );
};

export default UserOverview;

const DbItem1 = ({
  address,
  firstActive,
  lastActive,
  firstActiveAgo,
  lastActiveAgo,
}) => {
  return (
    <div className="container">
      <h1>Overview</h1>
      <div className="info">
        <i className="fas fa-wallet"></i>
        <span>Address</span>
      </div>
      <div className="info">
        <span id="user-addr">{address}</span>
      </div>
      <div className="dates-container">
        <div className="date">
          <div className="info">
            <i className="fas fa-calendar-alt"></i>
            <span>First active</span>
          </div>
          <span>{firstActive}</span>
          <span className="time">{firstActiveAgo || "Loading..."}</span>
        </div>
        <div className="date">
          <div className="info">
            <i className="fas fa-calendar-check"></i>
            <span>Last active</span>
          </div>
          <span>{lastActive}</span>
          <span className="time">{lastActiveAgo || "Loading..."}</span>
        </div>
      </div>
    </div>
  );
};
const DbItem2 = ({ balance, balanceUSD, coinId }) => {
  return (
    <div className="container">
      <h1>Balance</h1>
      <div className="info">
        <i className="fas fa-coins icon"></i>
        <span>Balance</span>
      </div>
      <div className="info-balance">
        <p>
          {formatLargeNumber(balance)} {coinId}
        </p>
        <span>~ {formatLargeNumber(balanceUSD)} USD</span>
      </div>
    </div>
  );
};
const DbItem3 = ({ sent, received, total }) => {
  return (
    <div className="container">
      <h1>Transactions Volume</h1>
      <div className="info">
        <i className="fa-solid fa-money-bill-transfer"></i>
        <span>Transaction Details</span>
      </div>
      <div className="sent-received-container">
        <div className="amount">
          <div className="info">
            <i className="fa-solid fa-arrow-up"></i>
            <span>Sent</span>
          </div>
          <span>{formatLargeNumber(sent)}</span>
        </div>
        <div className="amount">
          <div className="info">
            <i className="fa-solid fa-arrow-down"></i>
            <span>Received</span>
          </div>
          <span>{formatLargeNumber(received)}</span>
        </div>
        <div className="amount">
          <div className="info">
            <i className="fa-solid fa-calculator"></i>
            <span>Total</span>
          </div>
          <span>{formatLargeNumber(total)}</span>
        </div>
      </div>
    </div>
  );
};
