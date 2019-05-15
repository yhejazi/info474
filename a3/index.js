
// Define top-level variables
var dataset
var diameter = 800;
var maxBubbles = 50;
var filters = {
    year: [0, 0],
    sales: [0, 0],
    genre: [],
    platform: [],
    publisher: []
}

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
d3.csv("vgsales_clipped.csv", function (error, data) {
    data.forEach(function (d, i) {
        d.Rank = i + 1;
        d.Year = +d.Year_of_Release;
        d.Value = +d.Global_Sales;
        d.NA_Sales = +d.NA_Sales;
        d.EU_Sales = +d.EU_Sales;
        d.JP_Sales = +d.JP_Sales;
        d.Other_Sales = +d.Other_Sales;
        d.Global_Sales = +d.Global_Sales;
        d.Critic_Score = +d.Critic_Score;
        d.Critic_Count = +d.Critic_Count;
        d.User_Score = +d.User_Score;
        d.User_Count = +d.User_Count;
    });

    dataset = { children: data }
    drawVis(dataset)
});

function drawVis(data) {
    // Filter to top
    let dataset = { children: data.children.sort((a, b) => a.Rank - b.Rank).slice(0, maxBubbles) }

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
        .attr("r", 0)
        .style("fill", function (d) {
            return color(d.data.Publisher);
        })
        .attr("stroke-width", 4)
        .on("mouseover", function (d) {
            // Display tooltip
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            // Add information to tooltip
            tooltip.html(d.data.Name + "<br/>" + d.data.Platform + "<br/>" + d.data.Global_Sales + "M copies<br />" + d.data.Year)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            
            // Add outline to circle
            d3.select(this).transition()
                .attr("stroke", d3.color(color(d.data.Publisher)).darker())
        })
        .on("mouseout", function (d) {
            // Hide tooltip		
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);

            // Remove outline
            d3.select(this).transition()
                .attr("stroke", "transparent")
        })
        .transition()
        .delay((d, i) => i * 8)
        .duration(250)
        .ease(d3.easeSinOut)
        .attr("r", function (d) {
            return d.r;
        })

    node.append("text")
        .attr("class", "node-text")
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
        .attr("class", "node-text")
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