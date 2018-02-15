const data   = require('./data.js')

data.do(() => {
  require('./yaxis.js') (data)
  require('./xaxis.js') (data)
  require('./canvas.js')(data)
})
