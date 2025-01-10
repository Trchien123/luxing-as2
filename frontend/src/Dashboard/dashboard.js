import { React, useState, useEffect, useRef } from "react";
import '../style/dashboard.css';
import {
    Link,
    BrowserRouter as Router,
    Routes,
    Route
} from 'react-router-dom';

import DbHeader from "./DbHeader";
import DbContainer1 from "./DbContainer1";
import DbHome from "./DbDashboard";
import DashTable from "./DashTable";
import DbNavbar from "./DbNavbar";
const Dashboard = () => {
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
    return (
        <section className="DB-section">
            {
                showBar && <DbNavbar setShowBar={setShowBar} />
            }
            <div ref={containerRef} className="DB-container">

                <DbHeader scrolled={scrolled} setShowBar={setShowBar} showBar={showBar} />
                <Routes>
                    <Route path='/' element={<DbHome />} />
                    <Route exact path='/Table' element={<DashTable />} />
                </Routes>
            </div>


        </section>
    )
}

export default Dashboard