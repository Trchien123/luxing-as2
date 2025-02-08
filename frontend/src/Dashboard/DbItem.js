import React from "react";

const DbItem = ({ content, icon }) => {
    return (
        <div className="navbar-icon">
            <div className="icon">

                {icon}

            </div>
            <p>{content}</p>
        </div>
    )
}

export default DbItem