import React, { useState, useEffect } from "react"; 
import FetchTransactions from "./FetchTransactions.js";

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

function formatAddress(address, startLength = 4, endLength = 2) {
    if (!address) return "";
    return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

function Normalization(amountsTransferred, numPoints = 20) {
    const positiveAmountsTransferred = amountsTransferred.map(value => Math.abs(value));
    const maxValue = Math.max(...positiveAmountsTransferred);
    const normalizedAmountsTransferred = [];

    for (let i = 0; i < Math.min(amountsTransferred.length, numPoints); i++) {
        const normalized = (positiveAmountsTransferred[i] / maxValue) * 20 + 10;
        normalizedAmountsTransferred.push({ normalized });
    }

    // Handle if there are fewer data points than expected
    while (normalizedAmountsTransferred.length < numPoints) {
        normalizedAmountsTransferred.push({ normalized: 10 }); // Default radius for missing values
    }

    return normalizedAmountsTransferred;
}

function DrawCircle({ currentPage, address }) {
    const numPoints = 20;
    const circleCenter = { x: 350, y: 350 };
    const circleRadius = 250;
    const { transactions, loading, error } = FetchTransactions(address);

    const [selectedNode, setSelectedNode] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [paginatedTransactions, setPaginatedTransactions] = useState([]);

    const itemsPerPage = 20;

    useEffect(() => {
        if (!transactions || transactions.length === 0) return;
        
        const start = currentPage * itemsPerPage;
        const end = start + itemsPerPage;
        setPaginatedTransactions(transactions.slice(start, end));
    }, [currentPage, transactions]);

    if (loading) return <div>Loading transactions...</div>;
    if (error) return <div>Error: {error}</div>;

    const sender = paginatedTransactions.map(tx => tx.from_address);
    const receiver = paginatedTransactions.map(tx => tx.to_address);
    const transactionHash = paginatedTransactions.map(tx => tx.hash);
    const value = paginatedTransactions.map(tx => parseFloat(tx.value));
    const gasUsed = paginatedTransactions.map(tx => tx.gas_used);
    const gasPrices = paginatedTransactions.map(tx => tx.gas_price);
    const timestamps = paginatedTransactions.map(tx => tx.block_timestamp);
    const transactionFees = paginatedTransactions.map(tx => tx.transaction_fee);
    const blockNumbers = paginatedTransactions.map(tx => tx.block_number);
    const blockHash = paginatedTransactions.map(tx => tx.blockHash);
    const direction = paginatedTransactions.map(tx => tx.direction);

    const normalizedValues = Normalization(value, numPoints);
    const points = calculateCirclePoints(circleCenter.x, circleCenter.y, circleRadius, numPoints);

    const handleNodeClick = (index) => {
        setSelectedNode({
            sender: sender[index],
            receiver: receiver[index],
            transactionHash: transactionHash[index],
            timestamp: timestamps[index],
            blockNumber: blockNumbers[index],
            value: value[index],
            transactionFee: transactionFees[index],
            gasUsed: gasUsed[index],
            gasPrice: gasPrices[index],
            blockHash: blockHash[index],
            direction: direction[index]
        });
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setSelectedNode(null);
        setIsModalOpen(false);
    };

    return (
        <div className="transaction-visualization">
            <svg id="visualization" viewBox="0 0 700 700" width="50%" height="50%">
            {points.slice(0, value.length).map((point, index) => {
                const adjustedX = point.x - normalizedValues[index].normalized * Math.cos(point.alpha);
                const adjustedY = point.y - normalizedValues[index].normalized * Math.sin(point.alpha);

                const midX = (circleCenter.x + point.x) / 2;
                const midY = (circleCenter.y + point.y) / 2;

                const currentValueAtIndex = value[index];
                const textLength = currentValueAtIndex ? currentValueAtIndex.toString().length * 7 : 0; // Check if defined
                const padding = 4;
                const rectWidth = textLength + padding;
                const rectHeight = 18;

                    return (
                        <g className="child-nodes" key={index} onClick={() => handleNodeClick(index)}>
                            <circle cx={point.x} cy={point.y} r={normalizedValues[index].normalized} fill="none" stroke="white" strokeWidth={5} />
                            <line x1={circleCenter.x} y1={circleCenter.y} x2={adjustedX} y2={adjustedY} stroke="white" strokeWidth={5}/>
                            <rect x={midX - rectWidth / 2} y={midY - rectHeight / 2} width={rectWidth} height={rectHeight} fill="#442597" />
                            <text x={midX} y={midY} fontSize="15px" fill="white" textAnchor="middle" alignmentBaseline="middle">
                                {value[index].toFixed(2)}
                            </text>
                            <text id="receivers" x={point.x+5} y={point.y-37} fontSize="15px" fill="white" textAnchor="middle" alignmentBaseline="middle">
                                {formatAddress(receiver[index])}  {/* Use currentNames here */}
                            </text>
                        </g>
                    );
                })}
                <circle id="main-circle" cx={350} cy={350} r={30} fill="white" />
                <text id="chien-name" x={350} y={350} fontSize="15px" fill="white" textAnchor="middle" alignmentBaseline="middle">
                    Chien
                </text>
            </svg>
            
            {isModalOpen && (
                <div className="transaction-backdrop visible" onClick={handleClose}>
                    <div className="transaction-details-container visible">
                        <div className="transaction-details-content">
                            <button className="close-button" onClick={handleClose}>&times;</button>
                            <h3>Transaction Details</h3>
                            <p>📌 <strong>Transaction Hash (TxID):</strong> {selectedNode.transactionHash}</p>
                            <p>📅 <strong>Timestamp:</strong> {selectedNode.timestamp}</p>
                            <p>🔗 <strong>Block Number:</strong> {selectedNode.blockNumber}</p>
                            <p>🏦 <strong>Block Hash:</strong> {selectedNode.blockHash}</p> 

                            <h4>Sender & Receiver</h4>
                            <p>📤 <strong>Sender Address:</strong> {selectedNode.sender}</p>
                            <p>📥 <strong>Receiver Address:</strong> {selectedNode.receiver}</p>
                            <p>🏦 <strong>Direction:</strong> {selectedNode.direction}</p>

                            <h4>Amount & Fees</h4>
                            <p>💰 <strong>Amount Transferred:</strong> {selectedNode.value}</p>
                            <p>⛽ <strong>Transaction Fee:</strong> {selectedNode.transactionFee}</p>
                            <p>🔥 <strong>Gas Used:</strong> {selectedNode.gasUsed}</p>
                            <p>💲 <strong>Gas Price:</strong> {selectedNode.gasPrice} Gwei</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DrawCircle;
