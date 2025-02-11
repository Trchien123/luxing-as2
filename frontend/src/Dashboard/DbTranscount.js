import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import './Transchart.css';

const TransChart = () => {
  const [chartWidth, setChartWidth] = useState(800); 
  const height = 450; 
  const margin = { top: 20, right: 20, bottom: 80, left: 60 };

  const [selectedMonth, setSelectedMonth] = useState("January");
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, value: "" });

  useEffect(() => {
    const handleResize = () => {
      const newWidth = Math.min(window.innerWidth * 0.9, 800); 
      setChartWidth(newWidth);
    };

    handleResize(); 
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const dataForMonths = {
    January: {
      Monday: { sent: 10, received: 15 },
      Tuesday: { sent: 20, received: 25 },
      Wednesday: { sent: 15, received: 10 },
      Thursday: { sent: 30, received: 20 },
      Friday: { sent: 25, received: 30 },
      Saturday: { sent: 20, received: 15 },
      Sunday: { sent: 10, received: 5 },
    },
    February: {
      Monday: { sent: 12, received: 18 },
      Tuesday: { sent: 22, received: 28 },
      Wednesday: { sent: 18, received: 12 },
      Thursday: { sent: 32, received: 22 },
      Friday: { sent: 28, received: 35 },
      Saturday: { sent: 25, received: 18 },
      Sunday: { sent: 15, received: 8 },
    },
    March: {
      Monday: { sent: 14, received: 20 },
      Tuesday: { sent: 24, received: 30 },
      Wednesday: { sent: 20, received: 15 },
      Thursday: { sent: 34, received: 25 },
      Friday: { sent: 30, received: 40 },
      Saturday: { sent: 28, received: 20 },
      Sunday: { sent: 18, received: 10 },
    },
    April: {
      Monday: { sent: 16, received: 22 },
      Tuesday: { sent: 26, received: 32 },
      Wednesday: { sent: 22, received: 18 },
      Thursday: { sent: 36, received: 28 },
      Friday: { sent: 32, received: 38 },
      Saturday: { sent: 30, received: 22 },
      Sunday: { sent: 20, received: 12 },
    },
    May: {
      Monday: { sent: 18, received: 24 },
      Tuesday: { sent: 28, received: 34 },
      Wednesday: { sent: 24, received: 20 },
      Thursday: { sent: 38, received: 30 },
      Friday: { sent: 34, received: 40 },
      Saturday: { sent: 32, received: 24 },
      Sunday: { sent: 22, received: 15 },
    },
  };

  const handleMonthClick = (month) => {
    setSelectedMonth(month);
  };

  const barWidth = (chartWidth - margin.left - margin.right) / (days.length * 3);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${chartWidth} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ maxWidth: "100%", height: "auto" }}
      >
        {/* X Axis */}
        <g transform={`translate(0, ${height - margin.bottom})`} style={{ fontSize: "12px" }}>
          <line x1={margin.left} x2={chartWidth - margin.right} stroke="black" />
          {days.map((day, index) => (
            <g key={day} transform={`translate(${margin.left + index * barWidth * 3 + barWidth * 2}, 0)`}>
              <text y={15} dy="0.71em" textAnchor="middle">
                {day}
              </text>
            </g>
          ))}
        </g>

        {/* Y Axis */}
        <g transform={`translate(${margin.left}, 0)`} style={{ fontSize: "12px" }}>
          <line y1={margin.top} y2={height - margin.bottom} stroke="black" />
          {d3.range(0, 45, 5).map((tick) => (
            <g
              key={tick}
              transform={`translate(0, ${
                height - margin.bottom - (tick * (height - margin.top - margin.bottom)) / 45
              })`}
            >
              <line x2={-6} stroke="black" />
              <text x={-10} dy="0.32em" textAnchor="end">
                {tick}
              </text>
            </g>
          ))}
        </g>

        {/* Bar Chart */}
        {days.map((day, index) => {
          const dayData = dataForMonths[selectedMonth]?.[day];
          if (!dayData) return null;
          const sentHeight = (dayData.sent * (height - margin.top - margin.bottom)) / 45;
          const receivedHeight = (dayData.received * (height - margin.top - margin.bottom)) / 45;

          return (
            <g
              key={day}
              transform={`translate(${margin.left + index * barWidth * 3 + barWidth * 1}, 0)`}
              onMouseEnter={() =>
                setTooltip({
                  visible: true,
                  x: margin.left + index * barWidth * 3 + barWidth * 1.5,
                  y: height - margin.bottom - Math.max(sentHeight, receivedHeight) - 10,
                  value: `Sent: ${dayData.sent}, Received: ${dayData.received}`,
                })
              }
              onMouseLeave={() => setTooltip({ visible: false, x: 0, y: 0, value: "" })}
            >
              {/* Sent Bar */}
              <rect
                className="bar"
                x={0}
                y={height - margin.bottom - sentHeight}
                width={barWidth}
                height={sentHeight}
                fill="steelblue"
              />

              {/* Received Bar */}
              <rect
                className="bar"
                x={barWidth + 5}
                y={height - margin.bottom - receivedHeight}
                width={barWidth}
                height={receivedHeight}
                fill="orange"
              />
            </g>
          );
        })}

        {/* Tooltip */}
        {tooltip.visible && (
          <g className="tooltip" transform={`translate(${tooltip.x}, ${tooltip.y})`}>
            <rect width="120" height="30" fill="white" stroke="black" rx="5" ry="5" />
            <text
              x="60"
              y="20"
              textAnchor="middle"
              fill="black"
              style={{ fontSize: "12px" }}
            >
              {tooltip.value}
            </text>
          </g>
        )}

        {/* Month Boxes at the Bottom */}
<g transform={`translate(${margin.left}, ${height - margin.bottom + 50})`}>
  {["January", "February", "March", "April", "May"].map((month, index) => (
    <g
    key={month}
    className="month-button"
    transform={`translate(${index * (chartWidth - margin.left - margin.right) / 5}, 0)`}
    onClick={() => handleMonthClick(month)}
  >
    <rect
      x={0}
      y={0}
      width={(chartWidth - margin.left - margin.right) / 5 - 10}
      height={30}
      fill={selectedMonth === month ? "lightblue" : "lightgray"}
      stroke="black"
    />
      {/* Text centered on the button */}
      <text
        x={((chartWidth - margin.left - margin.right) / 5 - 10) / 2}
        y={20}
        textAnchor="middle"
        fill="black"
        style={{
          fontSize: "12px",
          pointerEvents: "none",
        }}
      >
        {month}
      </text>
    </g>
  ))}
</g>

      </svg>
    </div>
  );
};

export default TransChart;
