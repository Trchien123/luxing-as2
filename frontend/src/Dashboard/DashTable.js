import React from "react";
import "../Dashboard_table/dashTable.css";
import DrawCircle from "../Dashboard_table/drawCircles.js";

const DashTable = () => {
    return (
        <main className="DB-table">
            <h1 className="Dbtable-title">this is the graph</h1>
            <div className="Dbtable-component">
                <DrawCircle />
            </div>
        </main>
    )
}
export default DashTable