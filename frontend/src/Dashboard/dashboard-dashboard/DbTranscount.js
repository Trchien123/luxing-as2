import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import '../../style/Transchart.css';

const StatChart = ({ title, transactions }) => {
  const svgRef = useRef();
  const containerRef = useRef();
  const tooltipRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 300 });

  // Responsive sizing
  useEffect(() => {
    const updateDimensions = () => {
      const container = containerRef.current;
      if (!container) return;

      const screenWidth = window.innerWidth;
      const containerWidth = container.getBoundingClientRect().width;

      // Calculate width: 90% of the smaller of screen or container width
      const calculatedWidth = Math.min(screenWidth, containerWidth) * 0.95;
      const newWidth = Math.min(Math.max(300, calculatedWidth), 800); // Min 300px, Max 800px
      
      // Maintain aspect ratio (height = 50% of width, with min/max)
      const newHeight = Math.min(Math.max(200, newWidth * 0.5), 400);

      setDimensions({
        width: newWidth,
        height: newHeight,
      });
    };

    updateDimensions(); // Initial call

    const resizeObserver = new ResizeObserver(entries => {
      updateDimensions();
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    window.addEventListener('resize', updateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Create tooltip once on component mount
  useEffect(() => {
    // Create tooltip div if it doesn't exist yet
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

    // Cleanup tooltip on component unmount
    return () => {
      if (tooltipRef.current) {
        tooltipRef.current.remove();
        tooltipRef.current = null;
      }
    };
  }, []);

  // Chart rendering
  useEffect(() => {
    console.log('useEffect triggered');
    console.log('Transactions:', transactions);

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = dimensions;
    const margin = { top: 40, right: 85, bottom: 60, left: 50 };

    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
      svg.attr('width', width)
         .attr('height', height)
         .append('text')
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
      svg.attr('width', width)
         .attr('height', height)
         .append('text')
         .attr('x', width / 2)
         .attr('y', height / 2)
         .attr('text-anchor', 'middle')
         .attr('class', 'error-text')
         .text('Invalid timestamp data');
      return;
    }

    // Aggregate and sort by date, then take 12 most recent
    const aggregatedData = d3.group(data, d => d3.timeDay(d.timestamp).toISOString().split('T')[0]);
    const summary = Array.from(aggregatedData, ([date, txs]) => ({
      date: new Date(date),
      inbound: d3.sum(txs.filter(t => t.direction === 'inbound'), t => t.value),
      outbound: d3.sum(txs.filter(t => t.direction === 'outbound'), t => t.value),
    }))
      .sort((a, b) => a.date - b.date)
      .slice(-12);

    svg.attr('width', width)
       .attr('height', height);

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
      .call(d3.axisBottom(x0Scale)
        .tickFormat(d3.timeFormat("%Y-%m-%d")))
      .attr('class', 'axis')
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale)
        .ticks(4)
        .tickFormat(d3.format(".2s")))
      .attr('class', 'axis');

    // Get tooltip ref
    const tooltip = tooltipRef.current;

    // Helper functions for tooltip
    const showTooltip = (event, d) => {
      const dateStr = d3.timeFormat("%Y-%m-%d")(d.date);
      
      // Log for debugging
      console.log('Tooltip data:', {
        date: dateStr,
        inbound: d.inbound,
        outbound: d.outbound
      });
      
      tooltip
        .style('display', 'block')
        .html(`
          <div>
            <strong>${dateStr}</strong><br>
            <span style="color: #ff4444;">Sent: ${d.outbound.toFixed(2)}</span><br>
            <span style="color: #00cc00;">Received: ${d.inbound.toFixed(2)}</span>
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

    // Create data for each bar in a more explicit way
    barGroups.each(function(d) {
      const group = d3.select(this);
      const dateData = d;
      
      // Inbound bar (green)
      group.append('rect')
        .attr('class', 'bar inbound-bar')
        .attr('x', x1Scale('inbound'))
        .attr('y', yScale(dateData.inbound))
        .attr('width', x1Scale.bandwidth())
        .attr('height', height - margin.bottom - yScale(dateData.inbound))
        .attr('fill', '#00cc00')
        .on('mouseover', function(event) {
          showTooltip(event, dateData);
        })
        .on('mousemove', moveTooltip)
        .on('mouseout', hideTooltip);
      
      // Outbound bar (red)
      group.append('rect')
        .attr('class', 'bar outbound-bar')
        .attr('x', x1Scale('outbound'))
        .attr('y', yScale(dateData.outbound))
        .attr('width', x1Scale.bandwidth())
        .attr('height', height - margin.bottom - yScale(dateData.outbound))
        .attr('fill', '#ff4444')
        .on('mouseover', function(event) {
          showTooltip(event, dateData);
        })
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
      .attr('fill', '#00cc00');

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
      .attr('fill', '#ff4444');

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

  }, [transactions, title, dimensions]);

  return (
    <div ref={containerRef} className="stat-chart-container">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default StatChart;