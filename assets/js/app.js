// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

//Define chart margins as an object
var chartMargin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 30
};

// Define dimensions of chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

//Select HTML area for chart, append SVG to it, set dimensions
var svg = d3.select("scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append chart group to SVG area, translate down & to the right
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Access CSV
d3.csv("assets/data/data.csv").then(function(healthData) {

// Cast the hours value to a number for each piece of tvData
healthData.forEach(function(d) {
    d.poverty = +d.poverty;
    d.healthcare = +d.healthcare;
    console.log(d.poverty);
    console.log(d.healthcare);
  });


// Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
var xScale = d3.scaleBand()
    .domain(healthData.map(d => d.poverty))
    .range([0, chartWidth])
    .padding(0.1);

// Create a linear scale for the vertical axis.
// remember that the range goes form chartHeight to 0!
var yScale = d3.scaleLinear()
    .domain([0, d3.max(healthData, d => d.healthcare)])
    .range([chartHeight, 0]);

// Create two new functions passing our scales in as arguments
// These will be used to create the chart's axes
var bottomAxis = d3.axisBottom(xScale);
var leftAxis = d3.axisLeft(yScale).ticks(10);

// Append two SVG group elements to the chartGroup area,
// and create the bottom and left axes inside of them
chartGroup.append("g")
    .call(leftAxis);

chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

});