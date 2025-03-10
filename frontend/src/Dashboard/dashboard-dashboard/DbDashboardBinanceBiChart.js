import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const BinanceChart = () => {
    const chartRef = useRef(null);
    const [chartData, setChartData] = useState(null);

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

            }}
        ></div>
    );
};

export default BinanceChart;