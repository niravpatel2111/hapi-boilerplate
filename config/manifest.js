'use strict'

const CURRENT_ENV = process.env.ENV;

const getArgument = argument => {
  return process.argv.indexOf(argument)
}

const config = {
  port: 3600,
  debug: {
    request: ['error', 'info'],
    log: ['info', 'error', 'warning']
  },
  connections: {
    db: process.env.DB
  }
}

const mongoose = require('mongoose')

let plugins = []

if (CURRENT_ENV !== 'LOCAL') {
  mongoose.set('debug', true)
}

plugins = plugins.concat([
  {
    plugin: 'schmervice'
  },
  // {
  //   plugin: '@plugins/mongoose.plugin',
  //   options: {
  //     connections: config.connections
  //   }
  // },
  // {
  //   // if you need authentication then uncomment this plugin, and remove "auth: false" below
  //   plugin: '@plugins/auth.plugin'
  // },
  {
    plugin: '@routes/root.route'
  }
])

const routesObj = {
  // 'auth.route': '',
}

const routes = Object.keys(routesObj)
routes.forEach(r => {
  plugins = plugins.concat([
    {
      plugin: `@routes/${r}`,
      routes: {
        prefix: `/api/v1${routesObj[r] ? `/${routesObj[r]}` : ``}`
      }
    }
  ])
})

exports.manifest = {
  server: {
    router: {
      stripTrailingSlash: true,
      isCaseSensitive: false
    },
    routes: {
      security: {
        hsts: false,
        xss: true,
        noOpen: true,
        noSniff: true,
        xframe: false
      },
      cors: {
        origin: ['*'],
        // ref: https://github.com/hapijs/hapi/issues/2986
        headers: ['Accept', 'Authorization', 'Content-Type']
      },
      validate: {
        failAction: async (request, h, err) => {
          request.server.log(
            ['validation', 'error'],
            'Joi throw validation error'
          )
          throw err
        }
      },
      jsonp: 'callback', // <3 Hapi,
      auth: false // remove this to enable authentication or set your authentication profile ie. auth: 'jwt'
    },
    debug: config.debug,
    port: config.port
  },
  register: {
    plugins
  }
}

exports.options = {}
