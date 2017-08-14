import { createBundleRenderer } from 'vue-server-renderer'
import fs from 'fs'
import path from 'path'
import LRU from 'lru-cache'
const resolve = file => path.resolve(__dirname, file)
// IMPORT HTML TEMPLATE
const template = fs.readFileSync(resolve('../../assets/index.template.html'), 'utf-8')
export default function createRenderer (bundle, options) {
  // https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
  return createBundleRenderer(bundle, Object.assign(options, {
    template,
    // for component caching
    cache: LRU({
      max: 1000,
      maxAge: 1000 * 60 * 15
    }),
    // this is only needed when vue-server-renderer is npm-linked
    basedir: resolve('../../public'),
    // recommended for performance
    runInNewContext: false
  }))
}
