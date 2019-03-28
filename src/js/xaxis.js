module.exports = (data) => {
  let sc = d3.scaleLinear()
    .domain(data.yearDomain())
    .range([0, 251])
  
  let ax = d3.axisBottom(sc)
    .tickFormat(d3.format('d'))

  d3.select('#x-axis')
    .attr('transform', 'translate(83, 155)')
    .call(ax)
}
