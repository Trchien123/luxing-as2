import React from "react";
import DbItem from "./DbItem";
import { Link } from "react-router-dom";

const DbNavbar = ({ setShowBar }) => {

    return (
        <div className="DB-navbar"
            onBlur={() => setShowBar(false)}
        >
            <div className="DB-navbar__header">
                <Link to={'/'} className="Db-navbar-url ">

                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12l4-4m-4 4 4 4" />
                    </svg>



                </Link>
                {
                    window.innerWidth <= 768 ?
                        <div className="Db-navbar-showBar" onClick={() => setShowBar(false)}>
                            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6H6m12 4H6m12 4H6m12 4H6" />
                            </svg>

                        </div> :
                        ""
                }

            </div>

            <div className="avatar">

            </div>
            <h1 className="navbar--name">Address</h1>

            <div className="content">

                <DbItem content={"Dashboard"} />
                <Link to={'/Table'}>
                    <DbItem content={"Table"} />
                </Link>

                <DbItem content={"History"} />
            </div>
        </div>
    )
}

export default DbNavbar