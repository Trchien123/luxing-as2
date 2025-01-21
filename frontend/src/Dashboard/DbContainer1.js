import React from "react";

const DbContainer1 = () => {
  return (
    <div className="DB-main-container-1">
      <DbItem1 />
      <DbItem2 />
      <DbItem3 />
    </div>
  );
};

export default DbContainer1;

const DbItem1 = () => {
  return (
    <div class="container">
      <h1>Overview</h1>
      <div class="info">
        <i class="fas fa-wallet"></i>
        <span>Address</span>
      </div>
      <div class="info">
        <span>0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97</span>
      </div>
      <div class="dates-container">
        <div class="date">
          <div class="info">
            <i class="fas fa-calendar-alt"></i>
            <span>First active</span>
          </div>
          <span>Nov 15, 2023</span>
          <span class="time">2 years ago</span>
        </div>
        <div class="date">
          <div class="info">
            <i class="fas fa-calendar-check"></i>
            <span>Last active</span>
          </div>
          <span>Jan 1, 2025</span>
          <span class="time">2 minutes ago</span>
        </div>
      </div>
    </div>
  );
};
const DbItem2 = () => {
  return (
    <div class="container">
      <h1>Balance</h1>
      <div class="info">
        <i class="fas fa-coins icon"></i>
        <span>Balance</span>
      </div>
      <div class="info-balance">
        <p>188.91767 ETH</p>
        <span>~ $443,172.52 USD</span>
      </div>
    </div>
  );
};
const DbItem3 = () => {
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
          <span>87,932.4</span>
        </div>
        <div class="amount">
          <div class="info">
            <i class="fa-solid fa-arrow-down"></i>
            <span>Received</span>
          </div>
          <span>127,712.3</span>
        </div>
        <div class="amount">
          <div class="info">
            <i class="fa-solid fa-calculator"></i>
            <span>Total</span>
          </div>
          <span>215,644.7</span>
        </div>
      </div>
    </div>
  );
};
