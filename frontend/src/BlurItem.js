import { useState, React } from "react";
import "./style/item.css"


import { Link } from "react-router-dom";
const Item = ({ top, left, animation, shape }) => {
    const [onHover, setOnHover] = useState(false)

    const getRandomDuration = (min, max) => {

        const randomDuration = Math.random() * (max - min) + min;

        // Round to 2 decimal places for better readability (optional)
        return Math.round(randomDuration * 100) / 100;
    }
    const isLeftPositionLarge = left > (window.innerWidth * 2 / 3);
    return (
        <Link to={'/Dashboard'} className="blur-container--url">
            <div className={`item ${shape}`} style={
                {
                    top: `${top}px`,
                    left: `${left}px`,
                    animation: `popUp 2s none, ${animation} ${getRandomDuration(4, 6)}s ease-in-out infinite`,
                    filter: `blur(${getRandomDuration(5, 20)}px)`
                }

            }
                onMouseEnter={() => setOnHover(true)}
                onMouseLeave={() => setOnHover(false)}
            >
                {onHover && <ItemInfo isLeftPositionLarge={isLeftPositionLarge} />}
            </div>
        </Link>

    )
}

export default Item

const ItemInfo = ({ isLeftPositionLarge }) => {
    return (
        <div className="item--info"
            style={
                {
                    left: isLeftPositionLarge ? "-71%" : "109%"
                }
            }
        >
            <span className="item--info-name">SEL</span>
            <span className="item--info-number"> 0.00%</span>
        </div>
    )
}