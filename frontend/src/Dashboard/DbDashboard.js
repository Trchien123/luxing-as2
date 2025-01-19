import React from "react";
import DbContainer1 from "./DbContainer1";
import DbHomeContainer from "./DbDashboardHome";
import NewsOverview from "./DbNewsOverview";
import BinanceOverview from "./DbBinance";
import DbSendReceiveTable from "./DbSendReceiveTable";
const DbHome = () => {
  const generateNumber = () => {
    const randomNumber = Math.random(); // Generates a number between 0 and 1
    if (randomNumber < 0.07) {
      return 1;
    } else {
      return Math.random() < 0.5 ? 2 : 3; // 1% chance to get either 2 or 3
    }
  };
  const number = generateNumber();
  return (
    <main className="DB-main">
      <DbContainer1 />
      <section className="DB-main-container-2">
        <div
          className="Db-main-2-items Db-main-2-items-1 "
          style={{
            backgroundImage: `url(${require(`../asset/db-background${number}.jpg`)})`,
          }}
        >
          <DbHomeContainer Address={"User's name"} />
        </div>
        <div className="Db-main-2-items Db-main-2-items-2">
          <BinanceOverview title={"Bitcoin"} />
        </div>
        <div className="Db-main-2-items Db-main-2-items-3">
          <NewsOverview />
        </div>
      </section>
      <section className="DB-main-container-2">
        <div className="Db-main-2-items Db-main-2-items-4 "></div>
        <div className="Db-main-2-items Db-main-2-items-5"></div>
      </section>
      <section className="DB-main-container-2">
        <div className="Db-main-2-items Db-main-2-items-6 ">
          <DbSendReceiveTable />
        </div>
      </section>
    </main>
  );
};

export default DbHome;
