import React, { useState, useEffect } from "react";

const entriesPerPage = 20;

function formatAddress(address, screenWidth) {
    if (!address || address.length === 0) return "Unknown";
    if (screenWidth < 768) return `${address.slice(0, 2)}...${address.slice(-2)}`; // Mobile
    if (screenWidth < 1024) return `${address.slice(0, 4)}...${address.slice(-4)}`; // Tablet
    return `${address.slice(0, 7)}...${address.slice(-6)}`; // Desktop
}

function DashTableContent({ currentPage, transactions }) {
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [paginatedTransactions, setPaginatedTransactions] = useState([]);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        if (!transactions || transactions.length === 0) return;
            
        // Show only ETH Transfer and Contract Interaction transactions
        const filteredTransactions = transactions.filter(tx => 
            tx.transaction_type === "ETH Transfer" || tx.transaction_type === "Contract Interaction"
        );
        
        const start = currentPage * entriesPerPage;
        const end = start + entriesPerPage;
        if (filteredTransactions.length !== 0) {
            setPaginatedTransactions(filteredTransactions.slice(start, end));
        } else {
            setPaginatedTransactions(transactions.slice(start, end));
        }
    }, [currentPage, transactions]);

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleCopy = (text, button) => {
        // Copy the text to clipboard
        navigator.clipboard.writeText(text).then(() => {
            console.log("Text copied!");
        }).catch(err => {
            console.error("Error copying text: ", err);
        });
    
        // Add the "clicked" class to the clicked button to trigger animation
        button.classList.add("clicked");
    
        // Remove the "clicked" class after animation ends (0.5s)
        setTimeout(() => {
            button.classList.remove("clicked");
        }, 500);  // Duration of the animation in ms
    };

    const handleClose = () => {
        setSelectedTransaction(null);
        setIsModalOpen(false);
    };

    return (
        <section id="table-container">
            <div className="table-wrapper">
                <div className="tbl-header-sender">
                    <table className="table" cellPadding="0" cellSpacing="0" border="0">
                        <thead>
                            <tr>
                                <th>Sender</th>
                                <th>Receiver</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>More Details</th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <div className="tbl-content-sender">
                    <table className="table" cellPadding="0" cellSpacing="0" border="0">
                        <tbody>
                            {paginatedTransactions.map((tx, index) =>(
                                <tr key={index}>
                                    <td>{formatAddress(tx.from_address, screenWidth)}
                                        <button className="copy-button" onClick={(e) => handleCopy(tx.from_address, e.target)}>
                                            <i className="fas fa-copy"></i>
                                        </button>
                                    </td>
                                    <td>{formatAddress(tx.to_address, screenWidth)}
                                        <button className="copy-button" onClick={(e) => handleCopy(tx.to_address, e.target)}>
                                            <i className="fas fa-copy"></i>
                                        </button>
                                    </td>
                                    {tx.coin_name !== "bitcoin" && tx.coin_name !== "seelecoin" && (
                                        <td>{tx.transaction_type}</td>
                                    )}
                                    {tx.coin_name === "bitcoin" && (
                                        <td>BTC Transfer</td>
                                    )}
                                    {tx.coin_name === "seelecoin" && (
                                        <td>SLC Transfer</td>
                                    )}
                                    <td>{Math.abs(tx.value).toFixed(8)} ETH</td>
                                    <td>
                                        <button onClick={() => {
                                            setSelectedTransaction(tx); 
                                            setIsModalOpen(true); }} className="details-button">More Details
                                        </button>
                                    </td>
                                </tr>
                            ))} 
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && selectedTransaction && (
                <div className="transaction-backdrop visible">
                    <div className="transaction-details-container visible">
                        <div className="transaction-details-content">
                            <button className="close-button" onClick={handleClose}>
                                &times;
                            </button>
                            <h3>Transaction Details</h3>
                            <p>📌 <strong>Transaction Hash (TxID):</strong> {selectedTransaction.hash}
                                <button className="copy-button" onClick={(e) => handleCopy(selectedTransaction.hash, e.target)}>
                                    <i className="fas fa-copy"></i>
                                </button>
                            </p>
                            <p>📅 <strong>Timestamp:</strong> {selectedTransaction.block_timestamp} (UTC +7)</p>
                            {selectedTransaction.coin_name !== "bitcoin" && (
                                <>
                                    <p>🔗 <strong>Block Number:</strong> {selectedTransaction.block_number}</p>
                                </>
                            )}

                            {selectedTransaction.coin_name === "bitcoin" && (
                                <>
                                    <p>🏦 <strong>Block Height:</strong> {selectedTransaction.block_height}</p>

                                    <h4>Sender & Receiver</h4>
                                    <p>📤 <strong>Sender Address:</strong> {selectedTransaction.from_address}
                                        <button className="copy-button" onClick={(e) => handleCopy(selectedTransaction.sender, e.target)}>
                                            <i className="fas fa-copy"></i>
                                        </button>
                                    </p>
                                    <p>📥 <strong>Receiver Address:</strong> {selectedTransaction.to_address}
                                        <button className="copy-button" onClick={(e) => handleCopy(selectedTransaction.receiver, e.target)}>
                                            <i className="fas fa-copy"></i>
                                        </button>
                                    </p>

                                    <h4>Amount & Fees</h4>
                                    <p>💰 <strong>Amount Transferred:</strong> {selectedTransaction.value} BTC</p>
                                </>
                            )}

                            {(selectedTransaction.transaction_type === "ETH Transfer" || selectedTransaction.transaction_type === "Contract Interaction") && (
                            <>  
                                <p>🏦 <strong>Block Hash:</strong> {selectedTransaction.block_hash}
                                    <button className="copy-button" onClick={(e) => handleCopy(selectedTransaction.block_hash, e.target)}>
                                        <i className="fas fa-copy"></i>
                                    </button>
                                </p> 

                                <h4>Sender & Receiver</h4>
                                <p>📤 <strong>Sender Address:</strong> {selectedTransaction.from_address}
                                    <button className="copy-button" onClick={(e) => handleCopy(selectedTransaction.sender, e.target)}>
                                        <i className="fas fa-copy"></i>
                                    </button>
                                </p>
                                <p>📥 <strong>Receiver Address:</strong> {selectedTransaction.to_address}
                                    <button className="copy-button" onClick={(e) => handleCopy(selectedTransaction.receiver, e.target)}>
                                        <i className="fas fa-copy"></i>
                                    </button>
                                </p>

                                <h4>Amount & Fees</h4>
                                <p>💰 <strong>Amount Transferred:</strong> {selectedTransaction.value} ETH</p>
                                <p>⛽ <strong>Transaction Fee:</strong> {selectedTransaction.transaction_fee} ETH</p>
                                <p>🔥 <strong>Gas Used:</strong> {selectedTransaction.gas_used}</p>
                                <p>💲 <strong>Gas Price:</strong> {selectedTransaction.gas_price} Gwei</p>
                            </>
                            )}

                            {selectedTransaction.transaction_type === "Token Transfer" && (
                            <>
                                <h4>Token Transfer</h4>
                                <p>📤 <strong>Sender:</strong> {selectedTransaction.from_address}
                                    <button className="copy-button" onClick={(e) => handleCopy(selectedTransaction.sender, e.target)}>
                                        <i className="fas fa-copy"></i>
                                    </button>
                                </p>
                                <p>📥 <strong>Receiver:</strong> {selectedTransaction.to_address}
                                    <button className="copy-button" onClick={(e) => handleCopy(selectedTransaction.receiver, e.target)}>
                                        <i className="fas fa-copy"></i>
                                    </button>
                                </p>
                                <p>🏦 <strong>Token:</strong> {selectedTransaction.token_name}</p>
                                <p>💰 <strong>Amount:</strong> {selectedTransaction.value} {selectedTransaction.token_name}</p>
                            </>
                            )}

                            {selectedTransaction.transaction_type === "NFT Transfer" && (
                            <>
                                <h4>NFT Transfer</h4>
                                <p>📤 <strong>Sender:</strong> {selectedTransaction.sender}
                                    <button className="copy-button" onClick={(e) => handleCopy(selectedTransaction.sender, e.target)}>
                                        <i className="fas fa-copy"></i>
                                    </button>
                                </p>
                                <p>📥 <strong>Receiver:</strong> {selectedTransaction.receiver}
                                    <button className="copy-button" onClick={(e) => handleCopy(selectedTransaction.receiver, e.target)}>
                                        <i className="fas fa-copy"></i>
                                    </button>
                                </p>
                                <p>🎨 <strong>NFT:</strong> {selectedTransaction.nftName}</p>
                                <p>🆔 <strong>NFT ID:</strong> {selectedTransaction.nftId}</p>
                            </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default DashTableContent;
