import React, { useState } from "react";
import "../../style/DbTableDrawCircles.css";
import FetchTransactions from "./FetchTransactions.js";

import DrawCircle from "./DbTableDrawCircles.js";
import DashTableContent from "./DbTableContent.js";
import PaginationControl from "./DbTablePaginationcontrol.js"; // Correct path for PaginationControl
import { useOutletContext } from "react-router-dom";

const DashTable = () => {
  const { crypto, response } = useOutletContext();
  console.log(crypto);
  const address = crypto.address;
  const { transactions, loading, error } = response
  const onPageChangeGraph = (newPage) => {
    console.log("Graph page changed to:", newPage);
  };


  const [currentPage, setCurrentPage] = useState(0);
  const totalItems = transactions.length; // Total items for pagination

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  if (error) return <div>Error: {error}</div>;

  return (
    <main className="DB-table">
      <h1 className="Dbtable-title">Exploring Transactions</h1>

      <div className="Dbtable-component">
        <DrawCircle
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          address={address}
          transactions={transactions}
        />{" "}
        {/* Pass props to DrawCircle */}
        <PaginationControl
          onPageChangeGraph={onPageChangeGraph}
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={20}
          onPageChange={handlePageChange}
        />
        <DashTableContent
          onPageChangeGraph={onPageChangeGraph}
          transactions={transactions}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          address={address}
        />
      </div>
    </main>
  );
};

export default DashTable;
