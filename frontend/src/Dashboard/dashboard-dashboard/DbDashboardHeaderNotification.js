import React from "react";

const Notification = () => {
    return (
        <div className="notification">


            <button className="notification--close">
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5" />
                </svg>

            </button>



            <p className="notification--header">Notification</p>
            <div className="notification--container">
                <div className="notification--container--wrapper">
                    <img src={require("../../asset/temp.png")} alt="temp" />

                </div>
                <p className="notification--container--content">Notification content</p>
            </div>
        </div>
    )
}

export default Notification