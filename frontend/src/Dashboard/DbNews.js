import React from "react";
import img1 from "../asset/db-background1.jpg"
import img2 from "../asset/db-background2.jpg"
import img3 from "../asset/db-background3.jpg"

import DNImageSlider from "./DnImageSlider";
const IMAGES = [
    { url: img1, alt: "Image 1" },
    { url: img2, alt: "Image 2" },
    { url: img3, alt: "Image 3" },
]
const DashNews = () => {
    return (
        <>
            <section className="DN-section">
                <DNImageSlider images={IMAGES} />
            </section>
            <DNContent title={"Title"} span={"Thanh Hoas"} />
        </>

    )
}

export default DashNews

const DNContent = ({ title, span }) => {
    return (
        <section className="DN-section2">
            <h1 className="DN-section2-title">{title}</h1>
            <div className="DN-section2-container">
                <div className="DN-section2-container-img">
                    <img src={`${require("../asset/db-background2.jpg")}`} />

                </div>

                <p className="DN-section2-container-para">
                    <span>{span}</span>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga, voluptatum.                </p>


            </div>
        </section>
    )
}