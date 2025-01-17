import React, { useEffect, useRef } from "react";
import * as d3 from "d3";


const BinanceChart = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        const data = [30, 86, 168, 234, 32, 12, 45];

        const width = 500;
        const height = 300;
        const barWidth = width / data.length;

        // Clear the previous SVG if it exists
        d3.select(chartRef.current).select("svg").remove();

        const svg = d3.select(chartRef.current)
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%");

        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("width", barWidth - 1)
            .attr("height", d => d)
            .attr("x", (d, i) => i * barWidth)
            .attr("y", d => height - d)
            .attr("fill", "teal");
    }, []); // Add an empty dependency array to ensure the effect is only run once

    return (
        <div id="my_dataviz" ref={chartRef} className="Bo-chart"></div>
    )
};

export default BinanceChart