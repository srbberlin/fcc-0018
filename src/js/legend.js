module.exports = (data) => {
  let scc = d3.scaleSequential(d3.interpolateYlOrRd)
    .domain(data.varianceDomain())

  let legend = d3.select('#legend')
  let form = d3.format('.3f')
  let step = 55
  let pos = -135
  let height = 12

  legend
    .append('g')
    .selectAll('rect')
    .data(data.varianceData)
    .enter()
    .append('rect')
    .attr('transform', d => `translate(${pos + d.i * step},0)`)
    .attr('style', d => 'fill: ' + scc(d.v))
    .attr('width', step)
    .attr('height', height)

  legend
    .append('g')
    .selectAll('text')
    .data(data.varianceData)
    .enter()
    .append('text')
    .attr('class', 'c3')
    .text(d => `${form(d.t)} (${form(d.v)})`)
    .attr('transform', d => `translate(${pos + 4 + d.i * step}, 9)`)

  legend
    .append('text')
    .attr('class', 'c9')
    .text('Temperatures are in Celsius. Anomalies relative to the Jan 1951-Dec 1980 average are in braces.')

  legend
    .append('text')
    .attr('class', 'c10')
    .text('Estimated Jan 1951-Dec 1980 absolute temperature in ℃: 8.66 +/- 0.07')
}
