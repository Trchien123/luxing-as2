import React, { useRef, useLayoutEffect, useState } from "react";
import Item from "./BlurItem";
import SwapContainer from "./SwapContainer";
import PopUp from "./popup";
import './style/home.css'
const BlurContainer = () => {
    const containerRef = useRef(null);
    const [containerHeight, setContainerHeight] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);
    const [popUp, setPopUp] = useState(false)
    const [block, setBlock] = useState(null)
    useLayoutEffect(() => {
        const container = containerRef.current;
        setContainerHeight(container.offsetHeight);
        setContainerWidth(container.offsetWidth);
    }, []);

    const handleOnClick = () => {
        console.log("clicked")
        setPopUp(!popUp)
    }

    const getRandomLeft = () => {
        return Math.floor(Math.random() * containerWidth);
    }

    const getRandomTop = () => {
        return Math.floor(Math.random() * (containerHeight - 120));
    }
    const getRandomAnimation = () => {
        const animations = ['float1', 'float2', 'float3', 'float4'];
        return animations[Math.floor(Math.random() * animations.length)];
    }
    const getRandomShape = () => {
        const shapes = ['circle', 'square']
        return shapes[Math.floor(Math.random() * shapes.length)];
    }
    return (

        <>

            <div className="home-component-1">

                <div ref={containerRef} className="blur-container">

                    {
                        Array(6).fill(0).map((item, index) => {
                            return (

                                <Item
                                    key={index} // Assign a unique key to each item
                                    top={getRandomTop()} // Generate random top value
                                    left={getRandomLeft()} // Generate random left value
                                    animation={getRandomAnimation()}
                                    shape={getRandomShape()}
                                />

                            )
                        }
                        )
                    }



                </div>

                <div className="home-component--content">
                    <h1 className="home-component--title">Swap anytime, anywhere</h1>

                    <SwapContainer handleOnClick={handleOnClick} />
                    <p className="home-component--footer">the best crypto exchange</p>

                </div>
            </div >
            {popUp && <PopUp onClick={handleOnClick} setBlock={setBlock} />}

        </>
    )
}

export default BlurContainer