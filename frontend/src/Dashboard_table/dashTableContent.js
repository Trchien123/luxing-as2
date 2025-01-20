import React from 'react';

function DashTableContent() {
    const sender = "Chien";
    const names = ["Olivia Carter", "Liam Johnson", "Emma Smith", "Noah Davis", "Ava Wilson", 
        "Jackson Brown", "Lam Dan", "Ethan Moore", "Isabella Taylor", "Lucas Anderson", 
        "Mia Thomas", "Aiden Jackson", "Harper White", "Mason Harris", "Amelia Clark", 
        "James Lewis", "Charlotte Walker", "Benjamin Scott", "Ella Hall", "Alexander Young"];
    const radii = [9133, 5457, 3085, 2746, 4254, 8000, 1907, 8947, 3183, 8323, 7021, 6429, 5252, 7054, 3571, 7741, 4020, 1702, 8688, 8458];
    const transaction_time =["10:23 AM", "11:15 AM", "12:42 PM", "1:30 PM", "2:18 PM", "3:05 PM", "4:20 PM", "5:12 PM", "6:45 PM", "7:33 PM"
        , "8:10 PM", "9:27 PM", "10:15 PM", "11:05 PM", "12:30 AM", "1:20 AM", "2:45 AM", "3:15 AM", "4:50 AM", "5:30 AM"];
    return (
        <section id="table-container">
            <div className="table-wrapper">
                <div className="tbl-header-sender">
                <table className="table" cellPadding="0" cellSpacing="0" border="0">
                    <thead>
                    <tr>
                        <th>Sender</th>
                        <th>Receiver</th>
                        <th>Transaction</th>
                        <th>Time</th>
                        <th>Percentage</th>
                    </tr>
                    </thead>
                </table>
                </div>
                <div className="tbl-content-sender">
                <table className="table" cellPadding="0" cellSpacing="0" border="0">
                    <tbody>
                        {names.map((name, index) => (
                            <tr key={index}>
                                <td>{sender}</td>
                                <td>{name}</td>
                                <td>{radii[index]}</td>
                                <td>{transaction_time[index]}</td>
                                <td>{((radii[index] / radii.reduce((a, b) => a + b, 0)) * 100).toFixed(2)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>
        </section>
    );
}

export default DashTableContent