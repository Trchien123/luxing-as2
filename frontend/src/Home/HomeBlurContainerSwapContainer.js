import React, { useState } from "react";
import SwapBox from "./HomeBlurContainerSwapContainerSwapBox";
import { Link } from "react-router-dom";
import { validateInput } from "../ValidateInput";

const SwapContainer = ({ handleOnClick, id, image, name }) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState(""); // Store error message

  const handleValidation = () => {
    const { isValid, error: validationError } = validateInput(input, crypto.id);

    setError(validationError)
    return isValid;
  };
  return (
    <div className="swap-box">
      <form onSubmit={(e) => e.preventDefault()}>
        <SwapBox
          span="Search"
          handleOnClick={handleOnClick}
          setInput={setInput}
          title={id}
          image={image}
        />
        {error && <p className="error-message">{error}</p>}{" "}
        {/* Show error message */}
        <Link
          to="/Dashboard"
          state={{ address: input, id, image, name }}
          onClick={(e) => {
            if (!handleValidation()) {
              e.preventDefault(); // Stop navigation if invalid
            }
          }}
        >
          <button className="swap-button">Get Started</button>
        </Link>
      </form>
    </div>
  );
};

export default SwapContainer;