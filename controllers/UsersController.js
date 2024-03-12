#!/usr/bin/node

const dbClient = require('../utils/db')

class UsersController {
  static async postNew (req, res) {
    try {
      const { email, password } = req.body

      if (!email) {
        return res.status(400).json({ error: 'Missing email' })
      }

      if (!password) {
        return res.status(400).json({ error: 'Missing password' })
      }

      const userExist = await dbClient.userExist(email)
      if (userExist) {
        return res.status(400).json({ error: 'Already exist' })
      }

      const user = await dbClient.createUser(email, password)
      const id = `${user.insertedId}`
      return res.status(201).json({ id, email })
    } catch (error) {
      console.error('Error in postNew:', error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }
}

module.exports = UsersController
