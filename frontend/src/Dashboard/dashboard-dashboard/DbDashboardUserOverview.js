import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";

const address = "0x00000000219ab540356cBB839Cbe05303d7705Fa";

const UserOverview = () => {
  const [userData, setUserData] = useState({
    balance: 0,
    balanceUSD: 0,
    firstActive: "",
    lastActive: "",
    sent: 0,
    received: 0,
    total: 0,
  });
  useEffect(() => {
    // Checking address
    const isBitcoinAddress = (addr) => /^(1|3|bc1)/.test(addr);
    const apiURL = isBitcoinAddress(address)
      ? `http://localhost:5000/api/bitcoin/transactions/${address}`
      : `http://localhost:5000/api/transactions/${address}`;
    const fetchData = async () => {
      try {
        const response = await axios.get(apiURL);
        const transactions = response.data;

        //First and Last Active
        if (transactions.length > 0) {
          const firstTx = transactions[transactions.length - 1];
          const lastTx = transactions[0];

          const firstActiveDate = new Date(firstTx.block_timestamp);
          const lastActiveDate = new Date(lastTx.block_timestamp);
          // Total of sent and received
          let sentTotal = 0;
          let receivedTotal = 0;

          transactions.forEach((tx) => {
            if (tx.direction == "outbound") {
              sentTotal += parseFloat(tx.value);
            } else {
              receivedTotal += parseFloat(tx.value);
            }
          });
          // Call API to get the current BTC and ETH price
          const priceResponse = await axios.get(
            "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd"
          );
          const ethPrice = priceResponse.data.ethereum.usd;
          const btcPrice = priceResponse.data.bitcoin.usd;

          const isBTC = isBitcoinAddress(address);
          const balance = parseFloat(lastTx.value);
          const balanceUSD = isBitcoinAddress(address)
            ? (balance * btcPrice).toFixed(2)
            : (balance * ethPrice).toFixed(2);

          // Update userData state
          setUserData({
            balance: parseFloat(lastTx.value).toFixed(5),
            balanceUSD,
            currency: isBTC ? "BTC" : "ETH",
            firstActive: new Date(firstTx.block_timestamp).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              }
            ),
            lastActive: new Date(lastTx.block_timestamp).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              }
            ),
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
        }
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      }
    };
    if (address) {
      fetchData();
    }
  }, [address]);
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
        currency={userData.currency}
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
const DbItem2 = ({ balance, balanceUSD, currency }) => {
  return (
    <div class="container">
      <h1>Balance</h1>
      <div class="info">
        <i class="fas fa-coins icon"></i>
        <span>Balance</span>
      </div>
      <div class="info-balance">
        <p>
          {balance} {currency}
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
