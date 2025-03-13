import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import "../../style/Transchart.css";

const StatChart = ({ title, transactions, onChartRendered }) => {
  const chartSvgRef = useRef();
  const legendSvgRef = useRef();
  const containerRef = useRef();
  const tooltipRef = useRef(null);
  const chartDataRef = useRef(null);
  const [fetchState, setFetchState] = useState("fetching");
  const [isRendered, setIsRendered] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: 600,
    height: 300,
    legendWidth: 150,
    legendHeight: 60,
    isNarrow: false,
  });

  const BREAKPOINT_WIDTH = 600;
  const LEGEND_WIDTH = 150;
  const LEGEND_HEIGHT = 60;

  useEffect(() => {
    const updateDimensions = () => {
      const container = containerRef.current;
      if (!container) return;

      const screenWidth = window.innerWidth;
      const containerWidth = container.getBoundingClientRect().width;
      const calculatedWidth = Math.min(screenWidth, containerWidth) * 0.95;
      const width = Math.min(Math.max(300, calculatedWidth), 800);
      const height = Math.min(Math.max(200, width * 0.5), 400);
      const isNarrow = width < BREAKPOINT_WIDTH;

      // Adjust width for wide screens to account for legend
      const adjustedWidth = isNarrow ? width : width - LEGEND_WIDTH - 20;

      setDimensions({
        width: adjustedWidth,
        height,
        legendWidth: LEGEND_WIDTH,
        legendHeight: LEGEND_HEIGHT,
        isNarrow,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (!tooltipRef.current) {
      tooltipRef.current = d3
        .select("body")
        .append("div")
        .attr("class", "chart-tooltip")
        .style("position", "absolute")
        .style("background", "rgba(255, 255, 255, 0.9)")
        .style("border", "1px solid #ddd")
        .style("border-radius", "4px")
        .style("padding", "8px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("display", "none")
        .style("z-index", "1000");
    }

    return () => {
      if (tooltipRef.current) {
        tooltipRef.current.remove();
        tooltipRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const processData = async () => {
      if (fetchState === "fetching" && !isRendered) {
        const svg = d3.select(chartSvgRef.current);
        svg
          .append("text")
          .attr("x", (dimensions.width + LEGEND_WIDTH / 2) / 2) // Shift right to account for legend space
          .attr("y", dimensions.height / 2)
          .attr("text-anchor", "middle")
          .attr("class", "fetching-text")
          .text("Fetching transactions...");
      }

      await new Promise((resolve) => setTimeout(resolve, 10000));

      if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
        setFetchState("error");
        if (onChartRendered) onChartRendered("error");
        setIsRendered(true);
        return;
      }

      const data = transactions
        .map((d) => ({
          ...d,
          timestamp: new Date(d.block_timestamp),
          value: +d.value || 0,
        }))
        .filter((d) => !isNaN(d.timestamp));

      if (data.length === 0) {
        setFetchState("error");
        if (onChartRendered) onChartRendered("error");
        setIsRendered(true);
        return;
      }

      const aggregatedData = d3.group(data, (d) => d3.timeDay(d.timestamp).toISOString().split("T")[0]);
      const summary = Array.from(aggregatedData, ([date, txs]) => ({
        date: new Date(date),
        inbound: d3.sum(txs.filter((t) => t.direction === "inbound"), (t) => t.value),
        outbound: d3.sum(txs.filter((t) => t.direction === "outbound"), (t) => t.value),
      }))
        .sort((a, b) => a.date - b.date)
        .slice(-12);

      chartDataRef.current = summary;
      setFetchState("ready");
      if (onChartRendered) onChartRendered("ready");
      setIsRendered(true);
    };

    if (!isRendered && !chartDataRef.current) {
      processData();
    }
  }, [transactions, fetchState, isRendered, onChartRendered, dimensions.width, dimensions.height]);

  useEffect(() => {
    const renderChart = () => {
      const chartSvg = d3.select(chartSvgRef.current);
      const { width, height, isNarrow } = dimensions;
      const margin = {
        top: 40,
        right: isNarrow ? 20 : 20,
        bottom: 60,
        left: 50,
      };

      chartSvg.selectAll("*").remove();
      chartSvg.attr("width", width).attr("height", height);

      if (fetchState === "error") {
        chartSvg
          .append("text")
          .attr("x", width / 2)
          .attr("y", height / 2)
          .attr("text-anchor", "middle")
          .attr("class", "error-text")
          .text("No transaction data available");
        return;
      }

      if (fetchState === "fetching" || !chartDataRef.current) {
        chartSvg
          .append("text")
          .attr("x", (width + LEGEND_WIDTH / 0.8) / 2) // Shift right to account for legend space
          .attr("y", height / 2)
          .attr("text-anchor", "middle")
          .attr("class", "fetching-text")
          .text("Fetching transactions...");
        return;
      }

      const summary = chartDataRef.current;

      const x0Scale = d3
        .scaleBand()
        .domain(summary.map((d) => d.date))
        .range([margin.left, width - margin.right])
        .padding(0.1);

      const x1Scale = d3
        .scaleBand()
        .domain(["inbound", "outbound"])
        .range([0, x0Scale.bandwidth()])
        .padding(0.05);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(summary, (d) => Math.max(d.inbound, d.outbound)) || 1])
        .range([height - margin.bottom, margin.top]);

      chartSvg
        .append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x0Scale).tickFormat(d3.timeFormat("%Y-%m-%d")))
        .attr("class", "axis")
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

      chartSvg
        .append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale).ticks(4).tickFormat(d3.format(".2s")))
        .attr("class", "axis");

      const tooltip = tooltipRef.current;

      const showTooltip = (event, d) => {
        const dateStr = d3.timeFormat("%Y-%m-%d")(d.date);
        tooltip
          .style("display", "block")
          .html(`
            <div>
              <strong>${dateStr}</strong><br>
              <span style="color: #00CC00;">Sent: ${d.outbound.toFixed(4)}</span><br>
              <span style="color: #Ff4444;">Received: ${d.inbound.toFixed(4)}</span>
            </div>
          `)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 10 + "px");
      };

      const moveTooltip = (event) => {
        tooltip.style("left", event.pageX + 10 + "px").style("top", event.pageY - 10 + "px");
      };

      const hideTooltip = () => {
        tooltip.style("display", "none");
      };

      const barGroups = chartSvg
        .selectAll(".bar-group")
        .data(summary)
        .enter()
        .append("g")
        .attr("class", "bar-group")
        .attr("transform", (d) => `translate(${x0Scale(d.date)},0)`);

      barGroups.each(function (d) {
        const group = d3.select(this);
        const dateData = d;

        group
          .append("rect")
          .attr("class", "bar inbound-bar")
          .attr("x", x1Scale("inbound"))
          .attr("y", yScale(dateData.inbound))
          .attr("width", x1Scale.bandwidth())
          .attr("height", height - margin.bottom - yScale(dateData.inbound))
          .attr("fill", "#009BAA")
          .on("mouseover", (event) => showTooltip(event, dateData))
          .on("mousemove", moveTooltip)
          .on("mouseout", hideTooltip);

        group
          .append("rect")
          .attr("class", "bar outbound-bar")
          .attr("x", x1Scale("outbound"))
          .attr("y", yScale(dateData.outbound))
          .attr("width", x1Scale.bandwidth())
          .attr("height", height - margin.bottom - yScale(dateData.outbound))
          .attr("fill", "#E55640")
          .on("mouseover", (event) => showTooltip(event, dateData))
          .on("mousemove", moveTooltip)
          .on("mouseout", hideTooltip);
      });

      chartSvg
        .append("text")
        .attr("x", width / 2)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .attr("class", "chart-title")
        .text(title);
    };

    const renderLegend = () => {
      const legendSvg = d3.select(legendSvgRef.current);
      const { legendWidth, legendHeight } = dimensions;

      legendSvg.selectAll("*").remove();
      legendSvg.attr("width", legendWidth).attr("height", legendHeight);

      const legend = legendSvg.append("g").attr("class", "legend");

      legend
        .append("rect")
        .attr("x", 10)
        .attr("y", 15)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", "#009baa");

      legend
        .append("text")
        .attr("x", 25)
        .attr("y", 23)
        .attr("class", "legend-text")
        .text("Received");

      legend
        .append("rect")
        .attr("x", 10)
        .attr("y", 35)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", "#e55640");

      legend
        .append("text")
        .attr("x", 25)
        .attr("y", 43)
        .attr("class", "legend-text")
        .text("Sent");
    };

    if (chartSvgRef.current) {
      renderChart();
    }

    // Only render legend after chart is loaded (fetchState is "ready" or "error")
    if (legendSvgRef.current && fetchState !== "fetching") {
      renderLegend();
    }
  }, [dimensions, fetchState, title]);

  return (
    <div ref={containerRef} className="stat-chart-container">
      <div className={`chart-wrapper ${dimensions.isNarrow ? "narrow" : "wide"}`}>
        <div className="chart-svg-container">
          <svg ref={chartSvgRef}></svg>
        </div>
        <div className="legend-svg-container">
          <svg ref={legendSvgRef}></svg>
        </div>
      </div>
    </div>
  );
};

export default StatChart;