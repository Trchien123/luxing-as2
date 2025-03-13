import React, { useState, useEffect } from "react";
import ReportTable from "./DbReport";

const ReportDis = ({ title, transactions: initialTransactions }) => {
  const [transactions, setTransactions] = useState(initialTransactions || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (initialTransactions && Array.isArray(initialTransactions) && initialTransactions.length > 0) {
      setTransactions(initialTransactions);
      setIsLoading(false);
    } else {
      const fetchTransactions = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(
            `http://localhost:5000/api/transactions/0xd2382e156db14d1b0500a0a0165b07c47927d22a?coin=ethereum`
          );
          if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
          const data = await response.json();
          setTransactions(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error("Fetch error:", error);
          setTransactions([]);
        } finally {
          setIsLoading(false);
        }
      };
      fetchTransactions();
    }
  }, [initialTransactions]);

  console.log("Transactions in ReportDis:", transactions);

  if (isLoading) {
    return <div>Loading transactions...</div>;
  }

  return (
    <div className="binanceOverview">
      <h1 className="Bo--title">{title}</h1>
      <ReportTable transactions={transactions} />
    </div>
  );
};

export default ReportDis;