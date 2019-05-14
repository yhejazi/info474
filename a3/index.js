
// Define top-level variables
var dataset
var diameter = 800;

// Define the legend
var legendOrdinal;

// Define the div for the tooltip
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var svg = d3.select("body")
    .append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

// Define scales
var color = d3.scaleOrdinal().range(['#f44242', '#52b043', '#0099e5', '#ff9900', '#9f7ded']);

// Load data
d3.csv("vgsales.csv", function (error, data) {
    data.forEach(function (d) {
        d.Rank = +d.Rank;
        d.Year = +d.Year;
        d.Value = +d.Global_Sales;
        d.NA_Sales = +d.NA_Sales;
        d.EU_Sales = +d.EU_Sales;
        d.JP_Sales = +d.JP_Sales;
        d.Other_Sales = +d.Other_Sales;
        d.Global_Sales = +d.Global_Sales;
    });

    dataset = { children: data }
    drawVis(dataset)
});

function drawVis(dataset) {
    var bubble = d3.pack(dataset)
        .size([diameter, diameter])
        .padding(1.5);

    var nodes = d3.hierarchy(dataset)
        .sum(function (d) { return d.Global_Sales; });

    var node = svg.selectAll(".node")
        .data(bubble(nodes).descendants())
        .enter()
        .filter(function (d) {
            return !d.children
        })
        .append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });


    node.append("circle")
        .attr("r", function (d) {
            return d.r;
        })
        .style("fill", function (d) {
            return color(d.data.Publisher);
        })
        .on("mouseover", function (d) {
            // Display tooltip
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            // Add information to tooltip
            tooltip.html(d.data.Name + "<br/>" + d.data.Platform + "<br/>" + d.data.Global_Sales + "M copies<br />" + d.data.Year)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
            // Hide tooltip		
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    node.append("text")
        .attr("dy", ".2em")
        .style("text-anchor", "middle")
        .text(function (d) {
            return d.data.Name.substring(0, d.r / 3);
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", function (d) {
            return d.r / 5;
        })
        .attr("fill", "white");

    node.append("text")
        .attr("dy", "1.3em")
        .style("text-anchor", "middle")
        .text(function (d) {
            return '#' + d.data.Rank;
        })
        .attr("font-family", "Gill Sans", "Gill Sans MT")
        .attr("font-size", function (d) {
            return d.r / 5;
        })
        .attr("fill", "white");

    d3.select(self.frameElement)
        .style("height", diameter + "px");

    // Define the color legend
    legendOrdinal = d3.legendColor()
        .scale(color)
        .shape('circle')

    svg.select("g.node")
        .call(legendOrdinal);
}