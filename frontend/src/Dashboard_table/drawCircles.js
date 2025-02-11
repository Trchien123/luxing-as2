import React, { useState } from "react";
import { 
    sender, 
    names, 
    radii, 
    transactionHashes, 
    timestamps, 
    blockNumbers, 
    statuses, 
    amountsTransferred, 
    transactionFees, 
    gasUsed, 
    gasPrices, 
    contractAddresses, 
    tokenTypes, 
    tokenAmounts, 
    confirmations, 
    mempoolStatuses, 
    signatures 
} from './data';

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
    const positiveRadii = radii.map(value => Math.abs(value));
    const maxValue = Math.max(...positiveRadii);
    const normalizedRadii = [];

    for (let i = 0; i < numRadii; i++) {
        const normalized = (positiveRadii[i] / maxValue) * 20 + 10;
        normalizedRadii.push({normalized});
    }
    
    return normalizedRadii;
}

function DrawCircle() {
    const numPoints = 20;
    const circleCenter = {x: 300 , y: 300};
    const circleRadius = 250;
    const points = calculateCirclePoints(circleCenter.x, circleCenter.y, circleRadius, numPoints);

    const normalizedRadii = Normalization(radii, numPoints);

    const [selectedNode, setSelectedNode] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleNodeClick = (index) => {
        setSelectedNode({
            sender: sender,
            receiver: names[index],
            transaction: radii[index],
            transactionHash: transactionHashes[index],
            timestamp: timestamps[index],
            blockNumber: blockNumbers[index],
            status: statuses[index],
            amountTransferred: amountsTransferred[index],
            transactionFee: transactionFees[index],
            gasUsed: gasUsed[index],
            gasPrice: gasPrices[index],
            contractAddress: contractAddresses[index],
            tokenType: tokenTypes[index],
            tokenAmount: tokenAmounts[index],
            confirmation: confirmations[index],
            mempoolStatus: mempoolStatuses[index],
            signature: signatures[index],
        });
        setIsModalOpen(true); // Show modal when a transaction is clicked
    };

    const handleClose = () => {
        setSelectedNode(null);
        setIsModalOpen(false); // Hide modal
    };

    return (
        <div className="transaction-visualization">
            <svg id="visualization" viewBox="0 0 600 600" width="50%" height="50%">
                {points.map((point, index) => {
                    const adjustedX = point.x - normalizedRadii[index].normalized * Math.cos(point.alpha);
                    const adjustedY = point.y - normalizedRadii[index].normalized * Math.sin(point.alpha);

                    const midX = (circleCenter.x + point.x) / 2;
                    const midY = (circleCenter.y + point.y) / 2;

                    const textLength = radii[index].toString().length * 7;
                    const padding = 4;
                    const rectWidth = textLength + padding;
                    const rectHeight = 18;

                    return (
                        <g className="child-nodes" key={index} onClick={() => handleNodeClick(index)}>
                            <circle cx={point.x} cy={point.y} r={normalizedRadii[index].normalized} fill="none" stroke="white" strokeWidth={3} />
                            <line x1={circleCenter.x} y1={circleCenter.y} x2={adjustedX} y2={adjustedY} stroke="white" strokeWidth={3}/>
                            <rect x={midX - rectWidth / 2} y={midY - rectHeight / 2} width={rectWidth} height={rectHeight} fill="#442597" />
                            <text x={midX} y={midY} fontSize="15px" fill="white" textAnchor="middle" alignmentBaseline="middle">
                                {radii[index]}
                            </text>
                            <text id="receivers" x={point.x+5} y={point.y-37} fontSize="15px" fill="white" textAnchor="middle" alignmentBaseline="middle">
                                {names[index]}
                            </text>
                        </g>
                    )
                })}
                <circle id="main-circle" cx={300} cy={300} r={30} fill="white" />
                <text id="sender" x="300" y="300" fontSize="17px" fill="white" textAnchor="middle" alignmentBaseline="middle">{sender}</text>
            </svg>
            
            {isModalOpen && <div className="transaction-backdrop visible" onClick={handleClose}></div>}
            <div className={`transaction-details-container ${isModalOpen ? "visible" : ""}`}>
                {selectedNode && (
                    <div className="transaction-details-content">
                        <button className="close-button" onClick={handleClose}>
                            &times;
                        </button>
                        <h3>Transaction Details</h3>
                        <p>📌 <strong>Transaction Hash (TxID):</strong> {selectedNode.transactionHash}</p>
                        <p>📅 <strong>Timestamp:</strong> {selectedNode.timestamp}</p>
                        <p>🔗 <strong>Block Number:</strong> {selectedNode.blockNumber}</p>
                        <p>📊 <strong>Status:</strong> {selectedNode.status}</p>

                        <h4>Sender & Receiver</h4>
                        <p>📤 <strong>Sender Address:</strong> {selectedNode.sender}</p>
                        <p>📥 <strong>Receiver Address:</strong> {selectedNode.receiver}</p>
                        <p>🔢 <strong>Inputs:</strong> 1</p>
                        <p>🔢 <strong>Outputs:</strong> 2</p>

                        <h4>Amount & Fees</h4>
                        <p>💰 <strong>Amount Transferred:</strong> {selectedNode.amountTransferred}</p>
                        <p>⛽ <strong>Transaction Fee:</strong> {selectedNode.transactionFee}</p>
                        <p>🔥 <strong>Gas Used:</strong> {selectedNode.gasUsed}</p>
                        <p>💲 <strong>Gas Price:</strong> {selectedNode.gasPrice} Gwei</p>

                        <h4>Smart Contract & Token Details (if applicable)</h4>
                        <p>🏦 <strong>Contract Address:</strong> {selectedNode.contractAddress}</p>
                        <p>🎟 <strong>Token Type:</strong> {selectedNode.tokenType}</p>
                        <p>💎 <strong>Token Amount:</strong> {selectedNode.tokenAmount}</p>

                        <h4>Confirmation & Security</h4>
                        <p>✅ <strong>Confirmations:</strong> {selectedNode.confirmation}</p>
                        <p>📌 <strong>Mempool Status:</strong> {selectedNode.mempoolStatus}</p>
                        <p>🔏 <strong>Signature:</strong> {selectedNode.signature}</p>
                    </div>
                )}
            </div>
        </div>
    )
};

export default DrawCircle;
