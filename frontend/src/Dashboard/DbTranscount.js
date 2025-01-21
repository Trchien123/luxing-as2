import React, { useState, useMemo } from "react";
import * as d3 from "d3";

const TransChart = () => {
  const dataForMonths = {
    January: [
      { x: 1, y: 5 },
      { x: 2, y: 10 },
      { x: 3, y: 7 },
      { x: 4, y: 12 },
      { x: 5, y: 8 },
    ],
    February: [
      { x: 1, y: 3 },
      { x: 2, y: 6 },
      { x: 3, y: 4 },
      { x: 4, y: 11 },
      { x: 5, y: 9 },
    ],
    March: [
      { x: 1, y: 4 },
      { x: 2, y: 9 },
      { x: 3, y: 6 },
      { x: 4, y: 10 },
      { x: 5, y: 7 },
    ],
    April: [
      { x: 1, y: 2 },
      { x: 2, y: 7 },
      { x: 3, y: 5 },
      { x: 4, y: 13 },
      { x: 5, y: 10 },
    ],
    May: [
      { x: 1, y: 6 },
      { x: 2, y: 8 },
      { x: 3, y: 3 },
      { x: 4, y: 9 },
      { x: 5, y: 6 },
    ],
    June: [
      { x: 1, y: 4 },
      { x: 2, y: 7 },
      { x: 3, y: 6 },
      { x: 4, y: 8 },
      { x: 5, y: 7 },
    ],
  };

  const width = 600;
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 80, left: 50 };

  const [tooltip, setTooltip] = useState({ x: 0, y: 0, visible: false, value: "" });
  const [selectedMonth, setSelectedMonth] = useState("January"); 

  const data = dataForMonths[selectedMonth];

  const xScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.x) + 1])
        .range([margin.left, width - margin.right]),
    [data, width, margin]
  );

  const yScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.y)])
        .range([height - margin.bottom, margin.top]),
    [data, height, margin]
  );

  const months = ["January", "February", "March", "April", "May", "June"];

  const handleMonthClick = (month) => {
    setSelectedMonth(month); 
  };

  return (
    <div
      style={{
        width: "100%",        
        height: "420px",      
        overflow: "auto",     
      }}
    >
      <svg width={width} height={height}>
        {/* X Axis */}
        <g transform={`translate(0, ${height - margin.bottom})`} style={{ fontSize: "12px" }}>
          <line x1={margin.left} x2={width - margin.right} stroke="black" />
          {xScale.ticks(6).map((tick) => (
            <g key={tick} transform={`translate(${xScale(tick)}, 0)`}>
              <line y2={6} stroke="black" />
              <text y={15} dy="0.71em" textAnchor="middle">
                {tick}
              </text>
            </g>
          ))}
        </g>

        {/* Y Axis */}
        <g transform={`translate(${margin.left}, 0)`} style={{ fontSize: "12px" }}>
          <line y1={margin.top} y2={height - margin.bottom} stroke="black" />
          {yScale.ticks(5).map((tick) => (
            <g key={tick} transform={`translate(0, ${yScale(tick)})`}>
              <line x2={-6} stroke="black" />
              <text x={-10} dy="0.32em" textAnchor="end">
                {tick}
              </text>
            </g>
          ))}
        </g>

        {/* Line from (0, 0) to the first point */}
        <line
          x1={xScale(0)}
          y1={yScale(0)}
          x2={xScale(data[0].x)}
          y2={yScale(data[0].y)}
          stroke="red"
        />

        {/* Scatter Plot Points */}
        {data.map((point, index) => (
          <g key={index}>
            {/* Circle */}
            <circle
              cx={xScale(point.x)}
              cy={yScale(point.y)}
              r={5}
              fill="pink"
              onMouseEnter={() =>
                setTooltip({
                  x: xScale(point.x),
                  y: yScale(point.y),
                  visible: true,
                  value: `Time: ${point.x + point.y}`, 
                  
                })
              }
              onMouseLeave={() => setTooltip({ ...tooltip, visible: false })}
            />
          </g>
        ))}

        {/* Connecting Lines */}
        {data.slice(0, -1).map((point, index) => (
          <line
            key={index}
            x1={xScale(point.x)}
            y1={yScale(point.y)}
            x2={xScale(data[index + 1].x)}
            y2={yScale(data[index + 1].y)}
            stroke="red"
          />
        ))}

        {/* Tooltip Box */}
        {tooltip.visible && (
          <g transform={`translate(${tooltip.x - 20}, ${tooltip.y - 30})`}>
            <rect
              width="60"
              height="25"
              fill="lightblue"
              stroke="black"
              rx="5"
              ry="5"
            />
            <text
              x={30}
              y={15}
              textAnchor="middle"
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                fill: "black",
                pointerEvents: "none", 
              }}
            >
              {tooltip.value}
            </text>
          </g>
        )}

        {/* Month Boxes at the Bottom */}
        <g transform={`translate(${margin.left}, ${height - margin.bottom + 50})`}>
          {months.map((month, index) => (
            <g key={month} transform={`translate(${(width - margin.left - margin.right) / 6 * index}, 0)`}>
              <rect
                x={0}
                y={0}
                width={(width - margin.left - margin.right) / 6 - 10}  
                height={30}
                fill={selectedMonth === month ? "lightblue" : "lightgray"}
                stroke="black"
                cursor="pointer"
                onClick={() => handleMonthClick(month)}
              />
              <text
                x={(width - margin.left - margin.right) / 12 - 10}
                y={20}
                textAnchor="middle"
                fill="black"
                style={{ fontSize: "12px" }}
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
