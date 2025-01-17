import React, { useState, useEffect, useRef } from "react";
import img1 from "../asset/db-background1.jpg"
import img2 from "../asset/db-background2.jpg"
import img3 from "../asset/db-background3.jpg"

import DNImageSlider from "./DnImageSlider";
import Footer from "../Footer";
const IMAGES = [
    { url: img1, alt: "Image 1" },
    { url: img2, alt: "Image 2" },
    { url: img3, alt: "Image 3" },
]
const STICKYCONTENT = [
    { url: img1, title: "Thanh Hoa", content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto eaque sed ad eum consectetur, rerum debitis commodi ut aut quae omnis, dolores molestias unde tenetur nihil. Eveniet consectetur vel provident?" },
    { url: img1, title: "Thanh Hoa", content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto eaque sed ad eum consectetur, rerum debitis commodi ut aut quae omnis, dolores molestias unde tenetur nihil. Eveniet consectetur vel provident?" },

    { url: img1, title: "Thanh Hoa", content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto eaque sed ad eum consectetur, rerum debitis commodi ut aut quae omnis, dolores molestias unde tenetur nihil. Eveniet consectetur vel provident?" }
]

const DashNews = () => {
    return (
        <>
            <section className="DN-section">
                <DNImageSlider images={IMAGES} />
            </section>

            <section>
                <h1 className="DN-section2-title">News</h1>
                <DNStickyScroll data={STICKYCONTENT} />
            </section>
            <section className="DN-section3">
                <div className="DN-section3-container">
                    <h1 className="title">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel dolores earum perferendis dolore nihil harum sint hic! Animi, veniam nobis!
                    </h1>
                    <button className="DN-section3-container-btn">More Details</button>
                </div>
            </section>
            <hr style={{
                width: "80%",
                margin: "auto"
            }}></hr>
            <Footer />
        </>

    )
}

export default DashNews
const DNStickyScroll = ({ data }) => {


    return (
        <div className="DN-sticky-scroll" style={{
            "--height": "400px",
            "--quantity": "3"
        }}>
            {
                data.map((item, index) => (
                    <DNStickyContent data={item} index={index} />

                ))
            }
        </div >
    )
}
const DNStickyContent = ({ data, index }) => {
    return (
        <div className="Dn-sticky-container" style={{
            zIndex: index,
            top: "120px",
            backgroundColor: "red",

        }}>
            <div className="Dn-sticky-container-img">
                <img src={data.url} />
            </div>
            <div className="Dn-sticky-container-content">
                <h1>{data.title}</h1>
                <p>{data.content}</p>
            </div>
        </div>
    )
}