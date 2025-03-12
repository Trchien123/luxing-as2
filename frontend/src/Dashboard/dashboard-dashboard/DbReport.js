import React, { useState, useEffect } from "react";
import "../../style/ReportTable.css";

const ReportTable = ({ transactions }) => {
  const [checkState, setCheckState] = useState("checking");
  const [expandedErrorId, setExpandedErrorId] = useState(null);
  const [errorLogs, setErrorLogs] = useState([]);
  const [apiKeys, setApiKeys] = useState({
    ETHERSCAN_API_KEY: "",
    BITQUERY_API_KEY: "",
  });

  const isBitcoinAddress = (address) => {
    return /^(1|3|bc1)[A-Za-z0-9]{25,34}$/.test(address) || /^bc1[A-Za-z0-9]{39,59}$/.test(address);
  };

  // Fetch API keys from backend
  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/keys");
        const keys = await response.json();
        setApiKeys(keys);
      } catch (error) {
        console.error("Failed to fetch API keys:", error);
        setCheckState("error");
        setErrorLogs([{ id: 0, message: "Failed to load API keys", details: error.message }]);
      }
    };
    fetchApiKeys();
  }, []);

  // Fetch EtherScamDB data
  const fetchEtherScamDB = async () => {
    try {
      const response = await fetch("https://raw.githubusercontent.com/MrLuit/EtherScamDB/master/_data/scams.json");
      const data = await response.json();
      return data.map(scam => scam.addresses.map(addr => addr.toLowerCase())).flat();
    } catch (error) {
      console.error("Failed to fetch EtherScamDB:", error);
      return [];
    }
  };

  // BitQuery: Check suspicious Bitcoin activity
  const checkSuspiciousBtc = async (wallet) => {
    const query = {
      query: `
        {
          Bitcoin(network: bitcoin) {
            Outputs(
              where: { Output: { Address: { is: "${wallet}" } } }
              limit: { count: 50 }
            ) {
              Output { Value }
              Transaction { Hash Time }
            }
          }
        }
      `,
    };
    try {
      const response = await fetch("https://graphql.bitquery.io/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": apiKeys.BITQUERY_API_KEY,
        },
        body: JSON.stringify(query),
      });
      const { data } = await response.json();
      const outputs = data?.Bitcoin?.Outputs || [];
      const recentOutputs = outputs.filter(o => {
        const txTime = new Date(o.Transaction.Time);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return txTime > thirtyDaysAgo && parseFloat(o.Output.Value) > 1;
      });
      return recentOutputs.length > 5;
    } catch (error) {
      console.error(`BitQuery BTC check failed for ${wallet}:`, error);
      return false;
    }
  };

  // BitQuery: Check suspicious Ethereum activity
  const checkSuspiciousEth = async (wallet) => {
    const query = {
      query: `
        {
          EVM(network: eth) {
            Transfers(
              where: { Transfer: { Sender: { is: "${wallet}" } } }
              limit: { count: 50 }
            ) {
              Transfer { Amount }
              Block { Time }
            }
          }
        }
      `,
    };
    try {
      const response = await fetch("https://graphql.bitquery.io/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": apiKeys.BITQUERY_API_KEY,
        },
        body: JSON.stringify(query),
      });
      const { data } = await response.json();
      const transfers = data?.EVM?.Transfers || [];
      const recentTransfers = transfers.filter(t => {
        const txTime = new Date(t.Block.Time);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return txTime > thirtyDaysAgo && parseFloat(t.Transfer.Amount) > 10;
      });
      return recentTransfers.length > 10;
    } catch (error) {
      console.error(`BitQuery ETH check failed for ${wallet}:`, error);
      return false;
    }
  };

  useEffect(() => {
    if (!apiKeys.ETHERSCAN_API_KEY || !apiKeys.BITQUERY_API_KEY) return; // Wait for keys to load

    const checkSuspiciousActivity = async () => {
      await new Promise((resolve) => setTimeout(resolve, 10000));

      const newErrorLogs = [];
      let errorFound = false;

      const scamAddresses = await fetchEtherScamDB();

      if (!Array.isArray(transactions) || transactions.length === 0) {
        newErrorLogs.push({
          id: 0,
          message: "No transactions provided",
          details: "The transactions prop is empty or invalid.",
        });
        errorFound = true;
      } else {
        for (const tx of transactions) {
          const wallet = tx.wallet.toLowerCase();
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

          if (scamAddresses.includes(wallet)) {
            newErrorLogs.push({
              id: tx.id,
              message: `Suspicious Transaction #${tx.id}: Known scam Ethereum address`,
              details: `The wallet ${wallet} is listed in EtherScamDB as a known scam or phishing address.`,
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
              const response = await fetch(`https://blockchain.info/rawaddr/${wallet}`, { mode: "cors" });
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
                if (await checkSuspiciousBtc(wallet)) {
                  newErrorLogs.push({
                    id: tx.id,
                    message: `Suspicious Transaction #${tx.id}: Unusual Bitcoin activity`,
                    details: `The wallet ${wallet} shows high Bitcoin transfer volume in the last 30 days, potentially indicating suspicious behavior.`,
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

            await new Promise((resolve) => setTimeout(resolve, 1000));
          }

          if (tx.amount?.includes("ETH") && !tx.tokenAmount?.includes("BTC")) {
            try {
              const response = await fetch(
                `https://api.etherscan.io/api?module=account&action=balance&address=${wallet}&tag=latest&apikey=${apiKeys.ETHERSCAN_API_KEY}`
              );
              const data = await response.json();
              if (data.status !== "1") {
                newErrorLogs.push({
                  id: tx.id,
                  message: `Error in Transaction #${tx.id}: Invalid Ethereum address`,
                  details: `The wallet address ${wallet} is not a valid Ethereum address or failed verification: ${data.message}`,
                });
                errorFound = true;
              } else if (await checkSuspiciousEth(wallet)) {
                newErrorLogs.push({
                  id: tx.id,
                  message: `Suspicious Transaction #${tx.id}: Unusual Ethereum activity`,
                  details: `The wallet ${wallet} shows high Ethereum transfer volume in the last 30 days, potentially indicating suspicious behavior.`,
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
  }, [transactions, apiKeys]);

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