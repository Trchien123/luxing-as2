import React, { useState } from "react";

import { ArrowBigLeft, ArrowBigRight, Circle, CircleDot } from "lucide-react"


const DNImageSlider = ({ images }) => {

    const [imageIndex, setImageIndex] = useState(0)
    const showNextImage = () => {
        setImageIndex(index => {
            if (index == images.length - 1) return 0
            return index + 1
        })
    }
    const showPrevImage = () => {
        setImageIndex(index => {
            if (index == 0) return images.length - 1
            return index - 1
        })
    }
    return (
        <section className="Dn-img-slider" style={{ width: "100%", height: "100%" }}>
            <div style={{ width: "100%", height: "100%", display: "flex", overflow: "hidden" }}>
                {images.map(({ url, alt }, index) => (

                    <img key={url} src={url} alt={alt} aria-hidden={imageIndex !== index} className="Dn-img-slider-img" style={{
                        translate: `${-100 * imageIndex}%`
                    }} />
                ))}
            </div>
            <button
                onClick={showPrevImage}
                className="Dn-img-slider-btn"
                style={{ left: "0" }}
                aria-label="View Previous label"

            >
                <ArrowBigLeft aria-hidden /></button>
            <button
                onClick={showNextImage}
                className="Dn-img-slider-btn"
                aria-label="View Next label"
                style={{ right: "0" }}
            ><ArrowBigRight aria-hidden /></button>
            <div style={{
                position: "absolute",
                bottom: ".5rem",
                display: "flex",
                left: "50%",
                transform: "translateX(-50%)",
                gap: ".25rem"
            }}>
                {images.map((_, index) => (
                    <button key={index}
                        className="Dn-img-slider-dotbtn"
                        onClick={() => setImageIndex(index)}
                        aria-label={`View image ${index}`}
                    >{index === imageIndex ? <CircleDot aria-hidden /> : <Circle aria-hidden />} </button>
                ))}
            </div>
        </section>
    )
}

export default DNImageSlider