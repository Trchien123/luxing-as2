import React from "react";
import "../style/popup.css";

import Token from "./HomeBlurContainerPopupToken";

const DATA = [
  {
    image: require("../asset/cryptos/bitcoin-btc-logo.png"),
    title: "Bitcoin",
    content: "BTC",
  },
  {
    image: require("../asset/cryptos/ethereum-eth-logo.png"),
    title: "Ethereum",
    content: "ETH",
  },
  { image: require("../asset/temp.png"), title: "Seelecoin", content: "SEL" },
];

const PopUp = ({ onClick, setBlock, show }) => {
  const handleTokenOnClick = (url, title, content) => {
    setBlock({
      image: url,
      id: content,
      name: title,
    });

    onClick();
  };
  return (
    <div className={`home-component-1--popup ${show ? "show" : "hide"}`}>
      <div className="home-component-1--overlay " onClick={onClick}></div>
      <div className="home-component-1--card">
        <div className="home-component-1--card--header">
          <p>Select a Token</p>
          <button onClick={onClick}>
            <svg
              class="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 12h14m-7 7V5"
              />
            </svg>
          </button>
        </div>

        <p className="home-component-1--tokens">Tokens</p>
        <div className="home-component-1--card-container">
          {DATA.map(({ image, title, content }, index) => (
            <Token
              key={index}
              image={image}
              title={title}
              content={content}
              handleTokenOnClick={handleTokenOnClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopUp;
