import { useState, React } from "react";

const SwapBox = ({ span, handleOnClick, setInput, title, image }) => {

    const [onFocus, setOnFocus] = useState(false)
    const handleInput = (e) => {
        setInput(e.target.value)
    }


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
                        onChange={handleInput}
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


            </div >
        </>
    )
};

export default SwapBox;