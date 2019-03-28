module.exports = (data) => {
  let svg = d3.select('svg').node()
  let canvas = d3.select('#canvas')
  let tooltip = d3.select('#tooltip')

  let fmt = d3.format('.3f')

  let scy = d3.scaleLinear()
    .domain(data.yearDomain())
    .range([0, 250])
  
  let scm = d3.scaleLinear()
    .domain(data.monthDomain())
    .range([0, 100])

  let scc = d3.scaleSequential(d3.interpolateYlOrRd)
    .domain(data.varianceDomain())

  let mouseOver = () => {
    tooltip.attr('display', null)
  }
  
  let mouseMove = (d) => {
    let point = svg.createSVGPoint()
    point.x = d3.event.clientX
    point.y = d3.event.clientY
    point = point.matrixTransform(svg.getScreenCTM().inverse())

    tooltip
      .attr('transform', 'translate(' + (point.x + 5) + ',' + (point.y + 5) + ')')
      .attr('data-year', d.year)
    
    tooltip
      .select('#d')
      .text(d.year + ', ' + data.monthData()[d.month - 1])

    tooltip
      .select('#v')
      .text(fmt(d.variance + data.baseTemperature()) + ' (' + fmt(d.variance) + ') °C')
  }
    
  let mouseOut = () => {
    tooltip.attr('display', 'none')
  }
    
  canvas
    .selectAll('g')
    .data(data.yearData())
    .enter()
    .selectAll('rect')
    .data((d) => { return d } )
    .enter()
    .append('rect')
    .on('mouseover', mouseOver)
    .on('mousemove', mouseMove)
    .on('mouseout', mouseOut)
    .attr('class', 'cell')
    .attr('x', d => { return scy(d.year) })
    .attr('y', d => { return scm(d.month) })
    .attr('width', 2)
    .attr('height', 9)
    .attr('style', (d) => {
      return 'fill: ' + scc(d.variance)
    })
    .attr('data-year', d => { return d.year })
    .attr('data-month', d => { return d.month - 1 })
    .attr('data-temp', d => { return d.temp })

  tooltip
    .attr('display', 'none')

  tooltip
    .append('rect')
    .attr('id', 'b')
    .attr('width', 42)
    .attr('height', 23)  

  tooltip
    .append('text')
    .attr('id', 'd')
  
  tooltip
    .append('text')
    .attr('id', 'v')
}
