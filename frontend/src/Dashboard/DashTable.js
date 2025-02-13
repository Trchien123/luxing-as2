import React, { useState } from "react";
import "../Dashboard_table/DbTableDrawCircles.css";
import { names } from "../Dashboard_table/DbTableMockdata.js"; // Correct path for names

import DrawCircle from "../Dashboard_table/DbTableDrawCircles.js";
import DashTableContent from "../Dashboard_table/DbTableContent.js";
import PaginationControl from "../Dashboard_table/DbTablePaginationcontrol"; // Correct path for PaginationControl

const DashTable = () => {
    const onPageChangeGraph = (newPage) => {
        console.log("Graph page changed to:", newPage);
    };

    const [currentPage, setCurrentPage] = useState(0);
    const totalItems = names.length; // Total items for pagination

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <main className="DB-table">
            <h1 className="Dbtable-title">this is the graph</h1>
            
            <div className="Dbtable-component">
                <DrawCircle currentPage={currentPage} setCurrentPage={setCurrentPage} /> {/* Pass props to DrawCircle */}

                <PaginationControl
                    onPageChangeGraph={onPageChangeGraph} 

                    currentPage={currentPage} 
                    totalItems={totalItems} 
                    itemsPerPage={20} 
                    onPageChange={handlePageChange} 
                />
                
                <DashTableContent
                    onPageChangeGraph={onPageChangeGraph} 

                    currentPage={currentPage} 
                    setCurrentPage={setCurrentPage} 
                />
            </div>
        </main>
    );
}


export default DashTable;
