import React, { useRef, useState } from "react";
import SwapBox from "./HomeBlurContainerSwapContainerSwapBox";

const SwapContainer = ({ handleOnClick, span, image }) => {
    const input1Ref = useRef(null)
    const input2Ref = useRef(null)
    const [currentFocus, setCurrentFocus] = useState("input1")

    const toggleFocus = () => {

        if (input1Ref.current && input2Ref.current) {
            if (currentFocus === "input1") {
                input2Ref.current.focus(); // Focus on the second input
                setCurrentFocus("input2"); // Update state
            } else {
                input1Ref.current.focus(); // Focus on the first input
                setCurrentFocus("input1"); // Update state
            }
        } else {
            console.error("Refs are not assigned correctly!"); // Debugging log
        }

    };
    return (
        <div className="swap-box">


            <SwapBox span={"Search"} ref={input2Ref} handleOnClick={handleOnClick} title={span} image={image} />
            <button className="swap-button" >Get Started </button>
        </div>
    )
}

export default SwapContainer