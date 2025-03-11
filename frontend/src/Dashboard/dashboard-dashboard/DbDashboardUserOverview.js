import React, { useEffect, useState, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";

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

    transactions.forEach((tx) => {
      if (tx.direction === "inbound") {
        receivedTotal += parseFloat(tx.value);
      } else if (tx.direction === "outbound") {
        sentTotal += parseFloat(tx.value);
      }
    });
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
      try {
        const response = await fetch(
          `http://localhost:5000/api/crypto-price/${coinName.toLowerCase()}`
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

    const balanceUSD = cryptoPrice ? (balance * cryptoPrice).toFixed(2) : "N/A";

    setUserData({
      balance: balance.toFixed(5),
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
      sent: sentTotal.toFixed(2),
      received: receivedTotal.toFixed(2),
      total: (sentTotal + receivedTotal).toFixed(5),
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
    <div class="container">
      <h1>Overview</h1>
      <div class="info">
        <i class="fas fa-wallet"></i>
        <span>Address</span>
      </div>
      <div class="info">
        <span id="user-addr">{address}</span>
      </div>
      <div class="dates-container">
        <div class="date">
          <div class="info">
            <i class="fas fa-calendar-alt"></i>
            <span>First active</span>
          </div>
          <span>{firstActive}</span>
          <span class="time">{firstActiveAgo || "Loading..."}</span>
        </div>
        <div class="date">
          <div class="info">
            <i class="fas fa-calendar-check"></i>
            <span>Last active</span>
          </div>
          <span>{lastActive}</span>
          <span class="time">{lastActiveAgo || "Loading..."}</span>
        </div>
      </div>
    </div>
  );
};
const DbItem2 = ({ balance, balanceUSD, coinId }) => {
  return (
    <div class="container">
      <h1>Balance</h1>
      <div class="info">
        <i class="fas fa-coins icon"></i>
        <span>Balance</span>
      </div>
      <div class="info-balance">
        <p>
          {balance} {coinId}
        </p>
        <span>~ {balanceUSD} USD</span>
      </div>
    </div>
  );
};
const DbItem3 = ({ sent, received, total }) => {
  return (
    <div class="container">
      <h1>Transactions Volume</h1>
      <div className="info">
        <i class="fa-solid fa-money-bill-transfer"></i>
        <span>Transaction Details</span>
      </div>
      <div class="sent-received-container">
        <div class="amount">
          <div class="info">
            <i class="fa-solid fa-arrow-up"></i>
            <span>Sent</span>
          </div>
          <span>{sent}</span>
        </div>
        <div class="amount">
          <div class="info">
            <i class="fa-solid fa-arrow-down"></i>
            <span>Received</span>
          </div>
          <span>{received}</span>
        </div>
        <div class="amount">
          <div class="info">
            <i class="fa-solid fa-calculator"></i>
            <span>Total</span>
          </div>
          <span>{total}</span>
        </div>
      </div>
    </div>
  );
};
