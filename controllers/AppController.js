#!/usr/bin/node

const redisClient = require('../utils/redis')
const dbClient = require('../utils/db')

class AppController {
  static getStatus (_, res) {
    try {
      if (redisClient.isAlive() && dbClient.isAlive()) {
        return res.json({ redis: true, db: true })
      }
    } catch (error) {
      console.error('Error in getStatus:', error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  static async getStats (_, res) {
    try {
      const users = await dbClient.nbUsers()
      const files = await dbClient.nbFiles()
      return res.json({ users, files })
    } catch (error) {
      console.error('Error in getStats:', error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }
}

module.exports = AppController
