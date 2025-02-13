import { useState, React } from "react";
import "../style/item.css"


import { Link } from "react-router-dom";

const Item = ({ top, left, animation, shape, crypto }) => {
    const [onHover, setOnHover] = useState(false)

    const getRandomDuration = (min, max) => {

        const randomDuration = Math.random() * (max - min) + min;

        // Round to 2 decimal places for better readability (optional)
        return Math.round(randomDuration * 100) / 100;
    }
    const isLeftPositionLarge = left > (window.innerWidth * 2 / 3);
    return (
        <Link to={'/Dashboard'} state={crypto} className="blur-container--url" >
            <div className={`item ${shape}`} style={
                {

                    top: `${top}px`,
                    backgroundImage: `url(${crypto.image})`,
                    left: `${left}px`,
                    animation: `popUp 2s none, ${animation} ${getRandomDuration(4, 6)}s ease-in-out infinite`,
                    filter: `blur(${getRandomDuration(5, 20)}px)`,
                    AnimationTimeline: `view()`
                }

            }
                onMouseEnter={() => setOnHover(true)}
                onMouseLeave={() => setOnHover(false)}
            >

                {onHover && <ItemInfo isLeftPositionLarge={isLeftPositionLarge} id={crypto.id} />}
            </div>

        </Link >
    )
}

export default Item

const ItemInfo = ({ isLeftPositionLarge, id, name }) => {
    return (
        <div className="item--info"
            style={
                {
                    left: isLeftPositionLarge ? "-71%" : "109%"
                }
            }
        >
            <span className="item--info-name">{id}</span>
            <span className="item--info-number"> 0.00%</span>
        </div>
    )
}