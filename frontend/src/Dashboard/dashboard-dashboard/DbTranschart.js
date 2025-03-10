import React from "react";
import TransChart from "./DbTranscount";
const StatChart = ({ title, transactions }) => {
    return (
        <div className="transview">
            <h1 className="Bo--title">{title}</h1>
            <TransChart transactions={transactions} />
        </div>
    )
}

export default StatChart;