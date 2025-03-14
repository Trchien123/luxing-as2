import React from "react";
import ReportTable from "./DbReport";

const ReportDis = ({ title, address}) => {
  return (
    <div className="binanceOverview">
      <h1 className="Bo--title">{title}</h1>
        <ReportTable address={address} />
    </div>
  );
};

export default ReportDis;