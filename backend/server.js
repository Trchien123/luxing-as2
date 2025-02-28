require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Fetching API Keys from environment variables
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const BITQUERY_API_KEY = process.env.BITQUERY_API_KEY;

// Fetch Ethereum transactions for an address
app.get("/api/transactions/:address", async (req, res) => {
    const { address } = req.params;
    const API_URL = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
  
    try {
      const response = await axios.get(API_URL);
      console.log("Etherscan Response:", response.data);
  
      if (response.data.status === "1") {
        const transactions = response.data.result.map((tx) => {
          const isSender = tx.from.toLowerCase() === address.toLowerCase();
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
            block_timestamp: new Date(tx.timeStamp * 1000).toISOString(),
            direction: isSender ? "outbound" : "inbound", // Correct direction logic
          };
        });
        res.json(transactions);
      } else {
        res.status(500).json({ error: response.data.message || "Unknown error" });
      }
    } catch (error) {
      console.error("Error fetching transactions from Etherscan:", error.message);
      res.status(500).json({ error: "Error fetching transactions from Etherscan" });
    }
  });

// GraphQL API endpoint for Bitquery
const BITQUERY_API_URL = "https://graphql.bitquery.io";

// Fetch Bitcoin transactions for an address
app.get("/api/bitcoin/transactions/:address", async (req, res) => {
  const { address } = req.params;

  // GraphQL query to get Bitcoin transactions for a specific address
  const query = {
    query: `
      query ($network: BitcoinNetwork!, $address: String!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
        bitcoin(network: $network) {
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
    const response = await axios.post(
      BITQUERY_API_URL,
      query,
      {
        headers: {
          "Authorization": `Bearer ${BITQUERY_API_KEY}`,  // Include API Key in the request headers
        },
      }
    );

    // Check for errors in the response
    if (response.data.errors) {
      res.status(400).json({ error: response.data.errors });
      return;
    }
  
    // Combine inbound and outbound transactions into a single array
    const transactions = [
      ...response.data.data.bitcoin.inbound,
      ...response.data.data.bitcoin.outbound
    ].map((tx) => ({
      hash: tx.transaction.hash,
      from_address: tx.sender.address,
      to_address: tx.receiver.address,
      value: tx.amount, // Convert Satoshis to BTC
      block_height: tx.block.height,
      block_hash: tx.transaction.hash, // Assuming transaction hash represents block hash here, adjust as necessary
      block_timestamp: tx.block.timestamp.time,
    }));
    transactions.sort((a, b) => new Date(b.block_timestamp) - new Date(a.block_timestamp))
  
    res.json(transactions);
    } catch (error) {
    console.error("Error fetching Bitcoin transactions from Bitquery:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Error fetching Bitcoin transactions from Bitquery" });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
