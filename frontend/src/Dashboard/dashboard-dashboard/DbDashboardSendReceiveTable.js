import React, { useEffect, useState } from "react";
import "../../style/sendReceiveTable.css";
import { Link } from "react-router-dom";
import axios from "axios"; // thư viện giúp gửi HTTP request để lấy dữ liệu từ backend.

const shortenAddress = (address) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const SendReceiveTable = ({ crypto }) => {
  // mảng rỗng để lưu danh sách người gửi/nhận
  const [senderData, setSenderData] = useState([]);
  const [receiverData, setReceiverData] = useState([]);

  useEffect(() => {
    // fetch dữ liệu từ backend
    const fetchTransactions = async () => {
      try {
        // Thay đổi địa chỉ ví cần lấy dữ liệu
        const user = "0x4047252A11dEfE9E7F62A3Fe9d23A102c84c6D2F";

        const response = await axios.get(
          `http://localhost:5000/api/transactions/${user}`
        ); // gửi http get request cho backend và gán vào response
        const transactions = response.data; // lưu vào transactions

        // Tạo danh sách tổng hợp số lần gửi/nhận
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

        // Chuyển dữ liệu thành mảng và tính phần trăm
        const totalSent = [...senderMap.values()].reduce(
          (currentTotal, currentValue) => currentTotal + currentValue,
          0
        ); // array.reduce((accumulator, currentValue) => a+b, 0), 0 đại diện cho giá trị ban đầu của accumlator (currentTotal)
        const totalReceived = [...receiverMap.values()].reduce(
          (currentTotal, currentValue) => currentTotal + currentValue,
          0
        );

        setSenderData(
          [...senderMap.entries()].map(([address, count]) => ({
            address,
            transaction: count,
            percentage: ((count / totalSent) * 100).toFixed(2),
          }))
        );

        setReceiverData(
          [...receiverMap.entries()].map(([address, count]) => ({
            address,
            transaction: count,
            percentage: ((count / totalReceived) * 100).toFixed(2),
          }))
        );
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

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
