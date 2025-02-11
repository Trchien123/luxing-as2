import React, { useState, useEffect } from "react"; 

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

function Normalization(amountsTransferred, numamountsTransferred) {
    const positiveamountsTransferred = amountsTransferred.map(value => Math.abs(value));
    const maxValue = Math.max(...positiveamountsTransferred);
    const normalizedamountsTransferred = [];

    for (let i = 0; i < numamountsTransferred; i++) {
        const normalized = (positiveamountsTransferred[i] / maxValue) * 20 + 10;
        normalizedamountsTransferred.push({normalized});
    }
    
    return normalizedamountsTransferred;
}

function DrawCircle({currentPage}) { // Accept props as an argument
    const numPoints = 20;
    const circleCenter = {x: 350 , y: 350};
    const circleRadius = 250;
    const points = calculateCirclePoints(circleCenter.x, circleCenter.y, circleRadius, numPoints);

    const [selectedNode, setSelectedNode] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const itemsPerPage = 20; // Items per page

    const [currentTransactions, setCurrentTransactions] = useState(amountsTransferred.slice(0, 20)); // Use itemsPerPage directly
    const [currentNames, setCurrentNames] = useState(names.slice(0, 20)); // Use itemsPerPage directly

    useEffect(() => {
        // Update both transactions and names when the page changes
        const start = currentPage * 20; // Use graph current page from props
        const end = (currentPage + 1) * 20; // Use itemsPerPage directly

        setCurrentTransactions(amountsTransferred.slice(start, end));
        setCurrentNames(names.slice(start, end)); // Update names for current page
    }, [currentPage, amountsTransferred, names]); // Trigger whenever currentPage, amountsTransferred, or names changes

    const normalizedamountsTransferred = Normalization(currentTransactions, numPoints);

    const handleNodeClick = (index) => { 
        const adjustedIndex = currentPage * itemsPerPage + index;
        const isNegativeTransaction = currentTransactions[index] < 0;

        setSelectedNode({ 
            sender: isNegativeTransaction ? names[adjustedIndex] : sender[adjustedIndex],
            receiver: isNegativeTransaction ? sender[adjustedIndex] : names[adjustedIndex],
            transactionHash: transactionHashes[adjustedIndex],
            timestamp: timestamps[adjustedIndex],
            blockNumber: blockNumbers[adjustedIndex],
            status: statuses[adjustedIndex],
            amountTransferred: currentTransactions[index],
            transactionFee: transactionFees[adjustedIndex],
            gasUsed: gasUsed[adjustedIndex],
            gasPrice: gasPrices[adjustedIndex],
            contractAddress: contractAddresses[adjustedIndex],
            tokenType: tokenTypes[adjustedIndex],
            tokenAmount: tokenAmounts[adjustedIndex],
            confirmation: confirmations[adjustedIndex],
            mempoolStatus: mempoolStatuses[adjustedIndex],
            signature: signatures[adjustedIndex],
        });

        setIsModalOpen(true); // Show modal when a transaction is clicked
    };

    const handleClose = () => {
        setSelectedNode(null);
        setIsModalOpen(false); // Hide modal
    };

    return (
        <div className="transaction-visualization">
            <svg id="visualization" viewBox="0 0 700 700" width="50%" height="50%">
                {points.map((point, index) => {
                    const adjustedX = point.x - normalizedamountsTransferred[index].normalized * Math.cos(point.alpha);
                    const adjustedY = point.y - normalizedamountsTransferred[index].normalized * Math.sin(point.alpha);

                    const midX = (circleCenter.x + point.x) / 2;
                    const midY = (circleCenter.y + point.y) / 2;

                    const textLength = currentTransactions[index].toString().length * 7;
                    const padding = 4;
                    const rectWidth = textLength + padding;
                    const rectHeight = 18;

                    return (
                        <g className="child-nodes" key={index} onClick={() => handleNodeClick(index)}>
                            <circle cx={point.x} cy={point.y} r={normalizedamountsTransferred[index].normalized} fill="none" stroke="white" strokeWidth={5} />
                            <line x1={circleCenter.x} y1={circleCenter.y} x2={adjustedX} y2={adjustedY} stroke="white" strokeWidth={5}/>
                            <rect x={midX - rectWidth / 2} y={midY - rectHeight / 2} width={rectWidth} height={rectHeight} fill="#442597" />
                            <text x={midX} y={midY} fontSize="15px" fill="white" textAnchor="middle" alignmentBaseline="middle">
                                {currentTransactions[index]}
                            </text>
                            <text id="receivers" x={point.x+5} y={point.y-37} fontSize="15px" fill="white" textAnchor="middle" alignmentBaseline="middle">
                                {currentNames[index]}  {/* Use currentNames here */}
                            </text>
                        </g>
                    );
                })}
                <circle id="main-circle" cx={350} cy={350} r={30} fill="white" />
                <text id="chien-name" x={350} y={350} fontSize="15px" fill="white" textAnchor="middle" alignmentBaseline="middle">
                    Chien
                </text>
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
    );
}

export default DrawCircle;