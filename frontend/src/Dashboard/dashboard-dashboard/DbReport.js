import React, { useState, useEffect, useCallback } from "react";
import "../../style/ReportTable.css";

const DbReport = ({ transactions }) => {
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

  const fetchEtherScamDB = () => {
    return fetch("/scams.json")
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (!Array.isArray(data)) {
          throw new Error("scams.json does not contain a valid array");
        }
        return data
          .filter(scam => Array.isArray(scam.addresses))
          .map(scam => scam.addresses.map(addr => addr.toLowerCase()))
          .flat();
      })
      .catch(error => {
        console.error("Failed to load local EtherScamDB:", error.message);
        return [
          "0x8d08aad4b2bac2bb761ac4781cf62468c9ec47b4",
          "0xb0606f433496bf66338b8ad6b6d51fc4d84a44cd",
          "0x4e6fec28f5316c2829d41bc2187202c70ec75bc7",
          "0xd90e2f925da726b50c4ed8d0fb90ad053324f31b",
        ].map(addr => addr.toLowerCase());
      });
  };

  const checkCryptoScamDB = useCallback(async (wallet) => {
    try {
      const etherScamList = await fetchEtherScamDB();
      return etherScamList.includes(wallet.toLowerCase());
    } catch (error) {
      console.error(`Local scam check failed for ${wallet}:`, error);
      return false;
    }
  }, []);

  const checkEtherscanSuspicious = useCallback(async (wallet) => {
    const knownSafeContracts = [
      "0x253553366da8546fc250f225fe3d25d0c782303b",
      "0x0000000000000000000000000000000000000000",
    ];
    if (knownSafeContracts.includes(wallet.toLowerCase())) {
      return false;
    }

    try {
      const response = await fetch(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${wallet}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKeys.ETHERSCAN_API_KEY}`
      );
      const data = await response.json();
      if (data.status === "1" && data.result.length > 0) {
        const recentTxs = data.result.slice(0, 10);
        const smallTxCount = recentTxs.filter((tx) => parseFloat(tx.value) / 1e18 < 0.01).length;
        const zeroValueTxCount = recentTxs.filter((tx) => parseFloat(tx.value) === 0).length;
        const timestamps = recentTxs.map((tx) => parseInt(tx.timeStamp) * 1000);
        const timeSpan = (timestamps[0] - timestamps[timestamps.length - 1]) / (1000 * 60);
        const highFrequency = timestamps.length >= 10 && timeSpan < 30;
        return (smallTxCount > 7 && highFrequency) || zeroValueTxCount > 5;
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
      console.time("checkSuspiciousActivity");
      const newErrorLogs = [];
      let errorFound = false;

      const walletErrors = new Map();
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
        const checkPromises = transactions.map(async (tx, index) => {
          const wallet = tx.from_address?.toLowerCase();

          if (!wallet || typeof wallet !== "string") {
            return {
              id: tx.id || `unknown-${index}`,
              message: `Error in Transaction #${tx.id || `unknown-${index}`}: Missing or invalid wallet address`,
              details: `Transaction lacks a valid from_address. Received: ${JSON.stringify(tx)}`,
              errorType: "invalid_address",
            };
          }

          if (!walletErrors.has(wallet)) {
            walletErrors.set(wallet, new Set());
          }
          const loggedErrors = walletErrors.get(wallet);

          const errorsForTx = [];

          const usdValue = tx.usd;
          if (usdValue && usdValue > 50000) {
            const errorType = "high_usd_value";
            if (!loggedErrors.has(errorType)) {
              errorsForTx.push({
                id: tx.id || `unknown-${index}`,
                message: `Suspicious Transaction #${tx.id || `unknown-${index}`}: High USD value detected ($${usdValue})`,
                details: `Transaction from ${wallet} has an unusually high value of $${usdValue}.`,
                errorType,
              });
              loggedErrors.add(errorType);
            }
          }

          if (scamAddresses.includes(wallet)) {
            const errorType = "etherscamdb";
            if (!loggedErrors.has(errorType)) {
              errorsForTx.push({
                id: tx.id || `unknown-${index}`,
                message: `Suspicious Transaction #${tx.id || `unknown-${index}`}: Known scam Ethereum address`,
                details: `The wallet ${wallet} is listed in EtherScamDB as a known scam or phishing address.`,
                errorType,
              });
              loggedErrors.add(errorType);
            }
          }

          if (await checkCryptoScamDB(wallet)) {
            const errorType = "cryptoscamdb";
            if (!loggedErrors.has(errorType)) {
              errorsForTx.push({
                id: tx.id || `unknown-${index}`,
                message: `Suspicious Transaction #${tx.id || `unknown-${index}`}: Community-reported scam`,
                details: `The wallet ${wallet} is flagged as suspicious by CryptoScamDB community reports.`,
                errorType,
              });
              loggedErrors.add(errorType);
            }
          }

          if (await checkEtherscanSuspicious(wallet)) {
            const errorType = "etherscan_suspicious";
            if (!loggedErrors.has(errorType)) {
              errorsForTx.push({
                id: tx.id || `unknown-${index}`,
                message: `Suspicious Transaction #${tx.id || `unknown-${index}`}: Flagged by Etherscan`,
                details: `The wallet ${wallet} shows suspicious activity patterns on Etherscan.`,
                errorType,
              });
              loggedErrors.add(errorType);
            }
          }

          if (tx.tokenAmount?.includes("BTC")) {
            if (!isBitcoinAddress(wallet)) {
              const errorType = "invalid_btc_address";
              if (!loggedErrors.has(errorType)) {
                errorsForTx.push({
                  id: tx.id || `unknown-${index}`,
                  message: `Error in Transaction #${tx.id || `unknown-${index}`}: Invalid Bitcoin address format`,
                  details: `The wallet address ${wallet} does not match the expected Bitcoin address format.`,
                  errorType,
                });
                loggedErrors.add(errorType);
              }
            } else {
              try {
                const response = await fetch(`https://blockchain.info/rawaddr/${wallet}`, { mode: "cors" });
                if (!response.ok) {
                  const errorType = "invalid_btc_api";
                  if (!loggedErrors.has(errorType)) {
                    errorsForTx.push({
                      id: tx.id || `unknown-${index}`,
                      message: `Error in Transaction #${tx.id || `unknown-${index}`}: Invalid Bitcoin address`,
                      details: `The wallet address ${wallet} returned an error: ${response.status} - ${response.statusText}`,
                      errorType,
                    });
                    loggedErrors.add(errorType);
                  }
                } else {
                  const data = await response.json();
                  if (data.total_received === 0 && data.total_sent === 0) {
                    const errorType = "inactive_btc_address";
                    if (!loggedErrors.has(errorType)) {
                      errorsForTx.push({
                        id: tx.id || `unknown-${index}`,
                        message: `Warning in Transaction #${tx.id || `unknown-${index}`}: Inactive Bitcoin address`,
                        details: `The Bitcoin address ${wallet} has no recorded transactions.`,
                        errorType,
                      });
                      loggedErrors.add(errorType);
                    }
                  }
                  if (await checkSuspiciousBtc(wallet)) {
                    const errorType = "suspicious_btc_activity";
                    if (!loggedErrors.has(errorType)) {
                      errorsForTx.push({
                        id: tx.id || `unknown-${index}`,
                        message: `Suspicious Transaction #${tx.id || `unknown-${index}`}: Unusual Bitcoin activity`,
                        details: `The wallet ${wallet} shows high Bitcoin transfer volume in the last 30 days.`,
                        errorType,
                      });
                      loggedErrors.add(errorType);
                    }
                  }
                }
              } catch (error) {
                const errorType = "btc_api_failure";
                if (!loggedErrors.has(errorType)) {
                  errorsForTx.push({
                    id: tx.id || `unknown-${index}`,
                    message: `Error in Transaction #${tx.id || `unknown-${index}`}: Bitcoin API failure`,
                    details: `Failed to verify Bitcoin address ${wallet}: ${error.message}`,
                    errorType,
                  });
                  loggedErrors.add(errorType);
                }
              }
            }
          }

          if (tx.amount?.includes("ETH") && !tx.tokenAmount?.includes("BTC")) {
            try {
              const response = await fetch(
                `https://api.etherscan.io/api?module=account&action=balance&address=${wallet}&tag=latest&apikey=${apiKeys.ETHERSCAN_API_KEY}`
              );
              const data = await response.json();
              if (data.status !== "1") {
                const errorType = "invalid_eth_address";
                if (!loggedErrors.has(errorType)) {
                  errorsForTx.push({
                    id: tx.id || `unknown-${index}`,
                    message: `Error in Transaction #${tx.id || `unknown-${index}`}: Invalid Ethereum address`,
                    details: `The wallet address ${wallet} is not valid: ${data.message}`,
                    errorType,
                  });
                  loggedErrors.add(errorType);
                }
              } else if (await checkSuspiciousEth(wallet)) {
                const errorType = "suspicious_eth_activity";
                if (!loggedErrors.has(errorType)) {
                  errorsForTx.push({
                    id: tx.id || `unknown-${index}`,
                    message: `Suspicious Transaction #${tx.id || `unknown-${index}`}: Unusual Ethereum activity`,
                    details: `The wallet ${wallet} shows high Ethereum transfer volume in the last 30 days.`,
                    errorType,
                  });
                  loggedErrors.add(errorType);
                }
              }
            } catch (error) {
              const errorType = "eth_api_failure";
              if (!loggedErrors.has(errorType)) {
                errorsForTx.push({
                  id: tx.id || `unknown-${index}`,
                  message: `Error in Transaction #${tx.id || `unknown-${index}`}: Ethereum API failure`,
                  details: `Failed to verify Ethereum address ${wallet}: ${error.message}`,
                  errorType,
                });
                loggedErrors.add(errorType);
              }
            }
          }

          return { txId: tx.id || `unknown-${index}`, errors: errorsForTx };
        });

        const results = await Promise.all(checkPromises);

        results.forEach(({ txId, errors }) => {
          errors.forEach((error) => {
            if (!newErrorLogs.some((log) => log.id === error.id && log.message === error.message)) {
              newErrorLogs.push(error);
              errorFound = true;
            }
          });
        });
      }

      console.timeEnd("checkSuspiciousActivity");
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
  ]);

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

export default DbReport;