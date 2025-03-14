import React, { useState, useEffect, useCallback } from "react";
import "../../style/ReportTable.css";

const DbReport = ({ transactions }) => {
  const [checkState, setCheckState] = useState("checking");
  const [expandedErrorId, setExpandedErrorId] = useState(null);
  const [errorLogs, setErrorLogs] = useState([]);
  const [apiKeys, setApiKeys] = useState({
    ETHERSCAN_API_KEY: "",
    BITQUERY_API_KEY: "",
    CHAINALYSIS_API_KEY: "",
  });

  const MAX_TRANSACTIONS = 10;

  // Hardcoded suspicious accounts
  const SUSPICIOUS_ACCOUNTS = [
    "0x7db57c738b27c5f9b898248385306d30053f54fd", // Lowercase for consistency
    "0x6598a3f7c9583f4aa830e26589d41c05f7008b28",
  ];

  const isBitcoinAddress = (address) => {
    return /^(1|3|bc1)[A-Za-z0-9]{25,34}$/.test(address) || /^bc1[A-Za-z0-9]{39,59}$/.test(address);
  };

  const fetchEtherScamDB = () => {
    return fetch("/scams.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("scams.json does not contain a valid array");
        }
        return data
          .filter((scam) => Array.isArray(scam.addresses))
          .map((scam) => scam.addresses.map((addr) => addr.toLowerCase()))
          .flat();
      })
      .catch((error) => {
        console.error("Failed to load local EtherScamDB:", error.message);
        return [
          "0x8d08aad4b2bac2bb761ac4781cf62468c9ec47b4",
          "0xb0606f433496bf66338b8ad6b6d51fc4d84a44cd",
          "0x4e6fec28f5316c2829d41bc2187202c70ec75bc7",
          "0xd90e2f925da726b50c4ed8d0fb90ad053324f31b",
        ].map((addr) => addr.toLowerCase());
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

  const checkChainalysis = useCallback(async (wallet) => {
    try {
      console.log(`Fetching Chainalysis for ${wallet} with key: ${apiKeys.CHAINALYSIS_API_KEY.slice(0, 4)}...`);
      const response = await fetch(`https://api.chainalysis.com/api/kyt/v1/addresses/${wallet}`, {
        method: "GET",
        headers: {
          "Token": apiKeys.CHAINALYSIS_API_KEY,
          "Accept": "application/json",
        },
        params:{
          address: wallet
        }
      });
      if (!response.ok) {
        throw new Error(`Chainalysis API error! status: ${response.status}, statusText: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(`Chainalysis response for ${wallet}:`, data);
      const isSuspicious = data?.riskScore > 50 || data?.isFlagged || false;
      console.log(`Chainalysis result for ${wallet}: riskScore=${data?.riskScore}, isFlagged=${data?.isFlagged}, suspicious=${isSuspicious}`);
      return isSuspicious;
    } catch (error) {
      console.error(`Chainalysis check failed for ${wallet}:`, error.message);
      return false;
    }
  }, [apiKeys.CHAINALYSIS_API_KEY]);

  const checkSuspiciousBtc = useCallback(
    async (wallet) => {
      const query = {
        query: `
        {
          bitcoin(network: bitcoin) {
            outbound: coinpath(
              initialAddress: { is: "${wallet}" }
              depth: { lteq: 1 }
              options: { direction: outbound }
              limit: { count: 50 }
            ) {
              amount
              block { timestamp { time } }
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
        const transfers = data?.bitcoin?.outbound || [];
        const recentTransfers = transfers.filter((t) => {
          const txTime = new Date(t.block.timestamp.time);
          const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          return txTime > thirtyDaysAgo && parseFloat(t.amount) > 1;
        });
        return recentTransfers.length > 5;
      } catch (error) {
        console.error(`BitQuery BTC check failed for ${wallet}:`, error);
        return false;
      }
    },
    [apiKeys.BITQUERY_API_KEY]
  );

  const checkSuspiciousEth = useCallback(
    async (wallet) => {
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
    },
    [apiKeys.BITQUERY_API_KEY]
  );

  const checkEtherscanSuspicious = useCallback(
    async (wallet) => {
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
    },
    [apiKeys.ETHERSCAN_API_KEY]
  );

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        console.log("Fetching API keys from: http://localhost:5000/api/keys");
        const response = await fetch("http://localhost:5000/api/keys");
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const keys = await response.json();
        console.log("API keys fetched:", keys);
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
    if (!apiKeys.ETHERSCAN_API_KEY || !apiKeys.BITQUERY_API_KEY || !apiKeys.CHAINALYSIS_API_KEY) {
      console.log("Waiting for all API keys...");
      return;
    }

    const checkSuspiciousActivity = async () => {
      console.time("checkSuspiciousActivity");
      const newErrorLogs = [];
      let errorFound = false;

      const scamAddresses = await fetchEtherScamDB();

      if (!Array.isArray(transactions) || transactions.length === 0) {
        newErrorLogs.push({
          id: 0,
          message: "No transactions provided",
          details: "The transactions prop is empty or invalid.",
        });
        setErrorLogs(newErrorLogs);
        setCheckState("error");
        return;
      }

      console.log("Transactions received:", transactions);

      for (const [index, tx] of transactions.entries()) {
        if (index >= MAX_TRANSACTIONS) {
          console.log(`Stopped checking after ${MAX_TRANSACTIONS} transactions`);
          break;
        }

        console.log(`Checking transaction ${index + 1} of ${Math.min(transactions.length, MAX_TRANSACTIONS)}:`, tx);
        const wallet = tx.from_address?.toLowerCase();
        const txId = tx.id || `unknown-${index}`;

        if (!wallet || typeof wallet !== "string") {
          newErrorLogs.push({
            id: txId,
            message: `Error in Transaction #${txId}: Missing or invalid sender address`,
            details: `Transaction lacks a valid from_address. Received: ${JSON.stringify(tx)}`,
            errorType: "invalid_address",
          });
          errorFound = true;
          break;
        }

        // Check hardcoded suspicious accounts first
        if (SUSPICIOUS_ACCOUNTS.includes(wallet)) {
          newErrorLogs.push({
            id: txId,
            message: `Suspicious Transaction #${txId}: Known suspicious sender address`,
            details: `The sender ${wallet} is hardcoded as a known suspicious account.`,
            errorType: "hardcoded_suspicious",
          });
          errorFound = true;
          break;
        }

        if (scamAddresses.includes(wallet)) {
          newErrorLogs.push({
            id: txId,
            message: `Suspicious Transaction #${txId}: Known scam sender address`,
            details: `The sender ${wallet} is listed in EtherScamDB as a known scam or phishing address.`,
            errorType: "etherscamdb",
          });
          errorFound = true;
          break;
        }

        if (await checkChainalysis(wallet)) {
          newErrorLogs.push({
            id: txId,
            message: `Suspicious Transaction #${txId}: Sender flagged by Chainalysis`,
            details: `The sender ${wallet} has been identified as suspicious by Chainalysis.`,
            errorType: "chainalysis_suspicious",
          });
          errorFound = true;
          break;
        }

        if (tx.tokenAmount?.includes("BTC") && isBitcoinAddress(wallet)) {
          if (await checkSuspiciousBtc(wallet)) {
            newErrorLogs.push({
              id: txId,
              message: `Suspicious Transaction #${txId}: Unusual Bitcoin sender activity`,
              details: `The sender ${wallet} shows high Bitcoin transfer volume in the last 30 days.`,
              errorType: "suspicious_btc_activity",
            });
            errorFound = true;
            break;
          }
        } else if (tx.amount?.includes("ETH") && !tx.tokenAmount?.includes("BTC")) {
          if (await checkSuspiciousEth(wallet)) {
            newErrorLogs.push({
              id: txId,
              message: `Suspicious Transaction #${txId}: Unusual Ethereum sender activity`,
              details: `The sender ${wallet} shows high Ethereum transfer volume in the last 30 days.`,
              errorType: "suspicious_eth_activity",
            });
            errorFound = true;
            break;
          }
        }

        if (tx.amount?.includes("ETH") && !tx.tokenAmount?.includes("BTC")) {
          if (await checkEtherscanSuspicious(wallet)) {
            newErrorLogs.push({
              id: txId,
              message: `Suspicious Transaction #${txId}: Sender flagged by Etherscan`,
              details: `The sender ${wallet} shows suspicious activity patterns on Etherscan.`,
              errorType: "etherscan_suspicious",
            });
            errorFound = true;
            break;
          }
        }

        const usdValue = tx.usd;
        if (usdValue && usdValue > 50000) {
          newErrorLogs.push({
            id: txId,
            message: `Suspicious Transaction #${txId}: High USD value sent ($${usdValue})`,
            details: `Sender ${wallet} initiated a transaction with an unusually high value of $${usdValue}.`,
            errorType: "high_usd_value",
          });
          errorFound = true;
          break;
        }

        if (tx.tokenAmount?.includes("BTC") && !isBitcoinAddress(wallet)) {
          newErrorLogs.push({
            id: txId,
            message: `Error in Transaction #${txId}: Invalid Bitcoin sender address format`,
            details: `The sender address ${wallet} does not match the expected Bitcoin address format.`,
            errorType: "invalid_btc_address",
          });
          errorFound = true;
          break;
        }
      }

      console.timeEnd("checkSuspiciousActivity");
      console.log(`Total transactions checked: ${Math.min(transactions.length, MAX_TRANSACTIONS)}`);
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
    checkChainalysis,
    checkCryptoScamDB,
  ]);

  const toggleSeeMore = (id) => {
    setExpandedErrorId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="report-table-container">
      <div className="lower-box">
        {checkState === "checking" && "Checking transactions..."}
        {checkState === "error" && "Verification failed, suspicious sender detected."}
        {checkState === "verified" && "Verification complete, no suspicious senders found."}
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