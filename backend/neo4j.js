require("dotenv").config({ path: "./.env" });

var neo4j = require("neo4j-driver");

// URI examples: 'neo4j://localhost', 'neo4j+s://xxx.databases.neo4j.io'
const URI = process.env.NEO4J_URI;
const USER = process.env.NEO4J_USERNAME;
const PASSWORD = process.env.NEO4J_PASSWORD;
const DATABASE = process.env.AURA_INSTANCENAME
const query = "MATCH p=()-[r:`TRANSACTION`]->() RETURN p,r ;"
async function runNeo4Query(query) {
  const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
  let session;

  try {
    session = driver.session();
    const serverInfo = await driver.getServerInfo();
    console.log("connection established");
    console.log(serverInfo);

    const result = await session.run(query);
    const records = result.records.map((record) => {
      const path = record.get("p");
      const relationship = record.get("r");
      return {
        path: path,
        relationship: relationship.properties,
      };
    });
    return records;
  } catch (err) {
    console.error(`Conenction error \n${err}Cause: ${err.cause}`);
    throw err;
  } finally {
    if (session) {
      await session.close();
    }
    driver.close();
  }
}

// (async () => {
//   const query = "MATCH p=()-[r:`TRANSACTION`]->() RETURN p,r ;";
//   try {
//     const records = await runNeo4Query(query);
//     records.forEach((record) => {
//       console.log("Path:", record.path);
//       console.log("Relationship:", record.relationship);
//     });
//   } catch (err) {
//     console.error(err);
//   }
// })();

const moment = require("moment")
async function runNeo4jQuery(query, referenceAddress) {
  const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
  const session = driver.session({ database: "neo4j" }); // Default to "neo4j" if DATABASE is unset

  try {
    const result = await session.run(query);
    const transformedRecords = result.records.flatMap((record) => {
      const path = record.get("p");

      return path.segments.map((seg) => {
        const fromAddress = seg.start.properties.addressId;
        const toAddress = seg.end.properties.addressId;

        // Log the addresses for debugging
        console.log("Reference address", referenceAddress);
        console.log("From address", fromAddress);
        console.log("To Address:", toAddress);
        return {
          hash: seg.relationship.properties.hash,
          from_address: seg.start.properties.addressId, // Assuming 'addressId' is the key
          to_address: seg.end.properties.addressId,     // Assuming 'addressId' is the key
          value: seg.relationship.properties.value / 1e18, // Convert wei to ETH
          block_hash: seg.relationship.properties.block_hash,
          block_number: seg.relationship.properties.block_number,
          block_timestamp: seg.relationship.properties.block_timestamp
            ? moment.unix(Number(seg.relationship.properties.block_timestamp)).utc().format('YYYY-MM-DD HH:mm:ss')
            : "unknown", // Fallback if timestamp is missing,
          gas_used: seg.relationship.properties.gas_used,
          gas_price: seg.relationship.properties.gas_price,
          transaction_fee: seg.relationship.properties.transaction_fee / 1e18,
          coin_name: "seelecoin"
        }
      }

      );
    });

    console.log("Transformed result:", JSON.stringify(transformedRecords, null, 2));
    return transformedRecords;

  } catch (err) {
    console.error(`Connection error: ${err.message}`);
    throw err;
  } finally {
    await session.close();
    await driver.close();
  }
}
async function runNeo4jQuery2(query, referenceAddress) {
  const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
  const session = driver.session({ database: "neo4j" }); // Default to "neo4j" if DATABASE is unset

  try {
    const result = await session.run(query);

    const transformedRecords = result.records.map((record) => {
      const path = record.get("n");
      const direction = path.properties.from_address === referenceAddress ? "outbound" : "inbound";
      return {

        from_address: path.properties.from_address.toString(),
        to_address: path.properties.to_address.toString(),
        hash: path.properties.hash.toString(),
        value: (path.properties.value / 1e18).toString(), // Convert wei to ETH
        input: path.properties.input.toString(),
        transaction_index: path.properties.transaction_index.toString(),
        gas: path.properties.gas.toString(),
        gas_used: path.properties.gas_used.toString(),
        gas_price: path.properties.gas_price.toString(),
        block_hash: path.properties.block_hash.toString(),
        block_number: path.properties.block_number.toString(),
        block_timestamp: path.properties.block_timestamp ? moment.unix(Number(path.properties.block_timestamp)).utc().format('YYYY-MM-DD, HH:mm:ss') : "Unknown",
        transaction_fee: (path.properties.transaction_fee / 1e18).toString(),
        direction: direction,
        coin_name: "seelecoin"
      }
    });
    console.log(transformedRecords)
    return transformedRecords

  } catch (err) {
    console.error(`Connection error: ${err.message}`);
    throw err;
  } finally {
    await session.close();
    await driver.close();
  }
}
// Run the query


module.exports = { runNeo4jQuery, runNeo4jQuery2 }