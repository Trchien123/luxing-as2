import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setSenderData([]);
      setReceiverData([]);
      return;
    }

    const senderValueMap = new Map();
    const receiverValueMap = new Map();

    transactions.forEach((tx) => {
      const value = parseFloat(tx.value) || 0; // ✅ Prevent NaN errors

      if (!tx.from_address || !tx.to_address) return; // ✅ Avoid undefined addresses

      senderValueMap.set(
        tx.from_address,
        (senderValueMap.get(tx.from_address) || 0) + value
      );
      receiverValueMap.set(
        tx.to_address,
        (receiverValueMap.get(tx.to_address) || 0) + value
      );
    });

    const processData = (dataMap) =>
      [...dataMap.entries()]
        .map(([address, totalValue]) => ({ address, totalValue }))
        .filter(
          (entry) => entry.address !== currentUser && entry.totalValue > 0
        )
        .sort((a, b) => b.totalValue - a.totalValue)
        .slice(0, 5);

    setSenderData(processData(senderValueMap));
    setReceiverData(processData(receiverValueMap));
  }, [transactions, currentUser]);

  return (
    <section>
      <h1 className="Bo--title">{title}</h1>
      <div id="table-container">
        <div className="table-wrapper">
          <div className="tbl-header-sender">
            <table>
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Total Value</th>
                </tr>
              </thead>
            </table>
          </div>
          <div className="tbl-content-sender">
            <table>
              <tbody>
                {senderData.map((row, index) => (
                  <tr key={index}>
                    <td>{shortenAddress(row.address)}</td>
                    <td>{row.totalValue.toFixed(2)}</td>{" "}
                    {/* ✅ Format to 4 decimal places */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="table-wrapper">
          <div className="tbl-header-receiver">
            <table>
              <thead>
                <tr>
                  <th>Receiver</th>
                  <th>Total Value</th>
                </tr>
              </thead>
            </table>
          </div>
          <div className="tbl-content-receiver">
            <table>
              <tbody>
                {receiverData.map((row, index) => (
                  <tr key={index}>
                    <td>{shortenAddress(row.address)}</td>
                    <td>{row.totalValue.toFixed(2)}</td>{" "}
                    {/* ✅ Format to 4 decimal places */}
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
