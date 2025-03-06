import React, { useState, useEffect } from "react"; 

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

function DrawCircle({ currentPage, transactions }) {
    const numPoints = 20;
    const circleCenter = { x: 350, y: 350 };
    const circleRadius = 250;

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

    const sender = paginatedTransactions.map(tx => tx.from_address);
    const receiver = paginatedTransactions.map(tx => tx.to_address);
    const transactionHash = paginatedTransactions.map(tx => tx.hash);
    const value = paginatedTransactions.map(tx => parseFloat(tx.value));
    const gasUsed = paginatedTransactions.map(tx => tx.gas_used);
    const gasPrices = paginatedTransactions.map(tx => tx.gas_price);
    const timestamps = paginatedTransactions.map(tx => tx.block_timestamp);
    const transactionFees = paginatedTransactions.map(tx => tx.transaction_fee);
    const blockNumbers = paginatedTransactions.map(tx => tx.block_number);
    const blockHash = paginatedTransactions.map(tx => tx.block_hash);
    const blockHeight = paginatedTransactions.map(tx => tx.block_height);
    const direction = paginatedTransactions.map(tx => tx.direction);
    const coin_name = paginatedTransactions.map(tx => tx.coin_name);

    const normalizedValues = Normalization(value, numPoints);
    const points = calculateCirclePoints(circleCenter.x, circleCenter.y, circleRadius, numPoints);

    const handleNodeClick = (index) => {
        setSelectedNode({
            sender: sender[index],  // Outbound: lookup is sender, Inbound: lookup is receiver
            receiver: receiver[index],
            transactionHash: transactionHash[index],
            timestamp: timestamps[index],
            blockNumber: blockNumbers[index],
            value: value[index],
            transactionFee: transactionFees[index],
            gasUsed: gasUsed[index],
            gasPrice: gasPrices[index],
            blockHash: blockHash[index],
            blockHeight: blockHeight[index],
            direction: direction[index],
            coin_name: coin_name[index]
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

                    let textOffset = 40; // Default offset
                    let textX = (circleCenter.x + adjustedX) / 2;
                    let textY = (circleCenter.y + adjustedY) / 2;

                    // Adjust text positioning based on angle
                    if (Math.abs(point.alpha - Math.PI / 2) < 0.3) { 
                        textY += (textOffset + 10); // Move text up at 12h
                    } else if (Math.abs(point.alpha - (3 * Math.PI) / 2) < 0.3) { 
                        textY -= (textOffset + 10); // Move text down at 6h
                    } else {
                        textX += textOffset * Math.cos(point.alpha);
                        textY += textOffset * Math.sin(point.alpha);
                    }

                    const textWidth = 70;
                    const textHeight = 20;

                    // Format values for readability
                    let displayValue = value[index] < 0.0001 ? value[index].toFixed(6) : value[index].toFixed(4);

                    // Determine the fill color based on transaction direction
                    const fillColor = direction[index]?.toLowerCase() === 'outbound' ? '#DC143C' : 'green';

                    return (
                        <g className="child-nodes" key={index} onClick={() => handleNodeClick(index)}>
                            <circle cx={point.x} cy={point.y} r={normalizedValues[index].normalized} fill={fillColor} stroke="white" strokeWidth={5} />
                            <line x1={circleCenter.x} y1={circleCenter.y} x2={adjustedX} y2={adjustedY} stroke="white" strokeWidth={5} />

                            {/* Background rectangle for text */}
                            <rect x={textX - textWidth / 2} y={textY - textHeight / 2} width={textWidth} height={textHeight} fill="#442597" rx={5} ry={5} opacity={0.7} />    

                            {/* Adjusted text positioning */}
                            <text x={textX} y={textY} fontSize="14px" fill="white" textAnchor="middle" alignmentBaseline="middle"
                                style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.6)" }}>
                                {displayValue}
                            </text>

                            {/* Background rectangle for receiver address */}
                            <rect x={point.x - textWidth / 2} y={point.y - 35} width={textWidth} height={textHeight} fill="#442597" rx={5} ry={5} opacity={0.7} />
                            
                            {/* Receiver address positioned away from value */}
                            <text x={point.x} y={point.y - 25} fontSize="14px" fill="white" textAnchor="middle" alignmentBaseline="middle"
                                style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.6)" }}>
                                {formatAddress(direction[index] === "outbound" ? receiver[index] : sender[index])}
                            </text>
                        </g>
                    );
                })}
                <circle id="main-circle" cx={350} cy={350} r={45} fill="white" />
                <text id="chien-name" x={350} y={350} fontSize="15px" fill="white" textAnchor="middle" alignmentBaseline="middle">
                    {formatAddress(direction[0] === "outbound" ? sender[0] : receiver[0])}
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
                            {selectedNode.coin_name !== "bitcoin" ? (
                                <>
                                    <p>🔗 <strong>Block Number:</strong> {selectedNode.blockNumber}</p>
                                    <p>🏦 <strong>Block Hash:</strong> {selectedNode.blockHash}</p> 
                                </>
                            ) : (
                                <p>🏦 <strong>Block Height:</strong> {selectedNode.blockHeight}</p> 
                            )}

                            <h4>Sender & Receiver</h4>
                            <p>📤 <strong>Sender Address:</strong> {selectedNode.sender}</p>
                            <p>📥 <strong>Receiver Address:</strong> {selectedNode.receiver}</p>
                            <p>🏦 <strong>Direction:</strong> {selectedNode.direction}</p>

                            <h4>Amount & Fees</h4>
                            <p>💰 <strong>Amount Transferred:</strong> {selectedNode.value}</p>
                            {selectedNode.coin_name !== "bitcoin" && (
                            <>
                                <p>⛽ <strong>Transaction Fee:</strong> {selectedNode.transactionFee}</p>
                                <p>🔥 <strong>Gas Used:</strong> {selectedNode.gasUsed}</p>
                                <p>💲 <strong>Gas Price:</strong> {selectedNode.gasPrice} Gwei</p>
                            </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DrawCircle;
