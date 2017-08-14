require('babel-register')({
  presets: ["es2015"]
})
const render = require('../server/handler/render'),
  expect = require('chai').expect

describe('render function', () => {
  it('should export a function', () => {
    expect(render.default).to.be.a('function')
  })
})
