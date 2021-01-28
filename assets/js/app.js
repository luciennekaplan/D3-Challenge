// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 600;

//Define chart margins as an object
var chartMargin = {
    top: 30,
    right: 80,
    bottom: 80,
    left: 60
};

// Define dimensions of chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

//Select HTML area for chart, append SVG to it, set dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append chart group to SVG area, translate down & to the left
var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.right}, ${chartMargin.top})`);

// Access CSV
d3.csv("assets/data/data.csv").then(function (healthData) {

    // Cast the hours value to a number for each piece of tvData
    healthData.forEach(function (d) {
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;
    });


    // Configure a band scale for the horizontal axis
    var xScale = d3.scaleLinear()
        .domain([8, d3.max(healthData, d => d.poverty)])
        .range([0, chartWidth]);

    // Create a linear scale for the vertical axis.
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, d => d.healthcare)])
        .range([chartHeight, 0]);

    // Create two new functions passing our scales in as arguments
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    // Append two SVG group elements to the chartGroup area,
    // and create the bottom and left axes inside of them
    chartGroup.append("g")
        .call(leftAxis);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter();

    var tool_tip = d3.tip().attr("class", "d3-tip").html(function (d) {return (`${d.state}<br>Poverty: ${d.poverty}%<br>Lacks Healthcare: ${d.healthcare}%`) }).offset([0, 1]);

    circlesGroup.append("circle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", "9")
        .style("fill", "lightblue")
        .attr("opacity", "0.5")
        .attr("class", d => d.abbr)
        .call(tool_tip);
    
    circlesGroup.append("text")
        .text(d => d.abbr)
        .attr("dx", d => xScale(d.poverty) -7)
        .attr("dy", d => yScale(d.healthcare) +3)
        .attr("font-size", "10px")
        .attr("fill", "white")
        .on('mouseover', tool_tip.show)
        .on('mouseout', tool_tip.hide);

    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top + 10})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .attr("fill", "white")    
        .text("In Poverty (%)");
        
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0-chartHeight/2)
        .attr("y", 0-chartMargin.right) 
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-size", "20px")
        .text("Lacks Healthcare (%)"); 
});