import React from "react";
import "../Dashboard_table/dashTable.css";
import DrawCircle from "../Dashboard_table/drawCircles.js";
import DashTableContent from "../Dashboard_table/dashTableContent.js";

const DashTable = () => {
    return (
        <main className="DB-table">
            <h1 className="Dbtable-title">this is the graph</h1>
            <div className="Dbtable-component">
                <DrawCircle />
                <DashTableContent />
            </div>
        </main>
    )
}
export default DashTable