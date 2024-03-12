#!/usr/bin/node

const { v4 } = require('uuid')
const dbClient = require('../utils/db')
const redisClient = require('../utils/redis')
const sha1 = require('sha1')

class AuthController {
  static async getConnect (req, res) {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      res.status(401).json({ error: 'Unauthorized' })
      res.end()
      return
    }

    const token = authHeader.substring(0, 6)
    if (!token || !token.startsWith('Basic ')) {
      res.status(401).json({ error: 'Unauthorized' })
      res.end()
      return
    }

    const credentials = Buffer.from(token, 'base64').toString('utf8')
    if (!credentials) {
      res.status(401).json({ error: 'Unauthorized' })
      res.end()
      return
    }

    const [email, password] = credentials.split(':')
    const user = await dbClient.getUser(email)
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' })
      res.end()
      return
    }

    const pwdHashed = sha1(password)
    if (user.password !== pwdHashed) {
      res.status(401).json({ error: 'Unauthorized' })
      res.end()
      return
    }

    const accessToken = v4()
    await redisClient.set(`auth_${accessToken}`, user._id.toString('utf8'), 60 * 60 * 24)
    res.json({ token: accessToken })
    res.end()
  }

  static async getDisconnect (req, res) {
    const token = req.headers['x-token']
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' })
      res.end()
      return
    }
    const id = await redisClient.get(`auth_${token}`)
    if (!id) {
      res.status(401).json({ error: 'Unauthorized' })
      res.end()
      return
    }
    const user = await dbClient.getUserById(id)
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' })
      res.end()
      return
    }
    await redisClient.del(`auth_${token}`)
    res.status(204).end()
  }

  static async getMe (req, res) {
    const token = req.headers['x-token']
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' })
      res.end()
      return
    }
    const id = await redisClient.get(`auth_${token}`)
    if (!id) {
      res.status(401).json({ error: 'Unauthorized' })
      res.end()
      return
    }
    const user = await dbClient.getUserById(id)
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' })
      res.end()
      return
    }
    res.json({ id: user._id, email: user.email }).end()
  }
}

module.exports = AuthController
