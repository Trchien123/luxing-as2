import React, { useRef, useState } from "react";
import SwapBox from "./SwapBox";

const SwapContainer = ({ handleOnClick }) => {
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
            {/* <div className="swap-box-wrapper">
                <SwapBox span={"Sell"} ref={input1Ref} handleOnClick={handleOnClick} />
                <button className="swap-box--select" onClick={toggleFocus}>
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M11.0001 3.67157L13.0001 3.67157L13.0001 16.4999L16.2426 13.2574L17.6568 14.6716L12 20.3284L6.34314 14.6716L7.75735 13.2574L11.0001 16.5001L11.0001 3.67157Z"
                            fill="currentColor"
                        />
                    </svg>
                </button>
            </div> */}

            <SwapBox span={"Buy"} ref={input2Ref} handleOnClick={handleOnClick} />
            <button className="swap-button" >Get Started </button>
        </div>
    )
}

export default SwapContainer