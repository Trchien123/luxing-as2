import React from 'react';
import './paginationControl.css';

const PaginationControl = ({ currentPage, totalItems, itemsPerPage, onPageChange, onPageChangeGraph }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handleNext = () => {
        if (currentPage < totalPages - 1) {
            onPageChange(currentPage + 1);
            onPageChangeGraph(currentPage + 1); // Update graph page
        }
    };

    const handlePrevious = () => {
        if (currentPage > 0) {
            onPageChange(currentPage - 1);
            onPageChangeGraph(currentPage - 1); // Update graph page
        }
    };


    return (
        <div className="pagination-controls">
            <button onClick={handlePrevious} disabled={currentPage === 0}>Previous</button>
            <span>Page {currentPage + 1} of {totalPages}</span>
            <button onClick={handleNext} disabled={currentPage === totalPages - 1}>Next</button>
        </div>
    );
};

export default PaginationControl;
