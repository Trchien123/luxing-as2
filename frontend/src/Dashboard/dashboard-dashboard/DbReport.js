import React, { useState, useEffect, useCallback } from "react";
import "../../style/ReportTable.css";

const ReportTable = ({ transactions }) => { // Removed isChartReady prop
  const [checkState, setCheckState] = useState("checking"); // Start with "checking" instead of "waiting"
  const [expandedErrorId, setExpandedErrorId] = useState(null);
  const [errorLogs, setErrorLogs] = useState([]);
  const [apiKeys, setApiKeys] = useState({
    ETHERSCAN_API_KEY: "",
    BITQUERY_API_KEY: "",
  });

  const isBitcoinAddress = (address) => {
    return /^(1|3|bc1)[A-Za-z0-9]{25,34}$/.test(address) || /^bc1[A-Za-z0-9]{39,59}$/.test(address);
  };

  const fetchEtherScamDB = async () => {
    try {
      const response = await fetch("https://raw.githubusercontent.com/MrLuit/EtherScamDB/master/_data/scams.json");
      const data = await response.json();
      return data.map((scam) => scam.addresses.map((addr) => addr.toLowerCase())).flat();
    } catch (error) {
      console.error("Failed to fetch EtherScamDB:", error);
      return [];
    }
  };

  const checkCryptoScamDB = useCallback(async (wallet) => {
    try {
      const response = await fetch(`http://localhost:5000/api/check-scam/${wallet}`);
      const data = await response.json();
      return data.isScam;
    } catch (error) {
      console.error(`CryptoScamDB check failed for ${wallet}:`, error);
      return false;
    }
  }, []);

  const checkEtherscanSuspicious = useCallback(async (wallet) => {
    try {
      const response = await fetch(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${wallet}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKeys.ETHERSCAN_API_KEY}`
      );
      const data = await response.json();
      if (data.status === "1" && data.result.length > 0) {
        const recentTxs = data.result.slice(0, 10);
        const smallTxCount = recentTxs.filter((tx) => parseFloat(tx.value) / 1e18 < 0.01).length;
        return smallTxCount > 5;
      }
      return false;
    } catch (error) {
      console.error(`Etherscan check failed for ${wallet}:`, error);
      return false;
    }
  }, [apiKeys.ETHERSCAN_API_KEY]);

  const checkSuspiciousBtc = useCallback(async (wallet) => {
    const query = {
      query: `
        {
          bitcoin(network: bitcoin) {
            outputs(
              where: { address: { is: "${wallet}" } }
              limit: { count: 50 }
            ) {
              value
              transaction { hash time }
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
      const outputs = data?.bitcoin?.outputs || [];
      const recentOutputs = outputs.filter((o) => {
        const txTime = new Date(o.transaction.time);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return txTime > thirtyDaysAgo && parseFloat(o.value) > 1;
      });
      return recentOutputs.length > 5;
    } catch (error) {
      console.error(`BitQuery BTC check failed for ${wallet}:`, error);
      return false;
    }
  }, [apiKeys.BITQUERY_API_KEY]);

  const checkSuspiciousEth = useCallback(async (wallet) => {
    const query = {
      query: `
        {
          ethereum(network: eth) {
            transfers(
              where: { from: { is: "${wallet}" } }
              limit: { count: 50 }
            ) {
              amount
              block { time }
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
      const transfers = data?.ethereum?.transfers || [];
      const recentTransfers = transfers.filter((t) => {
        const txTime = new Date(t.block.time);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return txTime > thirtyDaysAgo && parseFloat(t.amount) > 10;
      });
      return recentTransfers.length > 10;
    } catch (error) {
      console.error(`BitQuery ETH check failed for ${wallet}:`, error);
      return false;
    }
  }, [apiKeys.BITQUERY_API_KEY]);

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        console.log("Fetching API keys from: http://localhost:5000/api/keys");
        const response = await fetch("http://localhost:5000/api/keys");
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
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

  useEffect(() => {
    if (!apiKeys.ETHERSCAN_API_KEY || !apiKeys.BITQUERY_API_KEY) return;

    const checkSuspiciousActivity = async () => {
      // Removed artificial delay since no chart dependency
      const newErrorLogs = [];
      let errorFound = false;

      console.log("Transactions received:", transactions);

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
          const wallet = tx.from_address?.toLowerCase();

          if (!wallet || typeof wallet !== "string") {
            console.log("Problematic transaction:", tx);
            newErrorLogs.push({
              id: tx.id || "unknown",
              message: `Error in Transaction #${tx.id || "unknown"}: Missing or invalid wallet address`,
              details: `Transaction lacks a valid from_address. Received: ${JSON.stringify(tx)}`,
            });
            errorFound = true;
            continue;
          }

          const usdValue = tx.usd;
          if (usdValue && usdValue > 50000) {
            newErrorLogs.push({
              id: tx.id || "unknown",
              message: `Suspicious Transaction #${tx.id || "unknown"}: High USD value detected ($${usdValue})`,
              details: `Transaction from ${wallet} has an unusually high value of $${usdValue}.`,
            });
            errorFound = true;
            continue;
          }

          if (scamAddresses.includes(wallet)) {
            newErrorLogs.push({
              id: tx.id || "unknown",
              message: `Suspicious Transaction #${tx.id || "unknown"}: Known scam Ethereum address`,
              details: `The wallet ${wallet} is listed in EtherScamDB as a known scam or phishing address.`,
            });
            errorFound = true;
            continue;
          }

          if (await checkCryptoScamDB(wallet)) {
            newErrorLogs.push({
              id: tx.id || "unknown",
              message: `Suspicious Transaction #${tx.id || "unknown"}: Community-reported scam`,
              details: `The wallet ${wallet} is flagged as suspicious by CryptoScamDB community reports.`,
            });
            errorFound = true;
            continue;
          }

          if (await checkEtherscanSuspicious(wallet)) {
            newErrorLogs.push({
              id: tx.id || "unknown",
              message: `Suspicious Transaction #${tx.id || "unknown"}: Flagged by Etherscan`,
              details: `The wallet ${wallet} shows suspicious activity patterns on Etherscan.`,
            });
            errorFound = true;
            continue;
          }

          if (tx.tokenAmount?.includes("BTC")) {
            if (!isBitcoinAddress(wallet)) {
              newErrorLogs.push({
                id: tx.id || "unknown",
                message: `Error in Transaction #${tx.id || "unknown"}: Invalid Bitcoin address format`,
                details: `The wallet address ${wallet} does not match the expected Bitcoin address format.`,
              });
              errorFound = true;
              continue;
            }

            try {
              const response = await fetch(`https://blockchain.info/rawaddr/${wallet}`, { mode: "cors" });
              if (!response.ok) {
                newErrorLogs.push({
                  id: tx.id || "unknown",
                  message: `Error in Transaction #${tx.id || "unknown"}: Invalid Bitcoin address`,
                  details: `The wallet address ${wallet} returned an error: ${response.status} - ${response.statusText}`,
                });
                errorFound = true;
              } else {
                const data = await response.json();
                if (data.total_received === 0 && data.total_sent === 0) {
                  newErrorLogs.push({
                    id: tx.id || "unknown",
                    message: `Warning in Transaction #${tx.id || "unknown"}: Inactive Bitcoin address`,
                    details: `The Bitcoin address ${wallet} has no recorded transactions.`,
                  });
                  errorFound = true;
                }
                if (await checkSuspiciousBtc(wallet)) {
                  newErrorLogs.push({
                    id: tx.id || "unknown",
                    message: `Suspicious Transaction #${tx.id || "unknown"}: Unusual Bitcoin activity`,
                    details: `The wallet ${wallet} shows high Bitcoin transfer volume in the last 30 days.`,
                  });
                  errorFound = true;
                }
              }
            } catch (error) {
              newErrorLogs.push({
                id: tx.id || "unknown",
                message: `Error in Transaction #${tx.id || "unknown"}: Bitcoin API failure`,
                details: `Failed to verify Bitcoin address ${wallet}: ${error.message}`,
              });
              errorFound = true;
            }
          }

          if (tx.amount?.includes("ETH") && !tx.tokenAmount?.includes("BTC")) {
            try {
              const response = await fetch(
                `https://api.etherscan.io/api?module=account&action=balance&address=${wallet}&tag=latest&apikey=${apiKeys.ETHERSCAN_API_KEY}`
              );
              const data = await response.json();
              if (data.status !== "1") {
                newErrorLogs.push({
                  id: tx.id || "unknown",
                  message: `Error in Transaction #${tx.id || "unknown"}: Invalid Ethereum address`,
                  details: `The wallet address ${wallet} is not valid: ${data.message}`,
                });
                errorFound = true;
              } else if (await checkSuspiciousEth(wallet)) {
                newErrorLogs.push({
                  id: tx.id || "unknown",
                  message: `Suspicious Transaction #${tx.id || "unknown"}: Unusual Ethereum activity`,
                  details: `The wallet ${wallet} shows high Ethereum transfer volume in the last 30 days.`,
                });
                errorFound = true;
              }
            } catch (error) {
              newErrorLogs.push({
                id: tx.id || "unknown",
                message: `Error in Transaction #${tx.id || "unknown"}: Ethereum API failure`,
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
  }, [
    transactions,
    apiKeys,
    checkEtherscanSuspicious,
    checkSuspiciousBtc,
    checkSuspiciousEth,
    checkCryptoScamDB,
  ]); // Removed isChartReady from dependencies

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