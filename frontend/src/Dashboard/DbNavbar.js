import React from "react";
import DbItem from "./DbItem";
import { Link } from "react-router-dom";

const DbNavbar = ({ setShowBar }) => {
    const handleShowBar = () => {
        if (window.innerWidth <= 768) {
            setShowBar(false)
        }
    }
    return (
        <div className="DB-navbar"
            onClick={handleShowBar}
        >
            <div className="DB-navbar__header">
                <Link to={'/'} className="Db-navbar-url ">

                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12l4-4m-4 4 4 4" />
                    </svg>



                </Link>

                <div className="Db-navbar-showBar" onClick={() => setShowBar(false)}>
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6H6m12 4H6m12 4H6m12 4H6" />
                    </svg>

                </div>



            </div>

            <div className="avatar">

            </div>
            <h1 className="navbar--name">Address</h1>

            <div className="content">
                <Link to={'/Dashboard'} className="navbar--name--url">
                    <DbItem content={"Dashboard"} />
                </Link>


                <Link to={'/Dashboard/Table'} className="navbar--name--url">
                    <DbItem content={"Table"} />
                </Link>
                <Link to={'/Dashboard/History'} className="navbar--name--url">
                    <DbItem content={"History"} />
                </Link>


            </div>
        </div>
    )
}

export default DbNavbar