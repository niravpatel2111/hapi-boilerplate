'use strict'

const mongoose = require('mongoose')
const { environment } = require('@utilities/constants')
let plugins = []

if (process.env.ENV !== 'LOCAL') {
  mongoose.set('debug', true)
}

plugins = plugins.concat([
  {
    plugin: 'schmervice'
  },
  {
    plugin: '@plugins/mongoose.plugin',
    options: {
      connections: environment.connections
    }
  },
  {
    plugin: 'hapi-auth-jwt2'
  },
  {
    plugin: '@plugins/auth.plugin'
  },
  {
    plugin: '@routes/root.route'
  }
])

const routesObj = {
  'auth.route': '',
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
    debug: environment.debug,
    port: environment.port
  },
  register: {
    plugins
  }
}

exports.options = {}
