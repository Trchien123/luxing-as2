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

function DashTableContent() {
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleMoreDetails = (index) => {
        const isNegativeTransaction = amountsTransferred[index] < 0;

        setSelectedTransaction({
            sender: isNegativeTransaction ? names[index] : sender[index], // Use names[index] for negative transactions, or sender[index] for positive
            receiver: isNegativeTransaction ? sender[index] : names[index], // Use sender[index] for negative transactions, or names[index] for positive
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
                            {names.map((name, index) => (
                                <tr key={index}>
                                    <td>{amountsTransferred[index] < 0 ? names[index] : sender[index]}</td> {/* Sender */}
                                    <td>{amountsTransferred[index] < 0 ? sender[index] : names[index]}</td> {/* Receiver */}
                                    <td>{Math.abs(amountsTransferred[index])}</td>
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
