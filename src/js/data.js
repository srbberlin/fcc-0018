let res = (() => {
  let url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json'
  let data
  let baseTemperature
  let varianceDomain
  let varianceData
  let step
  let pos
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
            return d.variance
          })
          step = (varianceDomain[1] - varianceDomain[0]) / 5
          pos = varianceDomain[0]
          varianceData = [0,0,0,0,0].map((d,i) => {
            let j = i * step + pos 
            return {
              v: j,
              i: i,
              t: baseTemperature + j
            }
          })
          data = res.monthlyVariance.reduce((p,c) => {
            if (actYear !== c.year) {
              actYear = c.year
              p.push(thisYear = [])
            }
            c.temp = baseTemperature + c.variance
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
    varianceData: () => { return varianceData },
    monthDomain: () => { return monthDomain },
    monthData: () => { 
      return [ 
        'January', 
        'February', 
        'March', 
        'April', 
        'May', 
        'June', 
        'July', 
        'August', 
        'September', 
        'October', 
        'November', 
        'December' 
      ] 
    },
    yearDomain: () => { return yearDomain },
    yearData: () => { return data }
  }
})()

module.exports = res
