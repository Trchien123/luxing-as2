import React, { useState } from "react";

function calculateCirclePoints(a, b, R, numPoints = 20) {
    const points = [];
    for (let i = 0; i < numPoints; i++) {
        const alpha = (2 * Math.PI * i) / numPoints;
        const x = a + R * Math.cos(alpha);
        const y = b + R * Math.sin(alpha);
        points.push({x, y, alpha});
    }
    return points;
}

function Normalization(radii, numRadii) {
    const maxValue = Math.max(...radii);
    const normalizedRadii = [];
    for (let i = 0; i < numRadii; i++) {
        const normalized = (radii[i] / maxValue) * 20 + 10;
        normalizedRadii.push({normalized});
    }
    return normalizedRadii;
}

function DrawCircle() {
    const numPoints = 20;
    const circleCenter = {x: 300 , y: 300};
    const circleRadius = 250;
    const points = calculateCirclePoints(circleCenter.x, circleCenter.y, circleRadius, numPoints);

    const sender = "Chien";
    const names = ["Olivia Carter", "Liam Johnson", "Emma Smith", "Noah Davis", "Ava Wilson", 
        "Jackson Brown", "Lam Dan", "Ethan Moore", "Isabella Taylor", "Lucas Anderson", 
        "Mia Thomas", "Aiden Jackson", "Harper White", "Mason Harris", "Amelia Clark", 
        "James Lewis", "Charlotte Walker", "Benjamin Scott", "Ella Hall", "Alexander Young"];
    const radii = [9133, 5457, 3085, 2746, 4254, 8000, 1907, 8947, 3183, 8323, 7021, 6429, 5252, 7054, 3571, 7741, 4020, 1702, 8688, 8458]
    const normalizedRadii = Normalization(radii, numPoints);

    const [selectedNode, setSelectedNode] = useState(null);

    const handleNodeClick = (index) => {
        setSelectedNode({
            sender: sender,
            receiver: names[index],
            transaction: radii[index],
        });
    };

    const handleClose = () => {
        setSelectedNode(null); // Reset the selected node to hide details
    };

    return (
        <div className="transaction-visualization">
            <svg id="visualization" viewBox="0 0 600 600" width="50%" height="50%">
                {points.map((point, index) => {
                    const adjustedX = point.x - normalizedRadii[index].normalized * Math.cos(point.alpha);
                    const adjustedY = point.y - normalizedRadii[index].normalized * Math.sin(point.alpha);

                    const midX = (circleCenter.x + point.x) / 2;
                    const midY = (circleCenter.y + point.y) / 2;

                    // Measure the length of the text (approximation)
                    const textLength = radii[index].toString().length * 7; // Rough estimate for text width

                    // Add some padding for the background
                    const padding = 4;
                    const rectWidth = textLength + padding;
                    const rectHeight = 18; // Set a fixed height for the background rectangle

                    return (
                        <g className="child-nodes" key={index} onClick={() => handleNodeClick(index)}>
                            <circle cx={point.x} cy={point.y} r={normalizedRadii[index].normalized} fill="none" stroke="white" strokeWidth={3} />
                            <line x1={circleCenter.x} y1={circleCenter.y} x2={adjustedX} y2={adjustedY} stroke="white" strokeWidth={3}/>
                            <rect x={midX - rectWidth / 2} y={midY - rectHeight / 2} width={rectWidth} height={rectHeight} fill="#442597" />
                            <text x={midX} y={midY} fontSize="13" fill="white" textAnchor="middle" alignmentBaseline="middle">
                                {radii[index]}
                            </text>
                            <text id="receivers" x={point.x+5} y={point.y-37} fontSize="13" fill="white" textAnchor="middle" alignmentBaseline="middle">
                                {names[index]}
                            </text>
                        </g>
                    )
                })}
                <circle id="main-circle" cx={300} cy={300} r={30} fill="white" />
                <text id="sender" x="300" y="300" fontSize="15" fill="white" textAnchor="middle" alignmentBaseline="middle">{sender}</text>
            </svg>
            
            <div
                className={`transaction-details-container ${selectedNode ? "visible" : ""}`}>
                {selectedNode && (
                    <div className={`transaction-details-container visible`}>
                        <button className="close-button" onClick={handleClose}>
                            &times;
                        </button>
                        <div className="transaction-details-content">
                            <h3>Transaction Details</h3>
                            <p>Sender: {selectedNode.sender}</p>
                            <p>Receiver: {selectedNode.receiver}</p>
                            <p>Transaction Value: {selectedNode.transaction}</p>
                        </div>    
                    </div>
                )}
            </div>
        </div>
    )
};

export default DrawCircle