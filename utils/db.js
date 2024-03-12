#!/usr/bin/node

const { MongoClient } = require('mongodb')
const mongo = require('mongodb')
const { pwdHashed } = require('./utils')

class DBClient {
  constructor () {
    const host = process.env.DB_HOST || 'localhost'
    const port = process.env.DB_PORT || 27017
    this.database = (process.env.DB_DATABASE) ? process.env.DB_DATABASE : 'files_manager'
    const dbUrl = `mongodb://${host}:${port}`
    this.connected = false
    this.client = new MongoClient(dbUrl, { useUnifiedTopology: true })
    this.client.connect().then(() => {
      this.connected = true
    }).catch((err) => console.log(err.message))
  }

  isAlive () {
    return this.connected
  }

  async nbUsers () {
    await this.client.connect()
    const numDocs = await this.client.db(this.database).collection('users').countDocuments()
    return numDocs
  }

  async nbFiles () {
    await this.client.connect()
    const numDocs = await this.client.db(this.database).collection('files').countDocuments()
    return numDocs
  }

  async createUser (email, password) {
    const hashedPwd = pwdHashed(password)
    await this.client.connect()
    const user = await this.client.db(this.database).collection('users').insertOne({ email, password: hashedPwd })
    return user
  }

  async getUser (email) {
    await this.client.connect()
    const user = await this.client.db(this.database).collection('users').find({ email }).toArray()
    if (!user.length) {
      return null
    }
    return user[0]
  }

  async getUserById (id) {
    const _id = mongo.ObjectId(id)
    await this.client.connect()
    const user = await this.client.db(this.database).collection('users').find({ _id }).toArray()
    if (!user.length) {
      return null
    }
    return user[0]
  }

  async userExist (email) {
    const user = await this.getUser(email)
    if (user) {
      return true
    }
    return false
  }
}

const dbClient = new DBClient()
module.exports = dbClient
