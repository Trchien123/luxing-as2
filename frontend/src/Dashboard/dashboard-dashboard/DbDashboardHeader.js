import React, { useState } from "react";
import Notification from "./DbDashboardHeaderNotification";
import { Link } from "react-router-dom";
import { validateInput } from "../../ValidateInput";
const DbHeader = ({ scrolled, setShowBar, showBar, crypto }) => {

    const [showNoti, setShowNoti] = useState(false)

    const [input, setInput] = useState("")

    const handleValidation = () => {
        const { isValid, error: validationError } = validateInput(input, crypto.id);

        if (validationError) {
            alert(validationError)
        }
        return isValid;
    };
    return (
        <>
            <header className={`DB-container--header ${scrolled && window.innerWidth > 768 ? "scrolled" : ""}`}>
                <div className="DB--title">
                    <div className="Db--items-icon"
                        onClick={() => setShowBar(!showBar)}
                    >
                        {
                            showBar ? <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6H6m12 4H6m12 4H6m12 4H6" />
                            </svg>
                                : <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 6h8m-8 4h12M6 14h8m-8 4h12" />
                                </svg>


                        }


                    </div>
                    <h3>Dashboard</h3>
                </div>
                <div className="DB--items">

                    <form className="DB--items-form" onSubmit={(e) => e.preventDefault()}>


                        <input type="text"
                            onChange={(event) => setInput(event.target.value)}
                            placeholder={`Enter ${crypto.id} here`} className="search-bar" />
                        <Link
                            to="/Dashboard"
                            state={{ address: input, id: crypto.id, name: crypto.name, image: crypto.image }}
                            onClick={(e) => {
                                if (!handleValidation()) {
                                    e.preventDefault(); // Stop navigation if invalid
                                }
                            }}
                        >
                            <button className="Db--items-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                                    <path d="M 20.5 6 C 12.509634 6 6 12.50964 6 20.5 C 6 28.49036 12.509634 35 20.5 35 C 23.956359 35 27.133709 33.779044 29.628906 31.75 L 39.439453 41.560547 A 1.50015 1.50015 0 1 0 41.560547 39.439453 L 31.75 29.628906 C 33.779044 27.133709 35 23.956357 35 20.5 C 35 12.50964 28.490366 6 20.5 6 z M 20.5 9 C 26.869047 9 32 14.130957 32 20.5 C 32 23.602612 30.776198 26.405717 28.791016 28.470703 A 1.50015 1.50015 0 0 0 28.470703 28.791016 C 26.405717 30.776199 23.602614 32 20.5 32 C 14.130953 32 9 26.869043 9 20.5 C 9 14.130957 14.130953 9 20.5 9 z"></path>
                                </svg>

                            </button>
                        </Link>

                    </form>
                    <button className="Db--items-icon" id="icon-bell" onClick={() => { setShowNoti(!showNoti) }}>
                        <svg viewBox="0 0 448 512" class="bell">
                            <path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"></path>
                        </svg>
                    </button>
                </div>
                {
                    showNoti && <Notification />
                }
            </header >


        </>


    )
}

export default DbHeader;