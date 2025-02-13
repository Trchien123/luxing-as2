import React from "react";
import BinanceChart from "./DbDashboardBinanceBiChart";
const BinanceOverview = ({ title }) => {
    return (
        <div className="binanceOverview">
            <h1 className="Bo--title">{title}</h1>
            <BinanceChart />
        </div>
    )
}

export default BinanceOverview;