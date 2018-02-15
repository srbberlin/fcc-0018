module.exports = (data) => {
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
    box.attr('display', null)
  }
  
  let mouseMove = (d) => {
    let x = Math.round(d3.event.layerX) + 90
    let y = Math.round(d3.event.layerY) + 10

    box
      .attr('transform', 'translate(' + x + ',' + y + ')')
    
    box
      .select('#d')
      .text(d.year + ', ' + data.monthData()[d.month - 1][0])

    box
      .select('#v')
      .text(fmt(d.variance + data.baseTemperature()) + ' (' + fmt(d.variance) + ') °C')
  }
    
  let mouseOut = () => {
    box.attr('display', 'none')
  }
    
  d3.select('#canvas')
    .selectAll('g')
    .data(data.yearData())
    .enter()
    .selectAll('rect')
    .data( (d) => { return d } )
    .enter()
    .append('rect')
    .on('mouseover', mouseOver)
    .on('mousemove', mouseMove)
    .on('mouseout', mouseOut)
    .attr('x', d => { return scy(d.year) })
    .attr('y', d => { return scm(d.month) })
    .attr('width', 2)
    .attr('height', 9)
    .attr('style', (d) => {
      return 'fill: ' + scc(d.variance)
    })

  let box = d3.select('#box')
    .attr('display', 'none')

  box
    .append('rect')
    .attr('id', 'b')
    .attr('width', 42)
    .attr('height', 23)  

  box
    .append('text')
    .attr('id', 'd')
  
  box
    .append('text')
    .attr('id', 'v')
}
