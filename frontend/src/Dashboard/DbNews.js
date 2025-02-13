import React from "react";
import img1 from "../asset/DbNews-image-1.jpg"
import img2 from "../asset/DbNews-image-2.jpg"
import img3 from "../asset/DbNews-image-3.jpg"

import DNImageSlider from "./DnImageSlider";
import Footer from "../Footer";
const IMAGES = [
    { url: img1, alt: "Image 1" },
    { url: img2, alt: "Image 2" },
    { url: img3, alt: "Image 3" },
]
const STICKYCONTENT = [
    { url: img1, title: "Da Nang", content: "A leading cryptocurrency exchange has announced a partnership with a major traditional bank, allowing users to seamlessly transfer funds between fiat and digital currencies. This collaboration aims to enhance user experience and promote mainstream adoption of cryptocurrencies, bridging the gap between traditional finance and digital assets." },
    { url: img2, title: "Ho Chi Minh", content: "Ethereum’s long-awaited 2.0 upgrade has been successfully implemented, transitioning the network from proof-of-work to proof-of-stake. This upgrade is expected to improve scalability, reduce energy consumption, and enhance security. Developers are optimistic that this transition will attract more users and investors to the Ethereum ecosystem." },

    { url: img3, title: "Swinburne", content: "After a slowdown, the NFT market is experiencing a resurgence in interest and sales. Major brands and artists are re-entering the space, launching new collections and collaborations. Analysts suggest that innovative use cases and improved platforms are driving this renewed enthusiasm among collectors and investors alike." }
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
                        NFT sales have surged, with collectors eager for unique digital art pieces, revitalizing interest in the non-fungible token market.                        </h1>
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


        }}>
            <div className="Dn-sticky-container-img">
                <img src={data.url} alt="data url" />
            </div>
            <div className="Dn-sticky-container-content">
                <h1>{data.title}</h1>
                <p>{data.content}</p>
            </div>
        </div>
    )
}