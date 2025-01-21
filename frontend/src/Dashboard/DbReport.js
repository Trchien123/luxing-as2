import React from "react";
import "./ReportTable.css";

const ReportTable = () => {
  const transactions = [
    { id: 1, type: "Swap", usd: 2, amount: "2 ETH", tokenAmount: "1 BTC", wallet: "0x002" },
    { id: 2, type: "Buy", usd: 10, amount: "10 ETH", tokenAmount: "0.5 BTC", wallet: "0xABC" },
    { id: 3, type: "Sell", usd: 5, amount: "5 ETH", tokenAmount: "0.25 BTC", wallet: "0x123" },
    { id: 4, type: "Swap", usd: 8, amount: "3 ETH", tokenAmount: "0.7 BTC", wallet: "0x456" },
    { id: 5, type: "Buy", usd: 15, amount: "6 ETH", tokenAmount: "2 BTC", wallet: "0x789" },
    { id: 6, type: "Swap", usd: 18, amount: "4 ETH", tokenAmount: "1.5 BTC", wallet: "0x111" },
    { id: 7, type: "Sell", usd: 22, amount: "5 ETH", tokenAmount: "2.5 BTC", wallet: "0x222" },
    { id: 8, type: "Buy", usd: 25, amount: "6 ETH", tokenAmount: "3 BTC", wallet: "0x333" },
  ];

  return (
    <div className="report-container">
      <table className="report-table">
        <colgroup>
          <col style={{ width: "5%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "25%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "30%" }} />
        </colgroup>
        <thead>
          <tr>
            <th>#</th>
            <th>Type</th>
            <th>USD</th>
            <th>Amount</th>
            <th>Token Amount</th>
            <th>Wallet</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.type}</td>
              <td>${transaction.usd}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.tokenAmount}</td>
              <td>{transaction.wallet}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;
