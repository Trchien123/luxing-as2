import React, {useState} from "react";
import "./ReportTable.css";

const ReportTable = () => {
  const [hasError, setHasError] = useState(false);
  const [expandedErrorId, setExpandedErrorId] = useState(null); 

  const errorLogs = [
    { id: 1, message: "Error 1: Something went wrong.", details: "This is a long error description. It explains what went wrong in detail. If the error log is too long, it should scroll inside the box." },
    { id: 2, message: "Error 2: Failed to fetch data.", details: "Error 2 occurred due to network issues. Try checking your connection and retrying the request." },
    { id: 3, message: "Error 3: Unexpected server response.", details: "Server returned an invalid response format. Ensure the API is responding correctly and check the logs." },
  ];

  const handleToggleError = () => {
    setHasError(!hasError);
    setExpandedErrorId(null); 
  };

  const toggleSeeMore = (id) => {
    setExpandedErrorId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="report-table-container">
      <div className="lower-box">
        {hasError
          ? "Verification failed, errors found."
          : "Verification complete, no error found."}
      </div>

      {!hasError && (
        <div className="icon-and-log">
          <img src="/icon/approve.png" alt="Approval icon" className="status-icon" />
        </div>
      )}

      {hasError && (
        <div className="error-container">
          {errorLogs.map((error) => (
            <div key={error.id} className={`error-box ${expandedErrorId === error.id ? "expanded" : ""}`}>
              <img src="/icon/error.png" alt="Error icon" className="error-icon" />
              <div className="error-text">
                <span>{error.message}</span>
                {expandedErrorId === error.id && <p className="error-details">{error.details}</p>}
                <button className="see-more-button" onClick={() => toggleSeeMore(error.id)}>
                  {expandedErrorId === error.id ? "See Less" : "See More"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button onClick={handleToggleError} className="toggle-button">
        Toggle Error
      </button>
    </div>
  );
};

// const transactions = [
//   { id: 1, type: "Swap", usd: 2, amount: "2 ETH", tokenAmount: "1 BTC", wallet: "0x002" },
//   { id: 2, type: "Buy", usd: 10, amount: "10 ETH", tokenAmount: "0.5 BTC", wallet: "0xABC" },
//   { id: 3, type: "Sell", usd: 5, amount: "5 ETH", tokenAmount: "0.25 BTC", wallet: "0x123" },
//   { id: 4, type: "Swap", usd: 8, amount: "3 ETH", tokenAmount: "0.7 BTC", wallet: "0x456" },
//   { id: 5, type: "Buy", usd: 15, amount: "6 ETH", tokenAmount: "2 BTC", wallet: "0x789" },
//   { id: 6, type: "Swap", usd: 18, amount: "4 ETH", tokenAmount: "1.5 BTC", wallet: "0x111" },
//   { id: 7, type: "Sell", usd: 22, amount: "5 ETH", tokenAmount: "2.5 BTC", wallet: "0x222" },
//   { id: 8, type: "Buy", usd: 25, amount: "6 ETH", tokenAmount: "3 BTC", wallet: "0x333" },
// ];

// return (
//   <div className="report-container">
//     <table className="report-table">
//       <colgroup>
//         <col style={{ width: "5%" }} />
//         <col style={{ width: "20%" }} />
//         <col style={{ width: "15%" }} />
//         <col style={{ width: "25%" }} />
//         <col style={{ width: "20%" }} />
//         <col style={{ width: "30%" }} />
//       </colgroup>
//       <thead>
//         <tr>
//           <th>#</th>
//           <th>Type</th>
//           <th>USD</th>
//           <th>Amount</th>
//           <th>Token Amount</th>
//           <th>Wallet</th>
//         </tr>
//       </thead>
//       <tbody>
//         {transactions.map((transaction) => (
//           <tr key={transaction.id}>
//             <td>{transaction.id}</td>
//             <td>{transaction.type}</td>
//             <td>${transaction.usd}</td>
//             <td>{transaction.amount}</td>
//             <td>{transaction.tokenAmount}</td>
//             <td>{transaction.wallet}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// );

export default ReportTable;
