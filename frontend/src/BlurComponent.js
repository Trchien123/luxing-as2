import React, { useRef, useLayoutEffect, useState } from "react";
import Item from "./BlurItem";


import './style/home.css'
const BlurContainer = () => {
    const containerRef = useRef(null);
    const [containerHeight, setContainerHeight] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);

    useLayoutEffect(() => {
        const container = containerRef.current;
        setContainerHeight(container.offsetHeight);
        setContainerWidth(container.offsetWidth);
    }, []);

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
                    <h1 className="home-component--conten--header">this is the search bar</h1>
                    <form onsubmit="event.preventDefault();" role="search">
                        <label for="search">Search for stuff</label>
                        <input id="search" type="search" placeholder="Search..." autofocus required />
                        <button type="submit">Go</button>
                    </form>

                </div>



            </div >
        </>
    )
}

export default BlurContainer