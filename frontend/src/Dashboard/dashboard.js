import { React, useState, useEffect, useRef } from "react";
import '../style/dashboard.css';

import DbItem from "./DbItem";
import DbHeader from "./DbHeader";
import DbContainer1 from "./DbContainer1";
const Dashboard = () => {
    const [scrolled, setScrolled] = useState(false);
    const containerRef = useRef(null);

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
            <div className="DB-navbar">
                <div className="avatar">

                </div>
                <h1 className="navbar--name">Address</h1>

                <div className="content">

                    <DbItem />
                    <DbItem />
                    <DbItem />
                </div>
            </div>
            <div ref={containerRef} className="DB-container">

                <DbHeader scrolled={scrolled} />
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
            </div>
        </section>
    )
}

export default Dashboard