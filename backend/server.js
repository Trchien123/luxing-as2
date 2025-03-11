require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { runNeo4jQuery } = require("./neo4j");
const app = express();
app.use(cors());
app.use(express.json());

// Fetching API Keys from environment variables
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const BITQUERY_API_KEY = process.env.BITQUERY_API_KEY;
const BLOCKCYPHER_API_KEY = process.env.BLOCKCYPHER_API_KEY;
app.get("/api/balance/:coin/:address", async (req, res) => {
  const { coin, address } = req.params;

  try {
    if (coin.toLowerCase() === "bitcoin" || coin.toLowerCase() === "ethereum") {
      // BlockCypher uses "btc/main" for Bitcoin and "eth/main" for Ethereum
      const network =
        coin.toLowerCase() === "bitcoin" ? "btc/main" : "eth/main";

      const response = await axios.get(
        `https://api.blockcypher.com/v1/${network}/addrs/${address}/balance${
          BLOCKCYPHER_API_KEY ? `?token=${BLOCKCYPHER_API_KEY}` : ""
        }`
      );

      return res.json({
        coin,
        address,
        balance:
          coin === "bitcoin"
            ? response.data.balance / 1e8
            : response.data.balance / 1e18, // Convert Wei (ETH) or Satoshis (BTC) to standard units
      });
    } else {
      return res
        .status(400)
        .json({ error: "Invalid coin type. Use 'bitcoin' or 'ethereum'." });
    }
  } catch (error) {
    console.error(`Error fetching ${coin} balance:`, error.message);
    return res.status(500).json({ error: `Failed to fetch ${coin} balance` });
  }
});
app.get("/api/crypto-price/:coinName", async (req, res) => {
  const { coinName } = req.params; // Get coin ID from request URL

  try {
    // Fetch current price in USD from CoinGecko
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinName}&vs_currencies=usd`
    );

    if (response.data[coinName] && response.data[coinName].usd) {
      res.json({ coin: coinName, price: response.data[coinName].usd });
    } else {
      res.status(404).json({ error: "Invalid coin name or no price found" });
    }
  } catch (error) {
    console.error("Error fetching CoinGecko data:", error.message);
    res.status(500).json({ error: "Failed to fetch cryptocurrency price" });
  }
});

app.get("/api/sel/:address", async (req, res) => {
  const { address } = req.params;

  const query =
    req.query.q ||
    `MATCH p=(n)-[:TRANSACTION]->() 
    WHERE n.addressId = "${address}"  
    RETURN p`;
  try {
    const records = await runNeo4jQuery(query);
    res.json({
      success: true,
      data: records,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fetch transactions for an address
app.get("/api/transactions/:address", async (req, res) => {
  const { address } = req.params;
  const API_URL_transactions = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
  const API_URL_token = `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
  const API_URL_NFT = `https://api.etherscan.io/api?module=account&action=tokennfttx&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
  const API_URL_ERC1155 = `https://api.etherscan.io/api?module=account&action=token1155tx&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
  const API_URL_internal = `https://api.etherscan.io/api?module=account&action=txlistinternal&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
  const BITQUERY_API_URL = "https://graphql.bitquery.io";
  const { coin } = req.query;

  if (!coin) {
    return res.status(400).json({ error: "Missing coin type" });
  }
  if (coin.toLowerCase() === "seelecoin") {
    const { address } = req.params;

    const query =
      req.query.q ||
      `MATCH p=(n)-[:TRANSACTION]->(m) 
    WHERE n.addressId = "${address}"  
    RETURN p`;
    try {
      const records = await runNeo4jQuery(query, address);
      res.json({
        transactions: records,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (coin.toLowerCase() === "bitcoin") {
    const query = {
      query: `
        query ($network: BitcoinNetwork!, $address: String!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
          bitcoin(network: $network) {
            addressStats(address: {is: $address}) {
              address {
                balance
                firstActive {
                  time(format: "%Y-%m-%d %H:%M:%S")
                }
                lastActive {
                  time(format: "%Y-%m-%d %H:%M:%S")
                }
                inboundTransactions
                inflows
                outboundTransactions
                outflows
                uniqueReceivers
                uniqueSenders
                uniqueDaysWithTransfers
              }
            }
            inbound: coinpath(
              initialAddress: {is: $address}
              depth: {lteq: 1}
              options: {direction: inbound, desc: "block.timestamp.time"}
              date: {since: $from, till: $till}
            ) {
              sender {
                address
                annotation
              }
              receiver {
                address
                annotation
              }
              amount
              block {
                timestamp {
                  time(format: "%Y-%m-%d %H:%M:%S")
                }
                height
              }
              transaction {
                index
                hash
              }
            }
            outbound: coinpath(
              initialAddress: {is: $address}
              depth: {lteq: 1}
              options: {direction: outbound, desc: "block.timestamp.time"}
              date: {since: $from, till: $till}
            ) {
              sender {
                address
                annotation
              }
              receiver {
                address
                annotation
              }
              amount
              block {
                timestamp {
                  time(format: "%Y-%m-%d %H:%M:%S")
                }
                height
              }
              transaction {
                index
                hash
              }
            }
          }
        }
      `,
      variables: {
        network: "bitcoin", // You may need to pass the network if it's dynamic
        address: address, // Replace with actual address or pass dynamically
        limit: 100, // Limit the number of transactions (adjust as needed)
        from: null, // Example date range, adjust as needed
        till: null, // Example date range, adjust as needed
      },
    };

    try {
      const response = await axios.post(BITQUERY_API_URL, query, {
        headers: {
          Authorization: `Bearer ${BITQUERY_API_KEY}`, // Include API Key in the request headers
        },
      });

      // Check for errors in the response
      if (response.data.errors) {
        res.status(400).json({ error: response.data.errors });
        return;
      }

      // Combine inbound and outbound transactions into a single array
      const transactions = [
        ...response.data.data.bitcoin.inbound.map((tx) => ({
          hash: tx.transaction.hash,
          from_address: tx.sender.address,
          to_address: tx.receiver.address,
          value: tx.amount, // Value in BTC
          block_height: tx.block.height,
          block_timestamp: tx.block.timestamp.time,
          direction: "inbound", // Explicitly mark as inbound
          coin_name: "bitcoin",
        })),
        ...response.data.data.bitcoin.outbound.map((tx) => ({
          hash: tx.transaction.hash,
          from_address: tx.sender.address,
          to_address: tx.receiver.address,
          value: tx.amount, // Value in BTC
          block_height: tx.block.height,
          block_timestamp: tx.block.timestamp.time,
          direction: "outbound", // Explicitly mark as outbound
          coin_name: "bitcoin",
        })),
      ];
      const general_info = [
        ...response.data.data.bitcoin.addressStats.map((tx) => ({
          address: tx.address.address,
          first_active: tx.address.firstActive.time,
          last_active: tx.address.lastActive.time,
          balance: tx.address.balance,
          inbound_transactions: tx.address.inboundTransactions,
          inflows: tx.address.inflows,
          outbound_transactions: tx.address.outboundTransactions,
          outflows: tx.address.outflows,
          unique_receivers: tx.address.uniqueReceivers,
          unique_senders: tx.address.uniqueSenders,
          unique_days: tx.address.uniqueDaysWithTransfers,
        })),
      ];

      // Sort transactions by most recent first
      transactions.sort(
        (a, b) => new Date(b.block_timestamp) - new Date(a.block_timestamp)
      );

        res.json({ transactions, general_info });
      } catch (error) {
        console.error(
          "Error fetching Bitcoin transactions from Bitquery:",
          error.response ? error.response.data : error.message
        );
        res
          .status(500)
          .json({ error: "Error fetching Bitcoin transactions from Bitquery" });
      }
    } else if (coin.toLowerCase() === "ethereum") {
      try {
        const ethResponse = await axios.get(API_URL_transactions);
        const ethToken = await axios.get(API_URL_token);
        const ethNft = await axios.get(API_URL_NFT);

        const ethTransactions = ethResponse.data.result.map((tx) => {
          const isSender = tx.from.toLowerCase() === address.toLowerCase();
          const isContractInteraction = tx.input !== "0x";
          return {
            from_address: tx.from,
            to_address: tx.to,
            hash: tx.hash,
            value: (tx.value / 1e18).toFixed(6), // Convert Wei to ETH
            input: tx.input,
            transaction_index: tx.transactionIndex,
            gas: tx.gas,
            gas_used: tx.gasUsed,
            gas_price: tx.gasPrice,
            transaction_fee: ((tx.gasUsed * tx.gasPrice) / 1e18).toFixed(6),
            block_number: tx.blockNumber,
            block_hash: tx.blockHash,
            block_timestamp: new Date(tx.timeStamp * 1000).toLocaleString(),
            direction: isSender ? "outbound" : "inbound", // Correct direction logic
            transaction_type: isContractInteraction ? "Contract Interaction" : "ETH Transfer",
            coin_name: "ethereum"
          };
        });

        const tokenTransactions = ethToken.data.result.map((tx) => {
          const isSender = tx.from.toLowerCase() === address.toLowerCase();
          return {
            from_address: tx.from,
            to_address: tx.to,
            hash: tx.hash,
            token_name: tx.tokenName,
            value: (tx.value / Math.pow(10, tx.tokenDecimal)).toFixed(0), // Convert token value
            block_number: tx.blockNumber,
            block_timestamp: new Date(tx.timeStamp * 1000).toLocaleString(),
            direction: isSender ? "outbound" : "inbound",
            transaction_type: "Token Transfer",
            coin_name: "ethereum"
          };
        });

        const nftTransactions = ethNft.data.result.map((tx) => {
          const isSender = tx.from.toLowerCase() === address.toLowerCase();
          return {
            from_address: tx.from,
            to_address: tx.to,
            hash: tx.hash,
            nft_name: tx.tokenName,
            nft_id: tx.tokenID,
            block_number: tx.blockNumber,
            block_timestamp: new Date(tx.timeStamp * 1000).toLocaleString(),
            direction: isSender ? "outbound" : "inbound",
            transaction_type: "NFT Transfer",
            coin_name: "ethereum"
          };
        });

        const transactions = [...ethTransactions, ...tokenTransactions, ...nftTransactions];
        transactions.sort((a, b) => new Date(b.block_timestamp) - new Date(a.block_timestamp));
        res.json(transactions);
      } catch (error) {
        console.error("Error fetching transactions from Etherscan:", error.message);
        res
          .status(500)
          .json({ error: response.data.message || "Unknown error" });
      }
    } catch (error) {
      console.error(
        "Error fetching transactions from Etherscan:",
        error.message
      );
      res
        .status(500)
        .json({ error: "Error fetching transactions from Etherscan" });
    }
  } else {
    return res.status(400).json({ error: "Invalid coin type" });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
