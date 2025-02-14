import React, { useState } from "react";
import SwapBox from "./HomeBlurContainerSwapContainerSwapBox";
import { Link } from "react-router-dom";


const SwapContainer = ({ handleOnClick, id, image, name }) => {
    const [input, setInput] = useState(null)

    return (
        <div className="swap-box">



            <SwapBox span={"Search"} handleOnClick={handleOnClick} setInput={setInput} title={id} image={image} />
            <Link to={"/Dashboard "} state={
                {
                    address: input,
                    id: id,
                    image: image,
                    name: name
                }}>
                <button className="swap-button" >Get Started </button>
            </Link>

        </div>
    )
}

export default SwapContainer