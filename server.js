require('babel-register')({
  presets: ['es2015']
})
const server = require('./app'),
  port = process.env.PORT || 3000 

server.listen(port, () => {
  console.log(`running on port ${port}`)
})
