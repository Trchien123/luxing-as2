import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import '../../style/Transchart.css';

const StatChart = ({ title, transactions }) => {
  const svgRef = useRef();
  const containerRef = useRef();
  const tooltipRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 300 });
  const [fetchState, setFetchState] = useState("fetching"); // "fetching", "ready", "error"

  // Responsive sizing
  useEffect(() => {
    const updateDimensions = () => {
      const container = containerRef.current;
      if (!container) return;

      const screenWidth = window.innerWidth;
      const containerWidth = container.getBoundingClientRect().width;

      const calculatedWidth = Math.min(screenWidth, containerWidth) * 0.95;
      const newWidth = Math.min(Math.max(300, calculatedWidth), 800);
      const newHeight = Math.min(Math.max(200, newWidth * 0.5), 400);

      setDimensions({ width: newWidth, height: newHeight });
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    window.addEventListener('resize', updateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Create tooltip
  useEffect(() => {
    if (!tooltipRef.current) {
      tooltipRef.current = d3.select('body')
        .append('div')
        .attr('class', 'chart-tooltip')
        .style('position', 'absolute')
        .style('background', 'rgba(255, 255, 255, 0.9)')
        .style('border', '1px solid #ddd')
        .style('border-radius', '4px')
        .style('padding', '8px')
        .style('font-size', '12px')
        .style('pointer-events', 'none')
        .style('display', 'none')
        .style('z-index', '1000');
    }

    return () => {
      if (tooltipRef.current) {
        tooltipRef.current.remove();
        tooltipRef.current = null;
      }
    };
  }, []);

  // Chart rendering with delay
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = dimensions;
    const margin = { top: 40, right: 85, bottom: 60, left: 50 };

    // Initial "fetching" state rendering
    svg.attr('width', width).attr('height', height);

    const renderChart = async () => {
      // Wait 10 seconds before proceeding
      await new Promise((resolve) => setTimeout(resolve, 10000));

      if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
        setFetchState("error");
        svg.append('text')
          .attr('x', width / 2)
          .attr('y', height / 2)
          .attr('text-anchor', 'middle')
          .attr('class', 'error-text')
          .text('No transaction data available');
        return;
      }

      const data = transactions.map(d => ({
        ...d,
        timestamp: new Date(d.block_timestamp),
        value: +d.value || 0,
      })).filter(d => !isNaN(d.timestamp));

      if (data.length === 0) {
        setFetchState("error");
        svg.append('text')
          .attr('x', width / 2)
          .attr('y', height / 2)
          .attr('text-anchor', 'middle')
          .attr('class', 'error-text')
          .text('Invalid timestamp data');
        return;
      }

      // Aggregate and sort by date, take 12 most recent
      const aggregatedData = d3.group(data, d => d3.timeDay(d.timestamp).toISOString().split('T')[0]);
      const summary = Array.from(aggregatedData, ([date, txs]) => ({
        date: new Date(date),
        inbound: d3.sum(txs.filter(t => t.direction === 'inbound'), t => t.value),
        outbound: d3.sum(txs.filter(t => t.direction === 'outbound'), t => t.value),
      }))
        .sort((a, b) => a.date - b.date)
        .slice(-12);

      setFetchState("ready");

      const x0Scale = d3.scaleBand()
        .domain(summary.map(d => d.date))
        .range([margin.left, width - margin.right])
        .padding(0.1);

      const x1Scale = d3.scaleBand()
        .domain(['inbound', 'outbound'])
        .range([0, x0Scale.bandwidth()])
        .padding(0.05);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(summary, d => Math.max(d.inbound, d.outbound)) || 1])
        .range([height - margin.bottom, margin.top]);

      // Axes
      svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x0Scale).tickFormat(d3.timeFormat("%Y-%m-%d")))
        .attr('class', 'axis')
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end');

      svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale).ticks(4).tickFormat(d3.format(".2s")))
        .attr('class', 'axis');

      const tooltip = tooltipRef.current;

      const showTooltip = (event, d) => {
        const dateStr = d3.timeFormat("%Y-%m-%d")(d.date);
        tooltip
          .style('display', 'block')
          .html(`
            <div>
              <strong>${dateStr}</strong><br>
              <span style="color: #00CC00;">Sent: ${d.outbound.toFixed(4)}</span><br>
              <span style="color: #Ff4444;">Received: ${d.inbound.toFixed(4)}</span>
            </div>
          `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      };

      const moveTooltip = (event) => {
        tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      };

      const hideTooltip = () => {
        tooltip.style('display', 'none');
      };

      // Bars
      const barGroups = svg.selectAll('.bar-group')
        .data(summary)
        .enter()
        .append('g')
        .attr('class', 'bar-group')
        .attr('transform', d => `translate(${x0Scale(d.date)},0)`);

      barGroups.each(function(d) {
        const group = d3.select(this);
        const dateData = d;

        group.append('rect')
          .attr('class', 'bar inbound-bar')
          .attr('x', x1Scale('inbound'))
          .attr('y', yScale(dateData.inbound))
          .attr('width', x1Scale.bandwidth())
          .attr('height', height - margin.bottom - yScale(dateData.inbound))
          .attr('fill', '#009BAA')
          .on('mouseover', (event) => showTooltip(event, dateData))
          .on('mousemove', moveTooltip)
          .on('mouseout', hideTooltip);

        group.append('rect')
          .attr('class', 'bar outbound-bar')
          .attr('x', x1Scale('outbound'))
          .attr('y', yScale(dateData.outbound))
          .attr('width', x1Scale.bandwidth())
          .attr('height', height - margin.bottom - yScale(dateData.outbound))
          .attr('fill', '#E55640')
          .on('mouseover', (event) => showTooltip(event, dateData))
          .on('mousemove', moveTooltip)
          .on('mouseout', hideTooltip);
      });

      // Legend
      const legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${width - margin.right + 10},${margin.top - 20})`);

      legend.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', '#009baa');

      legend.append('text')
        .attr('x', 15)
        .attr('y', 8)
        .attr('class', 'legend-text')
        .text('Received');

      legend.append('rect')
        .attr('x', 0)
        .attr('y', 15)
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', '#e55640');

      legend.append('text')
        .attr('x', 15)
        .attr('y', 23)
        .attr('class', 'legend-text')
        .text('Sent');

      // Title
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', margin.top / 2)
        .attr('text-anchor', 'middle')
        .attr('class', 'chart-title')
        .text(title);
    };

    // Render "fetching" message initially
    if (fetchState === "fetching") {
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('class', 'fetching-text')
        .text('Fetching transactions...');
    }

    // Trigger chart rendering
    renderChart();
  }, [transactions, title, dimensions, fetchState]);

  return (
    <div ref={containerRef} className="stat-chart-container">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default StatChart;