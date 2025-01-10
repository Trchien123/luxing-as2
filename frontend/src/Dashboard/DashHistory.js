import React from "react";

const DashHistory = () => {
    const categories = ["Author", "status", "employed", "action"]




    return (
        <div className="Dbhistory--container">
            <div className="Dbhistory--subcontainer">
                <h1 className="Dbhistory--container--header">Your history</h1>

                <table>
                    <thead>
                        <CategoryHeader data={categories} />
                    </thead>
                    <tbody>
                        <CategoryItems
                            name={"Jake grimsson"}
                            gmail={"Jakje@gmail.com"}
                            status={true}
                            date={"23/09/2091"}
                            action={"delete"} />
                        <CategoryItems
                            name={"Jake"}
                            gmail={"Jakje@gmail.com"}
                            status={true}
                            date={"23/09/2091"}
                            action={"delete"} />
                        <CategoryItems
                            name={"Jake"}
                            gmail={"Jakje@gmail.com"}
                            status={true}
                            date={"23/09/2091"}
                            action={"delete"} />
                        <CategoryItems
                            name={"Jake"}
                            gmail={"Jakje@gmail.com"}
                            status={true}
                            date={"23/09/2091"}
                            action={"delete"} />
                    </tbody>
                </table>
            </div>

        </div>
    )
}
export default DashHistory;

const CategoryHeader = ({ data }) => {
    return (
        <tr>
            {
                data.map((category, index) => {
                    return <th key={index} className={`Dbhistory--table--header-${index + 1}`}>
                        {category}
                    </th>
                })
            }
        </tr>
    )
}

const CategoryItems = ({ name, gmail, status, date, action }) => {
    return (
        <tr>
            <td className="Dbhistory-header-firstItem1">
                <CategoryContainer1 name={name} gmail={gmail} />

            </td>
            <td>
                <CategoryContainer2 status={status} />
            </td>
            <td>
                {date}
            </td>
            <td>
                {action}
            </td>
        </tr>
    )
}
const CategoryContainer1 = ({ name, gmail }) => {
    return (
        <div className="Dbhistory-list-item">

            <div className="icon">
            </div>
            <div className="title">
                <p>{name}</p>
                <span>{gmail}</span>
            </div>
        </div>
    )
}

const CategoryContainer2 = ({ status }) => {
    return (
        <div className="Dbhistory-list-item status">
            <p>
                {
                    status ? "Online" : "Offline"
                }
            </p>

        </div>
    )
}

