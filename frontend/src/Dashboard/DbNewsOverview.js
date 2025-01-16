import React from "react";

import newsImages from "./NewsImages";
import { Link } from "react-router-dom"
const NewsOverview = () => {



    return (
        <>
            <h1 className="newsOverview-title"> News</h1>
            <Link to={'/Dashboard/News'} className="Db-navbar-url ">
                <div className="newsOverview-slider" style={{
                    "--width": `230px`,
                    "--height": "270px",
                    "--quantity": "4",
                    "--duration": "8s"
                }}>
                    <div className="newsOverview-list">
                        <div className="news-item news-item-1" style={{ "--position": "1" }}  ><img src={newsImages.image1} alt="" /></div>
                        <div className="news-item news-item-2" style={{ "--position": "2" }}><img src={newsImages.image2} alt="" /></div>
                        <div className="news-item news-item-3" style={{ "--position": "3" }} ><img src={newsImages.image3} alt="" /></div>
                        <div className="news-item news-item-4" style={{ "--position": "4" }} ><img src={newsImages.image4} alt="" /></div>
                    </div>
                </div >
            </Link>
        </>
    )
}
export default NewsOverview