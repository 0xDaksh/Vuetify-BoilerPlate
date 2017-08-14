require('babel-register')({
  presets: ["es2015"]
})
const server = require('./server/app'),
  port = 3000

server.listen(port, () => {
  console.log("App is running on port " + port)
})
