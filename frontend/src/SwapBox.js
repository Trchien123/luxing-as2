import { useState, React, forwardRef } from "react";

const SwapBox = forwardRef(({ span, handleOnClick }, ref) => {

    const [onFocus, setOnFocus] = useState(false)



    const handleInputFocus = () => {
        setOnFocus(true)
    }
    const handleInputBlur = () => {
        setOnFocus(false)
    }
    return (
        <>
            <div className={`swap-box--container ${onFocus ? "focused" : ""}`}>
                <span className="swap-box--span">{span}</span>
                <div className="swap-box--input">
                    <input type="text" placeholder="0"
                        ref={ref}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}

                    ></input>
                    <div className="select-box" onClick={handleOnClick}>
                        <div className="select-box--img"></div>
                        <span> ETH</span>

                    </div>



                </div>
                {onFocus && <span className="swap-box--span">$0</span>}

            </div>
        </>
    )
});

export default SwapBox;