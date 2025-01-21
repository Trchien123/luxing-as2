import React from "react";

const DbContainer1 = () => {
  return (
    <div className="DB-main-container-1">
      <DbItem1 />
      <DbItem1 />
      <DbItem1 />
    </div>
  );
};

export default DbContainer1;

const DbItem1 = () => {
  return (
    <div className="Db-main-1-items">
      <div className="card-header">
        <div className="title">
          <svg
            class="w-6 h-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fill-rule="evenodd"
              d="M12 14a3 3 0 0 1 3-3h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4a3 3 0 0 1-3-3Zm3-1a1 1 0 1 0 0 2h4v-2h-4Z"
              clip-rule="evenodd"
            />
            <path
              fill-rule="evenodd"
              d="M12.293 3.293a1 1 0 0 1 1.414 0L16.414 6h-2.828l-1.293-1.293a1 1 0 0 1 0-1.414ZM12.414 6 9.707 3.293a1 1 0 0 0-1.414 0L5.586 6h6.828ZM4.586 7l-.056.055A2 2 0 0 0 3 9v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2h-4a5 5 0 0 1 0-10h4a2 2 0 0 0-1.53-1.945L17.414 7H4.586Z"
              clip-rule="evenodd"
            />
          </svg>
          <span>Balance</span>
        </div>
      </div>
      <div className="card-body">
        <div className="coin">53.000 ETH</div>
        <div className="money">~ 104.872,43 USD</div>
      </div>
    </div>
  );
};
