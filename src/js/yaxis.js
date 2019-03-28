module.exports = (data) => {
  let sc = d3.scaleOrdinal()
    .domain(data.monthData())
    .range([0, 9.1, 17.2, 26.3, 35.4, 44.5, 53.6, 62.7, 71.8, 80.9, 90, 100])

  let ax = d3.axisLeft(sc)

  d3.select('#y-axis')
    .attr('transform', 'translate(76, 45)')
    .call(ax)
}
