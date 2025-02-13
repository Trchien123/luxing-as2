import React from "react";

const DbHomeContainer = ({ Address, image }) => {
    return (
        <div className="DbHomeContainer-1" style={
            {
                backgroundImage: `${image}`
            }
        }>

            <div>
                <h1 className="DbHomeContainer-1--title">{Address}</h1>
                <p className="DbHomeContainer-1--span">Explore more information with Dashboard</p>
            </div>


            <p className="DbHomeContainer-1--info">More Details</p>


        </div>


    )
}

export default DbHomeContainer