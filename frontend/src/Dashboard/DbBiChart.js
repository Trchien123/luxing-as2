import React, { useEffect, useRef } from "react";
import * as d3 from "d3";


const BinanceChart = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        const data = [30, 86, 168, 234, 32, 12, 45];

        const updateChart = () => {
            const width = chartRef.current.offsetWidth;
            const height = chartRef.current.offsetHeight;
            const barWidth = width / data.length;

            // Clear the previous SVG if it exists
            d3.select(chartRef.current).select("svg").remove();
            d3.select(chartRef.current).select(".tooltip").remove();
            const svg = d3.select(chartRef.current)
                .append("svg")
                .attr("width", width)
                .attr("height", height);


            const tooltip = d3.select(chartRef.current)
                .append("div")
                .attr("class", "tooltip")

                .style("opacity", 0)
            const mouseover = function (d) {
                tooltip
                    .style("opacity", 1)
                d3.select(this)
                    .style("stroke", "black")
                    .style("opacity", 1)
            }
            const mousemove = function (event, d) {
                const [x, y] = d3.pointer(event, this);
                tooltip
                    .html("Value:" + d)
                    .style("left", (x + 50) + "px")
                    .style("top", (y - 300) + "px")

            }
            const mouseleave = function (d) {
                tooltip
                    .style("opacity", 0)
                d3.select(this)
                    .style("stroke", "none")
                    .style("opacity", 0.8)
            }
            svg.selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                .attr("width", barWidth - 1)
                .attr("height", d => (d / Math.max(...data)) * height)
                .attr("x", (d, i) => i * barWidth)
                .attr("y", d => height - ((d / Math.max(...data)) * height))
                .attr("fill", "teal")
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)
        };

        updateChart();

        window.addEventListener("resize", updateChart);

        return () => {
            window.removeEventListener("resize", updateChart);
        };
    }, []); // Add an empty dependency array to ensure the effect is only run once

    return (
        <div id="my_dataviz" ref={chartRef} className="Bo-chart"></div>
    )
};
export default BinanceChart