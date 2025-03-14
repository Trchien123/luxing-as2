import React, { useEffect, useState, useCallback } from "react";
import "../../style/sendReceiveTable.css";
import { Link } from "react-router-dom";

const SendReceiveTable = ({
  title,
  crypto,
  transactions,
  address: currentUser,
}) => {
  const [senderData, setSenderData] = useState([]);
  const [receiverData, setReceiverData] = useState([]);

  const shortenAddress = (addr) => {
    if (!addr || addr.length < 10) return addr || "N/A";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const DataProcessing = useCallback(
    (transactions) => {
      const senderValueMap = new Map();
      const receiverValueMap = new Map();

      transactions.forEach((tx) => {
        senderValueMap.set(
          tx.from_address,
          (senderValueMap.get(tx.from_address) || 0) + tx.value
        );
        receiverValueMap.set(
          tx.to_address,
          (receiverValueMap.get(tx.to_address) || 0) + tx.value
        );
      });

      setSenderData(
        [...senderValueMap.entries()]
          .map(([address, totalValue]) => ({
            address,
            totalValue,
          }))
          .filter((entry) => entry.address !== currentUser)
          .sort((a, b) => b.totalValue - a.totalValue)
          .slice(0, 5)
      );

      setReceiverData(
        [...receiverValueMap.entries()]
          .map(([address, totalValue]) => ({
            address,
            totalValue,
          }))
          .filter((entry) => entry.address !== currentUser)
          .sort((a, b) => b.totalValue - a.totalValue)
          .slice(0, 5)
      );
    },
    [currentUser]
  );

  useEffect(() => {
    DataProcessing(transactions);
  }, [transactions, DataProcessing]);

  return (
    <section>
      <h1 className="Bo--title">{title}</h1>
      <div id="table-container">
        <div className="table-wrapper">
          <div className="tbl-header-sender">
            <table cellPadding="0" cellSpacing="0" border="0">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Total Value</th>
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
                    <td>{row.totalValue.toFixed(2)}</td>
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
                  <th>Total Value</th>
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
                    <td>{row.totalValue.toFixed(2)}</td>
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
