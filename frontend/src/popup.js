import React from "react";
import "./style/popup.css"
import Token from "./token";
const PopUp = ({ onClick, setBlock }) => {
    const handleTokenOnClick = (title) => {
        setBlock(title)
    }
    return (
        <div className="home-component-1--popup" onClick={onClick}>
            <div className="home-component-1--card">

                <div className="home-component-1--card--header">
                    <p>Select a Token</p>
                    <button onClick={onClick}>X</button>
                </div>
                <p className="home-component-1--tokens">Tokens</p>
                <Token />
                <Token />
                <Token />
                <Token />
                <Token />
            </div>
        </div>

    )
}

export default PopUp;