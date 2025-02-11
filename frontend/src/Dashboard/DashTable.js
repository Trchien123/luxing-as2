import React, { useState } from "react";
import "../Dashboard_table/dashTable.css";
import { names } from "../Dashboard_table/data"; // Correct path for names

import DrawCircle from "../Dashboard_table/drawCircles.js";
import DashTableContent from "../Dashboard_table/dashTableContent.js";
import PaginationControl from "../Dashboard_table/paginationControl"; // Correct path for PaginationControl

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
