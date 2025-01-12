import React from "react";

const Small = ({ dotData, onClose }) => {
  if (!dotData) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        width: "250px",
        background: "white",
        padding: "10px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        zIndex: 2,
      }}
    >
      <h3>Dot Details</h3>
      <p>
        <strong>Dot Index:</strong> {dotData.index + 1}
      </p>
      <p>
        <strong>Position:</strong> 
        <br />
        X: {dotData.x.toFixed(2)} <br />
        Y: {dotData.y.toFixed(2)} <br />
        Z: {dotData.z.toFixed(2)}
      </p>
      <button
        onClick={onClose}
        style={{
          marginTop: "10px",
          padding: "5px 10px",
          background: "#f44336",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Close
      </button>
    </div>
  );
};

export default Small;
