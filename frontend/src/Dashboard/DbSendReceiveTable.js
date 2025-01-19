import React from "react";
import "../style/sendReceiveTable.css";

const SendReceiveTable = () => {
  return (
    <section id="table-container">
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
              <tr>
                <td>0x7842a8...3c2e323</td>
                <td>87388</td>
                <td>39.3%</td>
              </tr>
              <tr>
                <td>0x7842a8...3c2e323</td>
                <td>3745</td>
                <td>20.34%</td>
              </tr>
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
              <tr>
                <td>0x7842a8...3c2e323</td>
                <td>87388</td>
                <td>39.3%</td>
              </tr>
              <tr>
                <td>0x7842a8...3c2e323</td>
                <td>3745</td>
                <td>20.34%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default SendReceiveTable;
