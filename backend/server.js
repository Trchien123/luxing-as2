require("dotenv").config({ path: "./api.env" });

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;
const BITQUERY_URL = "https://graphql.bitquery.io";
const BITQUERY_API_KEY = process.env.BITQUERY_API_KEY;

if (!BITQUERY_API_KEY) {
    console.error("Error: Missing BITQUERY_API_KEY in api.env");
    process.exit(1);
}

app.get("/transactions", async (req, res) => {
  try {
      const { address, type } = req.query;

      if (!address) {
          return res.status(400).json({ error: "Missing Bitcoin address" });
      }

      if (!type || (type !== "inbound" && type !== "outbound")) {
          return res.status(400).json({ error: "Invalid type. Use 'inbound' or 'outbound'." });
      }

      const query = {
          query: `
              query ($network: BitcoinNetwork!, $address: String!, $limit: Int!, $block: Int!, $offset: Int!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
                bitcoin(network: $network) {
                  ${type === "inbound" ? "outputs" : "inputs"}(
                    date: {since: $from, till: $till}
                    ${type === "inbound" ? "outputAddress" : "inputAddress"}: {is: $address}
                    options: {limit: $limit, offset: $offset, desc: ["block.height", "transaction.index"]}
                  ) {
                    block(height: {gt: $block}) {
                      height
                      timestamp {
                        time(format: "%Y-%m-%d %H:%M:%S")
                      }
                    }
                    transaction {
                      hash
                      index
                    }
                    value
                    ${type === "inbound" ? "outputAddress" : "inputAddress"} {
                      address
                    }
                  }
                }
              }
            `,
          variables: {
              network: "bitcoin",
              address: address,
              limit: 100,
              block: 0,
              offset: 0,
              from: "2024-01-01T00:00:00Z",
              till: "2024-12-31T23:59:59Z"
          }
      };

      const response = await axios.post(BITQUERY_URL, query, {
          headers: {
              "Authorization": `Bearer ${BITQUERY_API_KEY}`,
              "Content-Type": "application/json"
          }
      });

      if (!response.data || !response.data.data) {
          return res.status(404).json({ error: "No transactions found" });
      }

      res.json(response.data);
  } catch (error) {
      console.error("Error fetching transactions:", error.response ? error.response.data : error.message);
      res.status(500).json({ error: "Error fetching transactions" });
  }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
