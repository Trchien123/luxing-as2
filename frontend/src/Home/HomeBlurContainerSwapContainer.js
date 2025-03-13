import React, { useState } from "react";
import SwapBox from "./HomeBlurContainerSwapContainerSwapBox";
import { Link } from "react-router-dom";
import { validateInput } from "../ValidateInput";

const SwapContainer = ({ handleOnClick, id, image, name }) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState(""); // Store error message

  const isValidEthereumAddress = (address) =>
    /^0x[a-fA-F0-9]{40}$/.test(address);
  const isValidSeeleAddress = (address) =>
    seeleAddressList.includes(address.toLowerCase());
  const isValidBitcoinAddress = (address) =>
    /^(1|3|bc1)[a-zA-HJ-NP-Z0-9]{25,39}$/.test(address);

  const validateInput = () => {
    if (!input.trim()) {
      setError("⚠ Address cannot be empty!");
      return false;
    }

    if (id === "ETH") {
      if (!isValidEthereumAddress(input) && !isValidSeeleAddress(input)) {
        setError(
          "❌ Invalid Ethereum or Seele Address! Please enter a valid one."
        );
        return false;
      }
    }
    if (id === "SEL" && !isValidSeeleAddress(input)) {
      setError("❌ Invalid Seele Address! Please enter a valid one.");
      return false;
    }
    if (id === "BTC" && !isValidBitcoinAddress(input)) {
      setError("❌ Invalid Bitcoin Address! Please enter a valid one.");
      return false;
    }

    setError(""); // Clear error if input is valid
    return true;
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