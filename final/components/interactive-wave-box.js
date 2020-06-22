const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const size = 600;

class InteractiveWaveBox extends D3Component {
  constructor(props) {
    super(props)
    this.state = {
      vx: 0.1,
      vy: 0
    }
  }

  initialize(node, props) {
    let component = this
    const svg = this.svg = d3.select(node).append('svg');
    svg.attr('viewBox', `0 0 ${size} ${size}`)
      .style('width', '100%')
      .style('height', 'auto')
      .style('background-color', '#333333')

    let bg = svg.append('g').attr('id', 'bg')
    let waves = svg.append('g').attr('id', 'waves')
    let particles = svg.append('g').attr('id', 'particles')

    svg.append('circle')
      .attr('r', 20)
      .attr('cx', size * 0.5)
      .attr('cy', size * 0.5)
      .style('fill', '#5577ff')

    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("refX", 5)
      .attr("refY", 2)
      .attr("markerWidth", 6)
      .attr("markerHeight", 4)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0,0 V 4 L6,2 Z")
      .style("fill", "white")


    let line = svg.append('line')
      .attr('x1', size * 0.5)
      .attr('y1', size * 0.5)
      .attr('x2', size * (0.5 + this.state.vx))
      .attr('y2', size * (0.5 + this.state.vy))
      .attr('stroke-width', 2)
      .attr('stroke', 'white')
      .attr("marker-end", "url(#arrowhead)")

    svg.on('click', function () {
      let coords = d3.mouse(this)
      let vx = coords[0] / size - 0.5
      let vy = coords[1] / size - 0.5
      component.setState({ vx: vx, vy: vy })

      line.attr('x2', coords[0])
        .attr('y2', coords[1])

      waves.selectAll('circle').transition()
        .style('stroke-opacity', 0)
        .remove()

      particles.selectAll('circle').transition()
        .style('opacity', 0)
        .remove()
    })

    setInterval(() => this.spawnWave(waves), 400)
    setInterval(() => this.particleTrail(particles), 100)


    for (let i = 50; i <= size + 100; i += 100) {
      for (let j = 50; j <= size + 100; j += 100) {
        bg.append('circle')
        .attr('class', 'bggrid')
        .attr('r', 2)
        .attr('cx', i)
        .attr('cy', j)
        .style('fill', '#555555')
      }
    }
    
    d3.timer(function () {
      svg.selectAll(".bggrid")
        .attr('cx', function (d) {
          return component.modulo((d3.select(this).attr('cx') - component.state.vx * 2), size)
        })
        .attr('cy', function (d) {
          return component.modulo((d3.select(this).attr('cy') - component.state.vy * 2), size)
        })
    });
  }

  modulo(a, b) {
    return ((a % b) + b) % b 
  }

  spawnWave(svg) {
    let circle = svg.append('circle')
      .attr('r', 20)
      .attr('cx', size * 0.5)
      .attr('cy', size * 0.5)
      .style('stroke', 'gray')
      .style('fill', 'transparent')

    circle.transition('circle')
      .duration(10000)
      .attr('r', size * 2)
      .attr('cx', size * (0.5 - this.state.vx * 2))
      .attr('cy', size * (0.5 - this.state.vy * 2))
      .ease(d3.easeLinear)
      .remove()
  }

  particleTrail(svg) {
    let circle = svg.append('circle')
      .attr('r', 5)
      .style('fill', '#5577ff')
      .attr('cx', size * 0.5)
      .attr('cy', size * 0.5)
      .attr('opacity', 1)

    circle.transition('circle')
      .duration(2000)
      .attr('cx', size * (0.5 - this.state.vx * 0.5 + (Math.random() - 0.5) * 0.1))
      .attr('cy', size * (0.5 - this.state.vy * 0.5 + (Math.random() - 0.5) * 0.1))
      .attr('opacity', 0)
      .ease(d3.easeLinear)
      .remove()
  }
}

module.exports = InteractiveWaveBox;
