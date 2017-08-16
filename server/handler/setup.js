import compression from 'compression'
import favicon from 'serve-favicon'

export default (app, serve) => {
  app.use(compression({ threshold: 0 }))
  app.use(favicon(__dirname + '/../../static/favicon.ico'))
  app.use('/static', serve('../static', true))
  app.use('/public', serve('../public', true))
  app.use('/static/robots.txt', serve('../../robots.txt'))
  app.get('/sitemap.xml', (req, res) => {
    res.setHeader("Content-Type", "text/xml")
    res.sendFile(resolve('../../static/sitemap.xml'))
  })
}
