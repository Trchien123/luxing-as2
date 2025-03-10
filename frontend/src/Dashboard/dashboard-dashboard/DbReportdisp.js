import React from "react";
import ReportTable from "./DbReport";
const ReportDis = ({ title, transactions }) => {
    console.log(transactions)
    return (
        <div className="binanceOverview">
            <h1 className="Bo--title">{title}</h1>
            <ReportTable transactions={transactions} />
        </div>
    )
}

export default ReportDis;