require("dotenv").config({ path: "./api.env" });

var neo4j = require("neo4j-driver");

// URI examples: 'neo4j://localhost', 'neo4j+s://xxx.databases.neo4j.io'
const URI = process.env.NEO4J_URI;
const USER = process.env.NEO4J_USER;
const PASSWORD = process.env.NEO4J_PASSWORD;

// (async () => {

//     let driver

//     try {
//         driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD))
//         const serverInfo = await driver.getServerInfo()

//         console.log('Connection established')
//         console.log(serverInfo)

//         const session = driver.session()
//         const query = 'MATCH p=()-[r:`CREATE TRANSACTION`]->() RETURN p,r ;'

//         const result = await session.run(query)

//         result.records.forEach(record => {
//             console.log(record.get('p'));
//             console.log(record.get('r'));
//         })
//         await session.close()
//     } catch (err) {
//         console.log(`Connection error\n${err}\nCause: ${err.cause}`)
//     } finally {
//         await driver.close()
//     }
// })();

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

(async () => {
  const query = "MATCH p=()-[r:`CREATE TRANSACTION`]->() RETURN p,r ;";
  try {
    const records = await runNeo4Query(query);
    records.forEach((record) => {
      console.log("Path:", record.path);
      console.log("Relationship:", record.relationship);
    });
  } catch (err) {
    console.error(err);
  }
})();
