import React from "react";
import Item from "./BlurItem";
import './style/home.css'
const BlurContainer = () => {
    const getRandomLeft = () => {
        return Math.floor(Math.random() * window.innerWidth);
    }
    const getRandomTop = () => {
        return Math.floor(Math.random() * window.innerHeight);
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
                <div className="blur-container">
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