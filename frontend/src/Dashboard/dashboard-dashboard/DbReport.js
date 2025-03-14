import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../style/ReportTable.css";
import approveIcon from "../../asset/approve.png";
import errorIcon from "../../asset/error.png";

const SUSPICIOUS_ACCOUNTS = [
  "0x7db57c738b27c5f9b898248385306d30053f54fd",
  "0x6598a3f7c9583f4aa830e26589d41c05f7008b28",
  "0x8d08aad4b2bac2bb761ac4781cf62468c9ec47b4",
  "0xb0606f433496bf66338b8ad6b6d51fc4d84a44cd",
];

const DbReport = ({ address }) => {
  const [checkState, setCheckState] = useState("idle");
  const [errorLogs, setErrorLogs] = useState([]);
  const [expandedErrorId, setExpandedErrorId] = useState(null);

  useEffect(() => {
    const checkAddress = async () => {
      if (!address) {
        console.log("No address provided");
        return;
      }

      setCheckState("checking");

      if (SUSPICIOUS_ACCOUNTS.includes(address)) {
        setCheckState("error");
        setErrorLogs([
          {
            id: 1,
            message: "Address is flagged.",
            details: "This address is known for suspicious activities.",
          },
        ]);
        return;
      }

      try {
        // ✅ Corrected fetch path
        const scamsResponse = await fetch("/scams.json");

        if (!scamsResponse.ok) {
          throw new Error(`HTTP error! Status: ${scamsResponse.status}`);
        }

        const scamsData = await scamsResponse.json();
        console.log("Scams Data:", scamsData); // Debugging

        // ✅ Extracting addresses safely
        const suspiciousAddresses = scamsData.flatMap(
          (entry) => entry.addresses || []
        );

        console.log("Suspicious Addresses:", suspiciousAddresses); // Debugging

        if (suspiciousAddresses.includes(address)) {
          setCheckState("error");
          setErrorLogs([
            {
              id: 2,
              message: "Address found in scam database.",
              details: "Reported in multiple fraud cases.",
            },
          ]);
          return;
        }

        // ✅ Checking with backend API
        const response = await axios.get(
          `http://localhost:5000/api/chainalysis/${address}`
        );
        const data = response.data;
        console.log("Chainalysis response:", data);

        if (data.identifications && data.identifications.length > 0) {
          setCheckState("error");
          setErrorLogs(
            data.identifications.map((id, index) => ({
              id: index + 3,
              message: id.reason,
              details: id.details,
            }))
          );
        } else {
          setCheckState("verified");
        }
      } catch (error) {
        console.error("Error fetching scam data:", error);
        setCheckState("error");
        setErrorLogs([
          {
            id: 99,
            message: "Error fetching scam data",
            details: error.message,
          },
        ]);
      }
    };

    checkAddress();
  }, [address]);

  const toggleSeeMore = (id) => {
    setExpandedErrorId(expandedErrorId === id ? null : id);
  };

  return (
    <div className="report-table-container">
      <div className="lower-box">
        {checkState === "checking" && "Checking transactions..."}
        {checkState === "error" && "Verification failed, errors found."}
        {checkState === "verified" && "Verification complete, no error found."}
      </div>

      {checkState === "verified" && (
        <div className="icon-and-log">
          <img src={approveIcon} alt="Approval icon" className="status-icon" />
        </div>
      )}

      {checkState === "error" && (
        <div className="error-container">
          {errorLogs.map((error) => (
            <div
              key={error.id}
              className={`error-box ${
                expandedErrorId === error.id ? "expanded" : ""
              }`}
            >
              <img src={errorIcon} alt="Error icon" className="error-icon" />
              <div className="error-text">
                <span>{error.message}</span>
                {expandedErrorId === error.id && (
                  <p className="error-details">{error.details}</p>
                )}
                <button
                  className="see-more-button"
                  onClick={() => toggleSeeMore(error.id)}
                >
                  {expandedErrorId === error.id ? "See Less" : "See More"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DbReport;
