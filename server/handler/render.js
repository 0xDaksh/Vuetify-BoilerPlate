import config from '../config'
const useMicroCache = process.env.MICRO_CACHE !== 'false',
  isCacheable = req => useMicroCache,
  serverInfo =`express/${require('express/package.json').version} ` + `vue-server-renderer/${require('vue-server-renderer/package.json').version}`,
  isProd = process.env.NODE_ENV === 'production'

  // since this app has no user-specific content, every page is micro-cacheable.
  // if your app involves user-specific content, you need to implement custom
  // logic to determine whether a request is cacheable based on its url and
  // headers.

export default function render(req, res, microCache, renderer) {
  const s = Date.now()

  res.setHeader("Content-Type", "text/html")
  res.setHeader("Server", serverInfo)

  const handleError = err => {
    if (err && err.code === 404) {
      res.status(404).end('404 | Page Not Found')
    } else {
      // Render Error Page or Redirect
      res.status(500).end('500 | Internal Server Error')
      console.error(`error during render : ${req.url}`)
      console.error(err.stack)
    }
  }
  const cacheable = isCacheable(req)
  if (cacheable) {
    const hit = microCache.get(req.url)
    if (hit) {
      if (!isProd) {
        console.log(`cache hit!`)
      }
      return res.end(hit)
    }
  }
  const context = {
    title: config.title, // default title
    url: req.url
  }
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
