const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const size = 600;

class RedshiftBlueshift extends D3Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  initialize(node, props) {
    let component = this
    const svg = this.svg = d3.select(node).append('svg');
    svg.attr('viewBox', `0 0 ${size} ${size}`)
      .style('width', '100%')
      .style('height', 'auto')
      .style('background-color', '#333333')

    var w = 800, h = 600;
    var t0 = Date.now();

    var object = [
      { R: 150, r: 10, speed: 10, phi0: 190 }
    ];

    svg.append("circle")
      .attr("r", 20)
      .attr("cx", size / 2)
      .attr("cy", size / 2)
      .style("fill", "#5577ff")

    var dist = 0;

    var container = svg.append("g");

    container.selectAll("g.object").data(object).enter().append("g")
      .attr("class", "object").each(function (d, i) {
        d3.select(this).append("circle")
          .attr("r", d.r)
          .attr("cx", d.R)
          .attr("cy", 0)
          .attr("id", "object");
      });

    d3.timer(function () {
      var delta = (Date.now() - t0);
      svg.selectAll(".object")
        .attr("transform", function (d) {
          return "rotate(" + (d.phi0 + delta * d.speed / 200) % 360 + ")";
        })
        .style('fill', function (d) {
          let angle = (d.phi0 + delta * d.speed / 200) % 360
          let hue = 60 + 60 * Math.sin((angle + 10) * Math.PI / 180)
          return d3.hsl(hue, 0.7, 0.5)
        })
      container.attr("transform", "translate(" + (size / 2 + 80) + "," + size / 2 + ")");

      //   var newDist = Math.sqrt(Math.pow(size/2 - svg.select('.object').attr('cx'), 2) + Math.pow(size/2 - svg.select('.object').attr('cy'), 2));
      //   console.log(svg.select('.object').attr('cx', function (d) { return d; }));
      //   if (newDist < dist) {
      //       svg.select('.object').style('fill', 'blue');
      //   } else {
      //       svg.select('.object').style('fill', 'red');
      //   }
      //   dist = newDist;
    });
  }
}

module.exports = RedshiftBlueshift;

