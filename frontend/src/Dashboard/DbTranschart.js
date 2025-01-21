import React from "react";
import TransChart from "./DbTranscount";
const StatChart = ({ title }) => {
    return (
        <div className="binanceOverview">
            <h1 className="Bo--title">{title}</h1>
            <TransChart />
        </div>
    )
}

export default StatChart;