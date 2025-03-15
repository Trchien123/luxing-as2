require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { runNeo4jQuery, runNeo4jQuery2 } = require("./neo4j");

const app = express();
app.use(express.json());

app.use(cors({
  origin: "https://luxing-frontend.vercel.app", // Allow only your frontend
  methods: "GET,POST,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true
}));

app.options("*", cors());

app.get('/api/hello', (req, res) => {
    res.json({ message: "Hello from Vercel backend!" });
});

module.exports = app;

// Fetching API Keys from environment variables
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const BITQUERY_API_KEY = process.env.BITQUERY_API_KEY;
const BLOCKCYPHER_API_KEY = process.env.BLOCKCYPHER_API_KEY;
const CHAINALYSIS_API_KEY = process.env.CHAINALYSIS_API_KEY; // Added Chainalysis API key

app.get("/api/chainalysis/:address", async (req, res) => {
  const { address } = req.params;
  try {
    const response = await axios.get(`https://public.chainalysis.com/api/v1/address/${address}`, { // Verify endpoint
      headers: {
        "X-API-Key":`${CHAINALYSIS_API_KEY}`,
        "Accept": "application/json",
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error(`Chainalysis request failed for ${address}:`, error.message);
    res.status(500).json({ error: error.message });
  }
});
// New endpoint to serve API keys
app.get("/api/keys", (req, res) => {
  console.log("API keys requested");
  res.json({
    ETHERSCAN_API_KEY: ETHERSCAN_API_KEY,
    BITQUERY_API_KEY: BITQUERY_API_KEY,
    BLOCKCYPHER_API_KEY: BLOCKCYPHER_API_KEY,
    CHAINALYSIS_API_KEY: CHAINALYSIS_API_KEY, // Added Chainalysis API key
  });
});

// Existing endpoint: Fetch balance
app.get("/api/balance/:coin/:address", async (req, res) => {
  const { coin, address } = req.params;

  try {
    if (coin.toLowerCase() === "bitcoin" || coin.toLowerCase() === "ethereum") {
      const network = coin.toLowerCase() === "bitcoin" ? "btc/main" : "eth/main";
      const response = await axios.get(
        `https://api.blockcypher.com/v1/${network}/addrs/${address}/balance${BLOCKCYPHER_API_KEY ? `?token=${BLOCKCYPHER_API_KEY}` : ""}`
      );

      return res.json({
        coin,
        address,
        balance: coin === "bitcoin" ? response.data.balance / 1e8 : response.data.balance / 1e18,
      });
    } else {
      return res.status(400).json({ error: "Invalid coin type. Use 'bitcoin' or 'ethereum'." });
    }
  } catch (error) {
    console.error(`Error fetching ${coin} balance:`, error.message);
    return res.status(500).json({ error: `Failed to fetch ${coin} balance` });
  }
});

// Existing endpoint: Fetch crypto price
app.get("/api/crypto-price/:coinName", async (req, res) => {
  const { coinName } = req.params;

  try {
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

// Existing endpoint: Seelecoin transactions
app.get("/api/sel/:address", async (req, res) => {
  const { address } = req.params;
  const query2 = `MATCH (n:Transactions) where n.from_address = "${address}" or n.to_address ="${address}" return n;`;

  try {
    const records = await runNeo4jQuery2(query2, address);
    res.json({ transactions: records });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Existing endpoint: Fetch transactions
app.get("/api/transactions/:address", async (req, res) => {
  const { address } = req.params;
  const API_URL_transactions = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
  const API_URL_token = `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
  const API_URL_NFT = `https://api.etherscan.io/api?module=account&action=tokennfttx&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
  const BITQUERY_API_URL = "https://graphql.bitquery.io";
  const { coin } = req.query;

  if (!coin) {
    return res.status(400).json({ error: "Missing coin type" });
  }

  if (coin.toLowerCase() === "seelecoin") {
    const query = `MATCH (n:Transactions) where n.from_address = "${address}" or n.to_address ="${address}" return n;`;
    try {
      const records = await runNeo4jQuery2(query, address);
      res.json(records);
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
                firstActive { time(format: "%Y-%m-%d %H:%M:%S") }
                lastActive { time(format: "%Y-%m-%d %H:%M:%S") }
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
              sender { address annotation }
              receiver { address annotation }
              amount
              block { timestamp { time(format: "%Y-%m-%d %H:%M:%S") } height }
              transaction { index hash }
            }
            outbound: coinpath(
              initialAddress: {is: $address}
              depth: {lteq: 1}
              options: {direction: outbound, desc: "block.timestamp.time"}
              date: {since: $from, till: $till}
            ) {
              sender { address annotation }
              receiver { address annotation }
              amount
              block { timestamp { time(format: "%Y-%m-%d %H:%M:%S") } height }
              transaction { index hash }
            }
          }
        }
      `,
      variables: {
        network: "bitcoin",
        address: address,
        limit: 100,
        from: null,
        till: null,
      },
    };

    try {
      const response = await axios.post(BITQUERY_API_URL, query, {
        headers: {
          Authorization: `Bearer ${BITQUERY_API_KEY}`,
        },
      });

      if (response.data.errors) {
        res.status(400).json({ error: response.data.errors });
        return;
      }

      const transactions = [
        ...response.data.data.bitcoin.inbound.map((tx) => ({
          hash: tx.transaction.hash,
          from_address: tx.sender.address,
          to_address: tx.receiver.address,
          value: tx.amount,
          block_height: tx.block.height,
          block_timestamp: tx.block.timestamp.time,
          direction: "inbound",
          coin_name: "bitcoin",
        })),
        ...response.data.data.bitcoin.outbound.map((tx) => ({
          hash: tx.transaction.hash,
          from_address: tx.sender.address,
          to_address: tx.receiver.address,
          value: tx.amount,
          block_height: tx.block.height,
          block_timestamp: tx.block.timestamp.time,
          direction: "outbound",
          coin_name: "bitcoin",
        })),
      ];
      const general_info = response.data.data.bitcoin.addressStats.map((tx) => ({
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
      }));

      transactions.sort((a, b) => new Date(b.block_timestamp) - new Date(a.block_timestamp));
      res.json({ transactions, general_info });
    } catch (error) {
      console.error("Error fetching Bitcoin transactions from Bitquery:", error.response ? error.response.data : error.message);
      res.status(500).json({ error: "Error fetching Bitcoin transactions from Bitquery" });
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
          value: (tx.value / 1e18).toFixed(6),
          input: tx.input,
          transaction_index: tx.transactionIndex,
          gas: tx.gas,
          gas_used: tx.gasUsed,
          gas_price: tx.gasPrice,
          transaction_fee: ((tx.gasUsed * tx.gasPrice) / 1e18).toFixed(6),
          block_number: tx.blockNumber,
          block_hash: tx.blockHash,
          block_timestamp: new Date(tx.timeStamp * 1000).toLocaleString(),
          direction: isSender ? "outbound" : "inbound",
          transaction_type: isContractInteraction ? "Contract Interaction" : "ETH Transfer",
          coin_name: "ethereum",
        };
      });

      const tokenTransactions = ethToken.data.result.map((tx) => {
        const isSender = tx.from.toLowerCase() === address.toLowerCase();
        return {
          from_address: tx.from,
          to_address: tx.to,
          hash: tx.hash,
          token_name: tx.tokenName,
          value: (tx.value / Math.pow(10, tx.tokenDecimal)).toFixed(0),
          block_number: tx.blockNumber,
          block_timestamp: new Date(tx.timeStamp * 1000).toLocaleString(),
          direction: isSender ? "outbound" : "inbound",
          transaction_type: "Token Transfer",
          coin_name: "ethereum",
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
          coin_name: "ethereum",
        };
      });

      const transactions = [...ethTransactions, ...tokenTransactions, ...nftTransactions];
      transactions.sort((a, b) => new Date(b.block_timestamp) - new Date(a.block_timestamp));
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions from Etherscan:", error.message);
      res.status(500).json({ error: "Error fetching transactions from Etherscan" });
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