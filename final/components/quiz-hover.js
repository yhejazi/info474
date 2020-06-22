const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const size = 100;

class QuizHover extends D3Component {
  initialize(node, props) {
    const svg = this.svg = d3.select(node).append('svg');
    svg.attr('viewBox', `0 0 ${size} ${size * 0.25}`)
      .style('width', '100%')
      .style('height', 'auto')
      .style('background-color', '#333333')

    this.circle = svg.append('circle')
      .attr('r', size * 0.33 * 0.25)
      .attr('cx', size * 0.5)
      .attr('cy', size * 0.5 * 0.25)
      
    this.updateCircle(props)
  }

  update(props) {
    this._props = props;
    this.updateCircle(props)
  }

  updateCircle(props) {
    this.circle.style('fill', d3.hsl(props.hue, 0.7, 0.5))
      .on('mouseover', function (d, i) {
        console.log(props.hue, props.hue + props.change * props.direction)
        d3.select(this).transition('color').style('fill', d3.hsl(props.hue + props.change * props.direction, 0.7, 0.5))
      })
      .on('mouseout', function (d, i) {
        d3.select(this).transition('color').duration(0).style('fill', d3.hsl(props.hue, 0.7, 0.5))
      })
  }
}

module.exports = QuizHover;
