import { useState, React, forwardRef } from "react";

const SwapBox = forwardRef(({ span, handleOnClick, title, image }, ref) => {

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
                    <input type="text" placeholder="Type here..."
                        ref={ref}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}

                    ></input>
                    <div className="select-box" onClick={handleOnClick}>
                        <div className="select-box--img" style={{
                            backgroundImage: `url(${image})`
                        }}></div>
                        <span> {title}</span>

                    </div>



                </div>


            </div>
        </>
    )
});

export default SwapBox;