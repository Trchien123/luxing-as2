import React, { useState } from 'react';
import { 
    sender, 
    names, 
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

const entriesPerPage = 20; // Number of entries to display per page

function DashTableContent() {
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const handleMoreDetails = (index) => {
        // Logic to handle pagination
        const startIndex = (currentPage - 1) * entriesPerPage;
        const endIndex = startIndex + entriesPerPage;
        const paginatedAmounts = amountsTransferred.slice(startIndex, endIndex);
        const isNegativeTransaction = paginatedAmounts[index] < 0; // Only declare once

        setSelectedTransaction({
            sender: isNegativeTransaction ? names[startIndex + index] : sender[startIndex + index], // Use names[startIndex + index] for negative transactions, or sender[startIndex + index] for positive
            receiver: isNegativeTransaction ? sender[startIndex + index] : names[startIndex + index], // Use sender[startIndex + index] for negative transactions, or names[startIndex + index] for positive
            transactionHash: transactionHashes[startIndex + index],
            timestamp: timestamps[startIndex + index],
            blockNumber: blockNumbers[startIndex + index],
            status: statuses[startIndex + index],
            amountTransferred: amountsTransferred[startIndex + index],
            transactionFee: transactionFees[startIndex + index],
            gasUsed: gasUsed[startIndex + index],
            gasPrice: gasPrices[startIndex + index],
            contractAddress: contractAddresses[startIndex + index],
            tokenType: tokenTypes[startIndex + index],
            tokenAmount: tokenAmounts[startIndex + index],
            confirmation: confirmations[startIndex + index],
            mempoolStatus: mempoolStatuses[startIndex + index],
            signature: signatures[startIndex + index],
        });

        setIsModalOpen(true);
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
                                <th>Amount</th>
                                <th>More Details</th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <div className="tbl-content-sender">
                    <table className="table" cellPadding="0" cellSpacing="0" border="0">
                        <tbody>
                            {names.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage).map((name, index) => (
                                <tr key={index}>
                                    <td>{amountsTransferred[(currentPage - 1) * entriesPerPage + index] < 0 ? names[(currentPage - 1) * entriesPerPage + index] : sender[(currentPage - 1) * entriesPerPage + index]}</td> {/* Sender */}
                                    <td>{amountsTransferred[(currentPage - 1) * entriesPerPage + index] < 0 ? sender[(currentPage - 1) * entriesPerPage + index] : names[(currentPage - 1) * entriesPerPage + index]}</td> {/* Receiver */}
                                    <td>{Math.abs(amountsTransferred[(currentPage - 1) * entriesPerPage + index])}</td>
                                    <td>
                                        <button onClick={() => handleMoreDetails(index)} className="details-button">
                                            More Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            <div className="pagination">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Previous</button>
                <span>Page {currentPage}</span>
                <button onClick={() => setCurrentPage(prev => prev + 1)} disabled={currentPage * entriesPerPage >= names.length}>Next</button>
            </div>
            {/* Transaction Details Modal */}

            {isModalOpen && (
            <div className={`transaction-backdrop ${isModalOpen ? "visible" : ""}`} onClick={handleClose}>
                <div className={`transaction-details-container ${isModalOpen ? "visible" : ""}`}>
                        <div className="transaction-details-content">
                            <button className="close-button" onClick={handleClose}>
                                &times;
                            </button>
                            <h3>Transaction Details</h3>
                            <p>📌 <strong>Transaction Hash (TxID):</strong> {selectedTransaction.transactionHash}</p>
                            <p>📅 <strong>Timestamp:</strong> {selectedTransaction.timestamp}</p>
                            <p>🔗 <strong>Block Number:</strong> {selectedTransaction.blockNumber}</p>
                            <p>📊 <strong>Status:</strong> {selectedTransaction.status}</p>

                            <h4>Sender & Receiver</h4>
                            <p>📤 <strong>Sender Address:</strong> {selectedTransaction.sender}</p>
                            <p>📥 <strong>Receiver Address:</strong> {selectedTransaction.receiver}</p>

                            <h4>Amount & Fees</h4>
                            <p>💰 <strong>Amount Transferred:</strong> {selectedTransaction.amountTransferred}</p>
                            <p>⛽ <strong>Transaction Fee:</strong> {selectedTransaction.transactionFee}</p>
                            <p>🔥 <strong>Gas Used:</strong> {selectedTransaction.gasUsed}</p>
                            <p>💲 <strong>Gas Price:</strong> {selectedTransaction.gasPrice} Gwei</p>

                            <h4>Smart Contract & Token Details</h4>
                            <p>🏦 <strong>Contract Address:</strong> {selectedTransaction.contractAddress}</p>
                            <p>🎟 <strong>Token Type:</strong> {selectedTransaction.tokenType}</p>
                            <p>💎 <strong>Token Amount:</strong> {selectedTransaction.tokenAmount}</p>

                            <h4>Confirmation & Security</h4>
                            <p>✅ <strong>Confirmations:</strong> {selectedTransaction.confirmation}</p>
                            <p>📌 <strong>Mempool Status:</strong> {selectedTransaction.mempoolStatus}</p>
                            <p>🔏 <strong>Signature:</strong> {selectedTransaction.signature}</p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default DashTableContent;
