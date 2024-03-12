#!/usr/bin/node

const { getUserFromXToken, getUserFromAuthorization } = require('../utils/auth')

/**
 * Applies Basic authentication to a route.
 * @param {Request} req The Express request object.
 * @param {Response} res The Express response object.
 * @param {NextFunction} next The Express next function.
 */
const basicAuthenticate = async (req, res, next) => {
  const user = await getUserFromAuthorization(req)

  if (!user) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  req.user = user
  next()
}

/**
 * Applies X-Token authentication to a route.
 * @param {Request} req The Express request object.
 * @param {Response} res The Express response object.
 * @param {NextFunction} next The Express next function.
 */
const xTokenAuthenticate = async (req, res, next) => {
  const user = await getUserFromXToken(req)

  if (!user) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  req.user = user
  next()
}
module.exports = {
  basicAuthenticate,
  xTokenAuthenticate
}
