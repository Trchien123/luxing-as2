import React, { useState, useEffect } from "react";
import "../../style/ReportTable.css";

const ReportTable = ({ transactions }) => {
  const [checkState, setCheckState] = useState("checking"); // "checking", "error", "verified"
  const [expandedErrorId, setExpandedErrorId] = useState(null);
  const [errorLogs, setErrorLogs] = useState([]);

  const isBitcoinAddress = (address) => {
    return /^(1|3|bc1)[A-Za-z0-9]{25,34}$/.test(address) || /^bc1[A-Za-z0-9]{39,59}$/.test(address);
  };

  useEffect(() => {
    const checkSuspiciousActivity = async () => {
      // Wait 10 seconds before showing results
      await new Promise((resolve) => setTimeout(resolve, 10000));

      const newErrorLogs = [];
      let errorFound = false;

      if (!Array.isArray(transactions) || transactions.length === 0) {
        newErrorLogs.push({
          id: 0,
          message: "No transactions provided",
          details: "The transactions prop is empty or invalid.",
        });
        errorFound = true;
      } else {
        for (const tx of transactions) {
          const wallet = tx.wallet;
          const usdValue = tx.usd;

          if (usdValue > 50000) {
            newErrorLogs.push({
              id: tx.id,
              message: `Suspicious Transaction #${tx.id}: High USD value detected ($${usdValue})`,
              details: `Transaction with wallet ${wallet} has an unusually high value of $${usdValue}. This exceeds the threshold of $50,000 and may indicate suspicious activity.`,
            });
            errorFound = true;
            continue;
          }

          if (tx.tokenAmount?.includes("BTC")) {
            if (!isBitcoinAddress(wallet)) {
              newErrorLogs.push({
                id: tx.id,
                message: `Error in Transaction #${tx.id}: Invalid Bitcoin address format`,
                details: `The wallet address ${wallet} does not match the expected Bitcoin address format (e.g., starts with 1, 3, or bc1).`,
              });
              errorFound = true;
              continue;
            }

            try {
              const response = await fetch(`https://blockchain.info/rawaddr/${wallet}`, {
                mode: "cors",
              });
              if (!response.ok) {
                newErrorLogs.push({
                  id: tx.id,
                  message: `Error in Transaction #${tx.id}: Invalid Bitcoin address`,
                  details: `The wallet address ${wallet} returned an error from the blockchain: ${response.status} - ${response.statusText}`,
                });
                errorFound = true;
              } else {
                const data = await response.json();
                if (data.total_received === 0 && data.total_sent === 0) {
                  newErrorLogs.push({
                    id: tx.id,
                    message: `Warning in Transaction #${tx.id}: Inactive Bitcoin address`,
                    details: `The Bitcoin address ${wallet} has no recorded transactions. This might be a new or unused address.`,
                  });
                  errorFound = true;
                }
              }
            } catch (error) {
              newErrorLogs.push({
                id: tx.id,
                message: `Error in Transaction #${tx.id}: Bitcoin API failure`,
                details: `Failed to verify Bitcoin address ${wallet}: ${error.message}. Check rate limits or network connectivity.`,
              });
              errorFound = true;
            }

            await new Promise((resolve) => setTimeout(resolve, 1000)); // Rate limit delay
          }

          if (tx.amount?.includes("ETH") && !tx.tokenAmount?.includes("BTC")) {
            try {
              const response = await fetch(
                `https://api.etherscan.io/api?module=account&action=balance&address=${wallet}&tag=latest&apikey=YOUR_ETHERSCAN_API_KEY`
              );
              const data = await response.json();
              if (data.status !== "1") {
                newErrorLogs.push({
                  id: tx.id,
                  message: `Error in Transaction #${tx.id}: Invalid Ethereum address`,
                  details: `The wallet address ${wallet} is not a valid Ethereum address or failed verification: ${data.message}`,
                });
                errorFound = true;
              }
            } catch (error) {
              newErrorLogs.push({
                id: tx.id,
                message: `Error in Transaction #${tx.id}: Ethereum API failure`,
                details: `Failed to verify Ethereum address ${wallet}: ${error.message}`,
              });
              errorFound = true;
            }
          }
        }
      }

      setErrorLogs(newErrorLogs);
      setCheckState(errorFound ? "error" : "verified");
    };

    checkSuspiciousActivity();
  }, [transactions]);

  const toggleSeeMore = (id) => {
    setExpandedErrorId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="report-table-container">
      <div className="lower-box">
        {checkState === "checking" && "Checking transactions..."}
        {checkState === "error" && "Verification failed, errors found."}
        {checkState === "verified" && "Verification complete, no error found."}
      </div>

      {checkState === "verified" && (
        <div className="icon-and-log">
          <img src={require("../../asset/approve.png")} alt="Approval icon" className="status-icon" />
        </div>
      )}

      {checkState === "error" && (
        <div className="error-container">
          {errorLogs.map((error) => (
            <div key={error.id} className={`error-box ${expandedErrorId === error.id ? "expanded" : ""}`}>
              <img src={require("../../asset/error.png")} alt="Error icon" className="error-icon" />
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
    </div>
  );
};

export default ReportTable;