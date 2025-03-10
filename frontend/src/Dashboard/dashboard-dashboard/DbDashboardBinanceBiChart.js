import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const BinanceChart = () => {
    const chartRef = useRef(null);
    const [chartData, setChartData] = useState(null);
    const [hoverData, setHoverData] = useState(null);

    useEffect(() => {
        // Fetch 14-day Bitcoin price data from CoinGecko using Promises
        fetch("https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=14")
            .then((response) => response.json())
            .then((data) => {
                // Process API data into { x: timestamp, y: price } format
                const dataPoints = data.prices.map((entry) => ({
                    x: new Date(entry[0]), // Convert timestamp (ms) to Date object
                    y: entry[1],           // Price in USD
                }));
                setChartData(dataPoints); // Store in state
            })
            .catch((error) => {
                console.error("Error fetching CoinGecko data:", error);
            });
    }, []); // Fetch once on mount

    useEffect(() => {
        if (!chartData) return; // Wait for data to load

        const updateChart = () => {
            const width = chartRef.current.offsetWidth;
            const height = chartRef.current.offsetHeight;
            // Increase margins to prevent overlapping but keep the same number of ticks
            const margin = { top: 20, right: 30, bottom: 50, left: 50 };
            const innerWidth = width - margin.left - margin.right;
            const innerHeight = height - margin.top - margin.bottom;

            // Clear previous SVG
            d3.select(chartRef.current).select("svg").remove();

            // Create SVG
            const svg = d3.select(chartRef.current)
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            // Create scales
            const xScale = d3.scaleTime()
                .domain(d3.extent(chartData, (d) => d.x)) // Min/max dates
                .range([0, innerWidth]);

            const yScale = d3.scaleLinear()
                .domain([d3.min(chartData, (d) => d.y) * 0.95, d3.max(chartData, (d) => d.y) * 1.05]) // Add padding
                .nice()
                .range([innerHeight, 0]);

            // Create line generator
            const line = d3.line()
                .x((d) => xScale(d.x))
                .y((d) => yScale(d.y))
                .curve(d3.curveMonotoneX); // Smooth line

            // Add the X Axis with 3 ticks (start, middle, end) but better positioning
            const xDomain = xScale.domain();
            const xTicks = [
                xDomain[0], // Start
                new Date((xDomain[0].getTime() + xDomain[1].getTime()) / 2), // Middle
                xDomain[1], // End
            ];

            svg.append("g")
                .attr("transform", `translate(0,${innerHeight})`)
                .call(
                    d3.axisBottom(xScale)
                        .tickValues(xTicks)
                        .tickFormat(d3.timeFormat("%b %d"))
                        .tickSize(0)
                )
                .selectAll("text")
                .attr("y", 15) // Move text down further
                .style("text-anchor", "middle");

            // Add the Y Axis with 2 ticks (bottom, top) but better positioning
            const yDomain = yScale.domain();

            svg.append("g")
                .call(
                    d3.axisLeft(yScale)
                        .tickValues([yDomain[0], yDomain[1]]) // Only bottom and top
                        .tickFormat((d) => `$${d.toLocaleString(undefined, { maximumFractionDigits: 0 })}`)
                        .tickSize(0)
                )
                .selectAll("text")
                .attr("x", -10) // Move text left
                .style("text-anchor", "end");

            // Add the line path
            svg.append("path")
                .datum(chartData)
                .attr("fill", "none")
                .attr("stroke", "#00C2FF")
                .attr("stroke-width", 2)
                .attr("d", line);

            // Create 5 evenly spaced hover points along the data
            const hoverPointsData = getEvenlySpacedPoints(chartData, 5);

            // Create a group for hover elements
            const hoverGroup = svg.append("g")
                .attr("class", "hover-elements");

            // Add hover points
            hoverGroup.selectAll(".hover-point")
                .data(hoverPointsData)
                .enter()
                .append("circle")
                .attr("class", "hover-point")
                .attr("r", 6)
                .attr("cx", d => xScale(d.x))
                .attr("cy", d => yScale(d.y))
                .attr("fill", "#00C2FF")
                .attr("stroke", "white")
                .attr("stroke-width", 2)
                .attr("opacity", 0) // Initially hidden
                .on("mouseover", function (event, d) {
                    d3.select(this)
                        .attr("opacity", 1)
                        .attr("r", 8);

                    // Show tooltip
                    setHoverData({
                        date: d.x.toLocaleDateString(),
                        price: d.y.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }),
                        x: xScale(d.x) + margin.left,
                        y: yScale(d.y) + margin.top - 10
                    });
                })
                .on("mouseout", function () {
                    d3.select(this)
                        .attr("opacity", 0)
                        .attr("r", 6);

                    // Hide tooltip
                    setHoverData(null);
                });

            // Create invisible overlay rectangles that span the chart for each hover point section
            const rectWidth = innerWidth / hoverPointsData.length;

            hoverGroup.selectAll(".hover-area")
                .data(hoverPointsData)
                .enter()
                .append("rect")
                .attr("class", "hover-area")
                .attr("x", (d, i) => i * rectWidth)
                .attr("y", 0)
                .attr("width", rectWidth)
                .attr("height", innerHeight)
                .attr("fill", "transparent")
                .on("mouseover", function (event, d) {
                    // Find the corresponding hover point and trigger its mouseover
                    const index = hoverPointsData.indexOf(d);
                    d3.selectAll(".hover-point")
                        .filter((_, i) => i === index)
                        .dispatch("mouseover");
                })
                .on("mouseout", function (event, d) {
                    // Find the corresponding hover point and trigger its mouseout
                    const index = hoverPointsData.indexOf(d);
                    d3.selectAll(".hover-point")
                        .filter((_, i) => i === index)
                        .dispatch("mouseout");
                });
        };

        // Helper function to get 5 evenly spaced points from the dataset
        const getEvenlySpacedPoints = (data, count) => {
            const result = [];
            const step = Math.floor((data.length - 1) / (count - 1));

            for (let i = 0; i < count - 1; i++) {
                result.push(data[i * step]);
            }

            // Add the last point from the data
            result.push(data[data.length - 1]);

            return result;
        };

        updateChart();
        window.addEventListener("resize", updateChart);

        return () => {
            window.removeEventListener("resize", updateChart);
        };
    }, [chartData]); // Re-run when chartData changes

    return (
        <div
            id="my_dataviz"
            ref={chartRef}
            className="Bo-chart"
            style={{
                position: "relative",
                minHeight: "300px" // Add a minimum height
            }}
        >
            {/* Tooltip */}
            {hoverData && (
                <div
                    style={{
                        position: "absolute",
                        left: `${hoverData.x}px`,
                        top: `${hoverData.y}px`,
                        transform: "translate(-50%, -100%)",
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        color: "white",
                        padding: "8px 12px",
                        borderRadius: "4px",
                        fontSize: "14px",
                        pointerEvents: "none",
                        zIndex: 10,
                    }}
                >
                    <div><strong>Date:</strong> {hoverData.date}</div>
                    <div><strong>Price:</strong> {hoverData.price}</div>
                </div>
            )}
        </div>
    );
};

export default BinanceChart;