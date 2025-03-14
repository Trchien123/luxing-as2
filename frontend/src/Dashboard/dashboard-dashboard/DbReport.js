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

  useEffect(() => {
    const checkAddress = async () => {
      if (!address) {
        console.log("No address provided");
        return;
      }

      setCheckState("checking");

      if (SUSPICIOUS_ACCOUNTS.includes(address)) {
        setCheckState("error");
        return;
      }

      try {
        const scamsResponse = await fetch("/scams.json");
        const scamsData = await scamsResponse.json();
        
        if (scamsData.suspicious.includes(address)) {
          setCheckState("error");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/chainalysis/${address}`
        );
        const data = response.data;
        console.log("Chainalysis response:", data);

        if (data.identifications && data.identifications.length > 0) {
          setCheckState("error");
        } else {
          setCheckState("verified");
        }
      } catch (error) {
        console.error("Chainalysis fetch error:", error);
        setCheckState("error");
      }
    };

    checkAddress();
  }, [address]);

  return (
    <div className="report-container">
      {checkState === "idle" && <p>Waiting for address...</p>}
      {checkState === "checking" && <p>🔄 Checking transactions...</p>}
      {checkState === "verified" && (
        <div className="verified-screen">
          <img src={approveIcon} alt="Verified" className="status-icon" />
          <p>✅ Address is verified, no issues found.</p>
        </div>
      )}
      {checkState === "error" && (
        <div className="error-screen">
          <img src={errorIcon} alt="Error" className="status-icon" />
          <p>⚠️ Address is flagged for suspicious activity.</p>
        </div>
      )}
    </div>
  );
};

export default DbReport;
