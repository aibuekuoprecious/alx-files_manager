#!/usr/bin/node
const express = require('express')

/**
 * Adds middlewares to the given express application.
 * @param {express.Express} router The express application.
 */
const injectMiddlewares = (router) => {
  router.use(express.json({ limit: '200mb' }))
}

module.exports = injectMiddlewares
