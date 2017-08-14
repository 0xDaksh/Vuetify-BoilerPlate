import fs from 'fs'
import path from 'path'
import LRU from 'lru-cache'
import express from 'express'
import prod from './handler/prod'
import setup from './handler/setup'
import routes from './routes/index'

const resolve = file => path.resolve(__dirname, file)
const redirects = require('./router/301.json')

// MANAGE PRODUCTION STUFF
const isProd = process.env.NODE_ENV === 'production',
  useMicroCache = process.env.MICRO_CACHE !== 'false',
  app = express()

// IMPORT HTML TEMPLATE
const template = fs.readFileSync(resolve('../assets/index.template.html'), 'utf-8')

// SETUP RENDERER AND READYPROMISE
let renderer, readyPromise;
prod(app, isProd, renderer, readyPromise);

const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && isProd ? 60 * 60 * 24 * 30 : 0
})

// SETUP SHIT UP
setup(app);

// 301 redirect for changed routes
Object.keys(redirects).forEach(k => {
  app.get(k, (req, res) => res.redirect(301, redirects[k]))
})

// 1-second microcache.
// https://www.nginx.com/blog/benefits-of-microcaching-nginx/
const microCache = LRU({
  max: 100,
  maxAge: 1000
})

// since this app has no user-specific content, every page is micro-cacheable.
// if your app involves user-specific content, you need to implement custom
// logic to determine whether a request is cacheable based on its url and
// headers.

function render (req, res) {


  renderer.renderToString(context, (err, html) => {
    if (err) {
      return handleError(err)
    }
    res.end(html)
    if (cacheable) {
      microCache.set(req.url, html)
    }
    if (!isProd) {
      console.log(`whole request: ${Date.now() - s}ms`)
    }
  })
}

// route management
app.use('/', routes)

// SPA Router.
app.get('*', isProd ? render : (req, res) => {
  readyPromise.then(() => render(req, res, microCache))
})

module.exports = app;
