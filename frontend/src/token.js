import React from "react";

const Token = ({ image, title, content, handleTokenOnClick }) => {

    return (
        <div className="home-component-1--card--container" onClick={() => handleTokenOnClick(image, content)}>
            <div className="card--container-1">
                <div className="card--container-1-img" style={{
                    backgroundImage: `url(${image})`
                }}></div>
                <div className="card--container-1-info">
                    <h3 className="card--container-1--info-title">
                        {title}
                    </h3>
                    <span>{content}</span>
                </div>
            </div>
        </div>
    )
}

export default Token