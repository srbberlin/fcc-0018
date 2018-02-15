let res = (() => {
  let url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json'
  let data
  let baseTemperature
  let varianceDomain
  let monthDomain
  let yearDomain
  
  return {
    do: (f) => {
      d3.json(url, (error, res) => {
        if (error) {
          console.log(res.status, res.responseText)
        }
        else {
          let actYear = 0
          let thisYear
          baseTemperature = res.baseTemperature
          yearDomain = d3.extent(res.monthlyVariance, (d) => {
            return d.year
          })
          monthDomain = [1, 12]
          varianceDomain = d3.extent(res.monthlyVariance, (d) => {
            return (d.variance + 1) / 2 
          })
          data = res.monthlyVariance.reduce((p,c) => {
            if (actYear !== c.year) {
              actYear = c.year
              p.push(thisYear = [])
            }
            thisYear.push(c)
            return p
          }, [])
          f()
        }
      })
    },
    sel: (fYear, fMonth) => {
      fYear += 'y'
      return data[fYear][fMonth - 1]
    },
    baseTemperature: () => { return baseTemperature },
    varianceDomain: () => { return varianceDomain },
    monthDomain: () => { return monthDomain },
    monthData: () => { 
      return [ 
        ['January',1], 
        ['February',2], 
        ['March',3], 
        ['April',4], 
        ['May',5], 
        ['June',6], 
        ['July',7], 
        ['August',8], 
        ['September',9], 
        ['October',10], 
        ['November',11], 
        ['December',12] 
      ] 
    },
    yearDomain: () => { return yearDomain },
    yearData: () => { return data }
  }
})()

module.exports = res
