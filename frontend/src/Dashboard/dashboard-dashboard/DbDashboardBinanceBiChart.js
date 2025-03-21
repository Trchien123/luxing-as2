import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const BinanceChart = ({ title }) => {
    const chartRef = useRef(null);
    const [chartData, setChartData] = useState(null);
    const [hoverData, setHoverData] = useState(null);

    useEffect(() => {
        // Fetch 14-day price data from Coinpaprika
        const coinId = title.toLowerCase() === "seelecoin" ? "eth-ethereum" : "btc-bitcoin"; // Adjust coin ID based on title
        fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}/historical?start=${new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}&interval=1d`)
            .then((response) => response.json())
            .then((data) => {
                // Process API data into { x: timestamp, y: price } format
                const dataPoints = data.map((entry) => ({
                    x: new Date(entry.timestamp), // Convert ISO timestamp to Date object
                    y: entry.price,               // Price in USD
                }));
                setChartData(dataPoints); // Store in state
            })
            .catch((error) => {
                console.error("Error fetching Coinpaprika data:", error);
            });
    }, [title]); // Fetch when title changes

    useEffect(() => {
        if (!chartData) return; // Wait for data to load

        const updateChart = () => {
            const width = chartRef.current.offsetWidth;
            const height = chartRef.current.offsetHeight;
            const margin = { top: 20, right: 30, bottom: 50, left: 60 };
            const innerWidth = width - margin.left - margin.right;
            const innerHeight = height - margin.top - margin.bottom;

            const pointsPerWidth = 50;
            const numHoverPoints = Math.max(5, Math.floor(innerWidth / pointsPerWidth));

            d3.select(chartRef.current).select("svg").remove();

            const svg = d3.select(chartRef.current)
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            const xScale = d3.scaleTime()
                .domain(d3.extent(chartData, (d) => d.x))
                .range([0, innerWidth]);

            const yScale = d3.scaleLinear()
                .domain([d3.min(chartData, (d) => d.y) * 0.95, d3.max(chartData, (d) => d.y) * 1.05])
                .nice()
                .range([innerHeight, 0]);

            const line = d3.line()
                .x((d) => xScale(d.x))
                .y((d) => yScale(d.y))
                .curve(d3.curveMonotoneX);

            const xDomain = xScale.domain();
            const xTicks = [
                xDomain[0],
                new Date((xDomain[0].getTime() + xDomain[1].getTime()) / 2),
                xDomain[1],
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
                .attr("y", 15)
                .style("text-anchor", "middle");

            const yDomain = yScale.domain();
            svg.append("g")
                .call(
                    d3.axisLeft(yScale)
                        .tickValues([yDomain[0], yDomain[1]])
                        .tickFormat((d) => `$${d.toLocaleString(undefined, { maximumFractionDigits: 0 })}`)
                        .tickSize(0)
                )
                .selectAll("text")
                .attr("x", -10)
                .style("text-anchor", "end");

            svg.append("path")
                .datum(chartData)
                .attr("fill", "none")
                .attr("stroke", "#00C2FF")
                .attr("stroke-width", 2)
                .attr("d", line);

            const hoverPointsData = getEvenlySpacedPoints(chartData, numHoverPoints);

            const hoverGroup = svg.append("g").attr("class", "hover-elements");

            hoverGroup.selectAll(".hover-point")
                .data(hoverPointsData)
                .enter()
                .append("circle")
                .attr("class", "hover-point")
                .attr("r", 6)
                .attr("cx", (d) => xScale(d.x))
                .attr("cy", (d) => yScale(d.y))
                .attr("fill", "#00C2FF")
                .attr("stroke", "white")
                .attr("stroke-width", 2)
                .attr("opacity", 0)
                .on("mouseover", function (event, d) {
                    d3.select(this).attr("opacity", 1).attr("r", 8);
                    setHoverData({
                        date: d.x.toLocaleDateString(),
                        price: d.y.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }),
                        x: xScale(d.x) + margin.left,
                        y: yScale(d.y) + margin.top - 10,
                    });
                })
                .on("mouseout", function () {
                    d3.select(this).attr("opacity", 0).attr("r", 6);
                    setHoverData(null);
                });

            const hoverRadius = 20;
            hoverGroup.selectAll(".hover-area")
                .data(hoverPointsData)
                .enter()
                .append("circle")
                .attr("class", "hover-area")
                .attr("cx", (d) => xScale(d.x))
                .attr("cy", (d) => yScale(d.y))
                .attr("r", hoverRadius)
                .attr("fill", "transparent")
                .on("mouseover", function (event, d) {
                    const index = hoverPointsData.indexOf(d);
                    d3.selectAll(".hover-point")
                        .filter((_, i) => i === index)
                        .dispatch("mouseover");
                })
                .on("mouseout", function (event, d) {
                    const index = hoverPointsData.indexOf(d);
                    d3.selectAll(".hover-point")
                        .filter((_, i) => i === index)
                        .dispatch("mouseout");
                });
        };

        const getEvenlySpacedPoints = (data, count) => {
            const result = [];
            const step = Math.floor((data.length - 1) / (count - 1));
            for (let i = 0; i < count - 1; i++) {
                result.push(data[i * step]);
            }
            result.push(data[data.length - 1]);
            return result;
        };

        updateChart();
        window.addEventListener("resize", updateChart);

        return () => {
            window.removeEventListener("resize", updateChart);
        };
    }, [chartData]);

    return (
        <div
            id="my_dataviz"
            ref={chartRef}
            className="Bo-chart"
            style={{
                position: "relative",
                minHeight: "300px",
            }}
        >
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