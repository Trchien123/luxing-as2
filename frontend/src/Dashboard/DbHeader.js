import React from "react";

const DbHeader = ({ scrolled }) => {

    return (
        <header className={`DB-container--header ${scrolled ? "scrolled" : ""}`}>
            <div className="DB--title">
                <h3>Dashboard</h3>
            </div>
            <div className="DB--items">
                <input type="text" placeholder="Type here..." className="search-bar" />
                <div className=""></div>
                <div></div>
                <div></div>
            </div>
        </header>
    )
}

export default DbHeader;