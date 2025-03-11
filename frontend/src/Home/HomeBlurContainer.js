import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import Item from "./HomeBlurContainerItem";
import SwapContainer from "./HomeBlurContainerSwapContainer";
import PopUp from "./HomeBlurContainerPopup";
import '../style/home.css';
import cryptoImages from "./HomeBlurContainerCryptoImages";

const image1 = require("../asset/temp.png");

const BlurContainer = () => {
    const containerRef = useRef(null);
    const [containerHeight, setContainerHeight] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);
    const [popUp, setPopUp] = useState(false);
    const [block, setBlock] = useState({
        image: image1,
        id: "SEL",
        name: "Seelecoin"
    });
    const [randomAddresses, setRandomAddresses] = useState([]); // Only state for addresses

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await fetch('/static_addresses.txt');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const text = await response.text();

                const lines = text.split('\n').filter(line => line.trim() !== '');
                const formattedAddresses = lines.map(line => {
                    const [address, coinType] = line.split(',');
                    const trimmedCoin = coinType.trim().toLowerCase();
                    let id = null, image = null;
                    switch (trimmedCoin) {
                        case "bitcoin":
                            id = "BTC";
                            image = cryptoImages["bitcoin-btc-logo.png"];
                            break;
                        case "ethereum":
                            id = "ETH";
                            image = cryptoImages["ethereum-eth-logo.png"];
                            break;
                        case "seelecoin":
                            id = "SEL";
                            image = image1;
                            break;
                        default:
                            return null;
                    }

                    return {
                        address: address.trim(),
                        id: id,
                        name: trimmedCoin,
                        image: image
                    };
                }).filter(address => address !== null);

                // Select 6 random addresses directly
                const shuffled = [...formattedAddresses].sort(() => 0.5 - Math.random());
                const selectedAddresses = shuffled.slice(0, 6);
                setRandomAddresses(selectedAddresses);
                console.log("Random 6 addresses:", selectedAddresses);

            } catch (error) {
                console.error('Error fetching the addresses:', error);
            }
        };

        fetchAddresses();
    }, []);

    useLayoutEffect(() => {
        const container = containerRef.current;
        setContainerHeight(container.offsetHeight);
        setContainerWidth(container.offsetWidth);
    }, []);

    const handleOnClick = () => {
        setPopUp(!popUp);
    };

    const getRandomLeft = () => {
        return Math.floor(Math.random() * containerWidth);
    };

    const getRandomTop = () => {
        return Math.floor(Math.random() * (containerHeight - 120));
    };

    const getRandomAnimation = () => {
        const animations = ['float1', 'float2', 'float3', 'float4'];
        return animations[Math.floor(Math.random() * animations.length)];
    };

    const getRandomShape = () => {
        const shapes = ['circle', 'square'];
        return shapes[Math.floor(Math.random() * shapes.length)];
    };

    return (
        <>
            <div className="home-component-1" id="home-component-1">
                <div ref={containerRef} className="blur-container">
                    {
                        randomAddresses.map((crypto, index) => {
                            return (
                                <Item
                                    crypto={crypto}
                                    key={index}
                                    top={getRandomTop()}
                                    left={getRandomLeft()}
                                    animation={getRandomAnimation()}
                                    shape={getRandomShape()}
                                />
                            );
                        })
                    }
                </div>

                <div className="home-component--content">
                    <h1 className="home-component--title">Search anytime, anywhere</h1>
                    <SwapContainer handleOnClick={handleOnClick} id={block.id} image={block.image} name={block.name} />
                    <p className="home-component--footer">the best crypto exchange</p>
                </div>
            </div>
            <PopUp onClick={handleOnClick} setBlock={setBlock} show={popUp} />
        </>
    );
};

export default BlurContainer;