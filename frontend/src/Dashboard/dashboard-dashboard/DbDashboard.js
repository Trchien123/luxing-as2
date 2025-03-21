import React from "react";
import UserOverview from "./DbDashboardUserOverview";
import DbHomeContainer from "./DbDashboardHome";
import NewsOverview from "./DbDashboardNewsOverview";
import BinanceOverview from "./DbDashboardBinance";
import SendReceiveTable from "./DbDashboardSendReceiveTable";
import StatChart from "./DbTranschart";
import ReportDis from "./DbReportdisp";
import { useOutletContext } from "react-router-dom";

const DbHome = () => {
  const { crypto, response } = useOutletContext();
  const { transactions, loading, error } = response;
  const generateNumber = () => {
    const randomNumber = Math.random(); // Generates a number between 0 and 1
    if (randomNumber < 0.07) {
      return 1;
    } else {
      return Math.random() < 0.5 ? 2 : 3; // 1% chance to get either 2 or 3
    }
  };
  const number = generateNumber();
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) return <div className="error-message">Error: {error}</div>;
  return (
    <main className="DB-main">
      <UserOverview
        address={crypto.address}
        transactions={transactions}
        coinName={crypto.name}
        coinId={crypto.id}
      />
      <section className="DB-main-container-2">
        <div
          className="Db-main-2-items Db-main-2-items-1 "
          style={{
            backgroundImage: `url(${require(`../../asset/db-background${number}.jpg`)})`,
          }}
        >
          <DbHomeContainer Address={"User's name"} />
        </div>
        <div className="Db-main-2-items Db-main-2-items-2">
          <BinanceOverview title={crypto.name} />
        </div>
        <div className="Db-main-2-items Db-main-2-items-3">
          <NewsOverview crypto={crypto} />
        </div>
      </section>
      <section className="DB-main-container-2">
        <div className="Db-main-2-items Db-main-2-items-4 ">
          <StatChart title={"Activity"} transactions={transactions} />
        </div>
        <div className="Db-main-2-items Db-main-2-items-5">
          <ReportDis title={"Report"} address={crypto.address} />
        </div>
      </section>
      <section className="DB-main-container-2">
        <div className="Db-main-2-items Db-main-2-items-6 ">
          <SendReceiveTable
            title={"Top Interactive"}
            crypto={crypto}
            transactions={transactions}
            address={crypto.address}
          />
        </div>
      </section>
    </main>
  );
};

export default DbHome;
