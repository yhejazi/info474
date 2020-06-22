const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const size = 600;

class WaveBox extends D3Component {

  initialize(node, props) {
    const svg = this.svg = d3.select(node).append('svg');
    svg.attr('viewBox', `0 0 ${size} ${size}`)
      .style('width', '100%')
      .style('height', 'auto')
      .style('background-color', '#333333')

    let waves = svg.append('g').attr('id', 'waves')

    svg.append('circle')
      .attr('r', 20)
      .attr('cx', size * 0.5)
      .attr('cy', size * 0.5)
      .style('fill', '#5577ff')
      .style('z-index', 1)

    setInterval(() => this.spawnWave(waves), 400)
  }

  spawnWave(svg) {
    let circle = svg.append('circle')
      .attr('r', 20)
      .attr('cx', size * 0.5)
      .attr('cy', size * 0.5)
      .style('z-index', -1)
      .style('stroke', 'gray')
      .style('fill', 'transparent')

    circle.transition()
      .duration(5000)
      .attr('r', size)
      .ease(d3.easeLinear)
      .remove()
  }
}

module.exports = WaveBox;
