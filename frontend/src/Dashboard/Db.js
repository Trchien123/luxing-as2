import { React, useState, useEffect, useRef } from "react";
import '../style/dashboard.css';
import {
    Outlet,
    useLocation
} from 'react-router-dom';

import DbHeader from "./dashboard-dashboard/DbDashboardHeader"
import FetchTransactions from "./dashboard-table/FetchTransactions";
import DbNavbar from "./DbNavbar";
const Dashboard = () => {
    const location = useLocation();

    const crypto = location.state
    console.log(crypto)
    const response = FetchTransactions(crypto.address, crypto.name.toLowerCase());
    const [scrolled, setScrolled] = useState(false);
    const containerRef = useRef(null);
    const [showBar, setShowBar] = useState(true)
    useEffect(() => {
        const handleScroll = () => {
            const container = containerRef.current;
            if (container.scrollTop > 0) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        const container = containerRef.current;
        container.addEventListener("scroll", handleScroll);

        return () => {
            container.removeEventListener("scroll", handleScroll);
        };
    }, []);


    console.log(response)
    return (

        <section section className="DB-section" >
            {
                showBar && <DbNavbar setShowBar={setShowBar} crypto={crypto} />
            }
            <div ref={containerRef} className="DB-container">


                <DbHeader scrolled={scrolled} setShowBar={setShowBar} showBar={showBar} crypto={crypto} />


                <Outlet context={{
                    crypto,
                    response,
                }} />
            </div>


        </section >
    )
}

export default Dashboard