import { React, useState, useEffect, useRef } from "react";
import '../style/dashboard.css';
import {
    Outlet,
    useLocation
} from 'react-router-dom';

import DbHeader from "./DbHeader";

import DbNavbar from "./DbNavbar";
const Dashboard = () => {
    const location = useLocation();

    const image = location.state
    console.log(image)
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
                showBar && <DbNavbar setShowBar={setShowBar} avatar={image} />
            }
            <div ref={containerRef} className="DB-container">

                <DbHeader scrolled={scrolled} setShowBar={setShowBar} showBar={showBar} />
                <Outlet />
            </div>


        </section>
    )
}

export default Dashboard