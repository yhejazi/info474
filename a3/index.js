
// Define top-level variables
var dataset
var diameter = 800;
var maxBubbles = 50;
var filters = {
    year: [0, 0],
    sales: [0, 0],
    genre: [],
    platform: [],
    publisher: [],
    gamename: []
}
var colorBy = "Publisher"
var region = "Global_Sales"

// Define the legend
var legendOrdinal;

// Define the div for the tooltip
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var svg = d3.select("#visualization")
    .append("svg")
    .attr("width", "100%")
    .attr("height", diameter)
    .attr("class", "bubble");

// Define scales
//var color = d3.scaleOrdinal().range(['#f44242', '#52b043', '#0099e5', '#ff9900', '#9f7ded']);
var color = d3.scaleOrdinal().range(d3.schemeCategory10.concat(Array(10).fill("#555555")));
var colorCritic = d3.scaleThreshold()
    .domain([0.1, 50, 75, 90, 100])
    .range(["gray", "red", "#d0d628", "#61af21", "green"])

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

    // Set up initial filters
    filters.year = [
        d3.min(data, d => d.Year),
        d3.max(data, d => d.Year)
    ]

    filters.sales = [
        d3.min(data, d => d[region]),
        Math.ceil(d3.max(data, d => d[region]))
    ]

    // Add options to selection filters
    var genres = [...new Set(data.map(d => d.Genre))]
    d3.select("#genre").selectAll("option")
        .data(genres)
        .enter().append("option")
        .text(d => d)

    var platforms = [...new Set(data.map(d => d.Platform))]
    d3.select("#platform").selectAll("option")
        .data(platforms)
        .enter().append("option")
        .text(d => d)

    var publishers = [...new Set(data.map(d => d.Publisher))]
    d3.select("#publisher").selectAll("option")
        .data(publishers)
        .enter().append("option")
        .text(d => d)

    // Set up filter widgets
    $(function () {
        $("#year").slider({
            range: true,
            min: filters.year[0],
            max: filters.year[1],
            values: filters.year,
            slide: function (event, ui) {
                $("#yearval").val(ui.values[0] + " - " + ui.values[1]);
                filters.year = ui.values
                applyFilters()
            }
        });
        $("#yearval").val(filters.year[0] + " - " + filters.year[1])
        $("#sales").slider({
            range: true,
            min: filters.sales[0],
            max: filters.sales[1],
            values: filters.sales,
            slide: function (event, ui) {
                $("#salesval").val(ui.values[0] + " - " + ui.values[1] + " million");
                filters.sales = ui.values
                applyFilters()
            }
        });
        $("#salesval").val(filters.sales[0] + " - " + filters.sales[1] + " million")

        $("#genre").select2().on("change", e => {
            filters.genre = $("#genre").select2("data").map(d => d.id)
            applyFilters()
        })

        $("#platform").select2().on("change", e => {
            filters.platform = $("#platform").select2("data").map(d => d.id)
            applyFilters()
        })

        $("#publisher").select2().on("change", e => {
            filters.publisher = $("#publisher").select2("data").map(d => d.id)
            applyFilters()
        })

        $("#color").select2().on("change", e => {
            colorBy = $("#color").select2("data")[0].id
            applyFilters()
        })

        $("#region").select2().on("change", e => {
            region = $("#region").select2("data")[0].id

            filters.sales = [
                d3.min(data, d => d[region]),
                Math.ceil(d3.max(data, d => d[region]))
            ]

            $("#sales").slider({
                range: true,
                min: filters.sales[0],
                max: filters.sales[1],
                values: filters.sales
            });
            $("#salesval").val(filters.sales[0] + " - " + filters.sales[1] + " million")

            applyFilters()
        })

        $("#game").select2({
            tags: true
        }).on("change", e => {
            filters.gamename = $("#game").select2("data").map(d => d.id)
            applyFilters()
        })
    });


    drawVis(dataset)
});

function drawVis(data) {
    // Filter to top
    let dataset = { children: data.children.slice(0, maxBubbles) }

    var bubble = d3.pack(dataset)
        .size([diameter, diameter])
        .padding(1.5);

    // Define colors
    let colorScale
    let sortedDomain = []
    if (colorBy === "Critic_Score") {
        colorScale = colorCritic
    } else {
        let colorCount = {}
        dataset.children.forEach(d => {
            if (!colorCount[d[colorBy]]) {
                colorCount[d[colorBy]] = 0
            }
            colorCount[d[colorBy]]++
        })
        sortedDomain = Object.keys(colorCount).sort(function (a, b) { return colorCount[b] - colorCount[a] })
        color.domain(sortedDomain)
        colorScale = color
    }

    var nodes = d3.hierarchy(dataset)
        .sum(function (d) { return d[region]; });

    let nodeData = bubble(nodes).descendants().filter(d => !d.children)
    var parents = svg.selectAll(".node")
        .data(nodeData, d => d.data.Rank)

    parents.exit()
        .select("circle")
        .transition()
        .attr("r", 0)

    parents.exit()
        .selectAll("text")
        .transition()
        .attr("font-size", 0)

    parents.exit().transition().remove();

    svg.selectAll(".legend").remove();

    if (sortedDomain.length > 0 || colorBy === "Critic_Score") {
        var parentsEnter = parents.enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        parentsEnter.append("circle")
            .attr("r", 0)
            .style("fill", function (d) {
                return colorScale(d.data[colorBy]);
            })
            .attr("stroke-width", 4)
            .on("mouseover", function (d) {
                // Display tooltip
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                // Add information to tooltip
                tooltip.html(d.data.Name + "<br/>" + d.data.Platform + "<br/>" + d.data[region] + "M copies<br />" + d.data.Year)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");

                // Add outline to circle
                let circ = d3.select(this)
                circ.transition()
                    .attr("stroke", d3.color(circ.style("fill")).darker())
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

        parentsEnter.append("text")
            .attr("class", "node-text node-name")
            .attr("dy", ".2em")
            .style("text-anchor", "middle")
            .text(function (d) {
                return d.data.Name.substring(0, d.r / 3);
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", 0)
            .attr("fill", "white")

        parentsEnter.append("text")
            .attr("class", "node-text node-rank")
            .attr("dy", "1.3em")
            .style("text-anchor", "middle")
            .text(function (d) {
                return '#' + (d.data.RegionRank || d.data.Rank);
            })
            .attr("font-family", "Gill Sans", "Gill Sans MT")
            .attr("font-size", 0)
            .attr("fill", "white")

        parents = parentsEnter.merge(parents)
        parents.transition().attr("transform", (d, i) => "translate(" + d.x + "," + d.y + ")")
        parents.select("circle").transition()
            .delay((d, i) => i * 8)
            .duration(250)
            .ease(d3.easeSinOut)
            .attr("r", function (d) {
                return d.r;
            })
            .style("fill", function (d) {
                return colorScale(d.data[colorBy]);
            })

        parents.select(".node-name").transition()
            .delay((d, i) => i * 8)
            .duration(250)
            .ease(d3.easeSinOut)
            .attr("font-size", function (d) {
                return d.r / 5;
            })

        parents.select(".node-rank").transition()
            .delay((d, i) => i * 8)
            .duration(250)
            .ease(d3.easeSinOut)
            .attr("font-size", function (d) {
                return d.r / 5;
            })
            .text(function (d) {
                return '#' + (d.data.RegionRank || d.data.Rank);
            })
        d3.select(self.frameElement)
            .style("height", diameter + "px");

        // Define the color legend
        if (sortedDomain.length > 10) {
            let newDomain = sortedDomain.slice(0, 10).concat(Array(10).fill("Other"))
            color.domain(newDomain)
        }

        legendOrdinal = d3.legendColor()
            .scale(colorScale)
            .shape('circle')

        if (colorBy === "Critic_Score") {
            legendOrdinal.labels(["No data", "< 50", "50 - 74", "75 - 89", "90 - 100"])
        }

        svg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(500, 400)")

        svg.select(".legend")
            .call(legendOrdinal);
    }
}


function applyFilters() {
    var data = Object.assign({}, dataset)

    data = { children: data.children.sort((a, b) => b[region] - a[region]) }
    data.children.forEach((d, i) => d.RegionRank = i + 1)

    // Slider filters
    data.children = data.children.filter(d => d.Year >= filters.year[0] && d.Year <= filters.year[1])
        .filter(d => d[region] >= filters.sales[0] && d[region] <= filters.sales[1])

    // Selection filters
    if (filters.genre.length > 0) {
        data.children = data.children.filter(d => filters.genre.includes(d.Genre))
    }

    if (filters.platform.length > 0) {
        data.children = data.children.filter(d => filters.platform.includes(d.Platform))
    }

    if (filters.publisher.length > 0) {
        data.children = data.children.filter(d => filters.publisher.includes(d.Publisher))
    }

    if (filters.gamename.length > 0) {
        data.children = data.children.filter(d => filters.gamename.some(name => d.Name.toLowerCase().includes(name.toLowerCase())))
    }

    drawVis(data)
}