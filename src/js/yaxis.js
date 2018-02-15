module.exports = (data) => {
  let sc = d3.scaleLinear()
    .domain(data.monthDomain())
    .range([0, 100])
  
  let root = d3.select('#leftAxis')
    .attr('transform', 'translate(0, 40)')
    .attr('style', 'font-family: sans-serif; font-size: 5px')
    .selectAll('g')
    .data(data.monthData())
    .enter()
    .append('g')

  root
    .append('text')
    .attr('text-anchor', 'end')
    .text(d => { return d[0] })
    .attr('y', d => { return sc(d[1]) + 6 })
    .attr('x', 78)
}
