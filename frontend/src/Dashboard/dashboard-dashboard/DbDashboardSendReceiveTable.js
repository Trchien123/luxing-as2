import React, { useEffect, useState } from "react";
import "../../style/sendReceiveTable.css";
import { Link } from "react-router-dom";

const SendReceiveTable = ({ crypto, transactions }) => {
  const [senderData, setSenderData] = useState([]);
  const [receiverData, setReceiverData] = useState([]);
  const shortenAddress = (addr) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };
  const DataProcessing = (transactions) => {
    // Create a list of sending and receiving
    const senderMap = new Map();
    const receiverMap = new Map();

    transactions.forEach((tx) => {
      if (tx.direction === "outbound") {
        senderMap.set(
          tx.from_address,
          (senderMap.get(tx.from_address) || 0) + 1
        );
        receiverMap.set(
          tx.to_address,
          (receiverMap.get(tx.to_address) || 0) + 1
        );
      } else {
        senderMap.set(
          tx.from_address,
          (senderMap.get(tx.from_address) || 0) + 1
        );
        receiverMap.set(
          tx.to_address,
          (receiverMap.get(tx.to_address) || 0) + 1
        );
      }
    });

    // Convert data into array and calculate percentage
    const totalSent = [...senderMap.values()].reduce(
      (currentTotal, currentValue) => currentTotal + currentValue,
      0
    ); // array.reduce((accumulator, currentValue) => a+b, 0), 0 is the first value of accumlator
    const totalReceived = [...receiverMap.values()].reduce(
      (currentTotal, currentValue) => currentTotal + currentValue,
      0
    );

    setSenderData(
      [...senderMap.entries()]
        .map(([address, count]) => ({
          address,
          transaction: count,
          percentage: ((count / totalSent) * 100).toFixed(2),
        }))
        .sort((a, b) => b.transaction - a.transaction) //  descending transaction
        .slice(0, 5)
    );

    setReceiverData(
      [...receiverMap.entries()]
        .map(([address, count]) => ({
          address,
          transaction: count,
          percentage: ((count / totalReceived) * 100).toFixed(2),
        }))
        .sort((a, b) => b.transaction - a.transaction)
        .slice(0, 5)
    );
  };
  useEffect(() => {
    DataProcessing(transactions);
  }, [transactions]);

  return (
    <section>
      <div id="table-container">
        <div className="table-wrapper">
          <div className="tbl-header-sender">
            <table cellPadding="0" cellSpacing="0" border="0">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Transaction</th>
                  <th>Percentage</th>
                </tr>
              </thead>
            </table>
          </div>
          <div className="tbl-content-sender">
            <table cellPadding="0" cellSpacing="0" border="0">
              <tbody>
                {senderData.map((row, index) => (
                  <tr key={index}>
                    <td>{shortenAddress(row.address)}</td>
                    <td>{row.transaction}</td>
                    <td>{row.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="table-wrapper">
          <div className="tbl-header-receiver">
            <table cellPadding="0" cellSpacing="0" border="0">
              <thead>
                <tr>
                  <th>Receiver</th>
                  <th>Transaction</th>
                  <th>Percentage</th>
                </tr>
              </thead>
            </table>
          </div>
          <div className="tbl-content-receiver">
            <table cellPadding="0" cellSpacing="0" border="0">
              <tbody>
                {receiverData.map((row, index) => (
                  <tr key={index}>
                    <td>{shortenAddress(row.address)}</td>
                    <td>{row.transaction}</td>
                    <td>{row.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="button-container">
        <Link
          to={`/Dashboard/Table`}
          state={crypto}
          className="more-details-button"
        >
          More Details...
        </Link>
      </div>
    </section>
  );
};

export default SendReceiveTable;
