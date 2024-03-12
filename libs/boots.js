#!/usr/bin/node
const envLoader = require('../utils/env_loader')

const startServer = (router) => {
  envLoader()
  const port = process.env.PORT || 5000
  const env = process.env.npm_lifecycle_event || 'dev'
  router.listen(port, () => {
    console.log(`[${env}] API has started listening at port:${port}`)
  })
}

module.exports = startServer
