import React from "react";
import DbContainer1 from "./DbContainer1";
import DbHeader from "./DbHeader";
const DbHome = () => {
    return (
        <main className="DB-main">
            <DbContainer1 />
            <div className="DB-main-container-2">
                <div className="Db-main-2-items Db-main-2-items-1 "></div>
                <div className="Db-main-2-items Db-main-2-items-2"></div>
                <div className="Db-main-2-items Db-main-2-items-3"></div>
            </div>
            <div className="DB-main-container-2">
                <div className="Db-main-2-items Db-main-2-items-4 "></div>
                <div className="Db-main-2-items Db-main-2-items-5"></div>

            </div>
            <div className="DB-main-container-2">
                <div className="Db-main-2-items Db-main-2-items-6 "></div>
                <div className="Db-main-2-items Db-main-2-items-7"></div>
            </div>
        </main>
    )
}

export default DbHome