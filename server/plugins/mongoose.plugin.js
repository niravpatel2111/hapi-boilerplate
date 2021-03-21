'use strict'

const db = require('mongoose')
const Glob = require('glob')

db.Promise = require('bluebird')

let aiDBConn = null

exports.plugin = {
  async register(server, options) {
    try {
      db.set('useFindAndModify', false)
      aiDBConn = await db.createConnection(options.connections.db, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })

      // When the connection is connected
      aiDBConn.on('connected', () => {
        server.log(['mongoose', 'info'], 'aiDBConn Mongo Database connected')
      })

      // When the connection is disconnected
      aiDBConn.on('disconnected', () => {
        server.log(['mongoose', 'info'], 'aiDBConn Mongo Database disconnected')
      })

      // If the node process ends, close the mongoose connection
      process.on('SIGINT', async () => {
        await aiDBConn.close()

        server.log(
          ['mongoose', 'info'],
          'Mongo Database disconnected through app termination'
        )
        process.exit(0)
      })

      // Load models
      const models = Glob.sync('server/models/*.js')
      models.forEach(model => {
        require(`${process.cwd()}/${model}`)
      })
    } catch (err) {
      console.log(err)
      throw err
    }
  },
  aiDBConn() {
    return aiDBConn
  },
  name: 'mongoose_connector',
  version: require('../../package.json').version
}
