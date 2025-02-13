import React from "react";
import ReportTable from "./DbReport";
const ReportDis = ({ title }) => {
    return (
        <div className="binanceOverview">
            <h1 className="Bo--title">{title}</h1>
            <ReportTable />
        </div>
    )
}

export default ReportDis;