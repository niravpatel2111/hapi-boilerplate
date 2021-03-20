'use strict'

// const DEVELOPMENT = 'development'
// const PRODUCTION = 'production'

const getArgument = argument => {
  return process.argv.indexOf(argument)
}

if (getArgument('--development') !== -1) {
  process.env.NODE_ENV = 'development'
}

if (getArgument('--prod') !== -1) {
  process.env.NODE_ENV = 'production'
}

if (getArgument('--development') !== -1 || getArgument('--prod') !== -1) {
  process.env.NODE_CONFIG_DIR = `${__dirname}`
}

const config = require('config')
const mongoose = require('mongoose')
const Config = JSON.parse(JSON.stringify(config))

const swaggerOptions = {
  info: {
    title: 'Buz',
    version: require('../package.json').version,
    description: 'Buz'
  },
  documentationPath: '/docs',
  basePath: '/api',
  tags: [],
  grouping: 'tags',
  securityDefinitions: {
    jwt: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header'
    },
    Session: {
      type: 'apiKey',
      name: 'Session',
      in: 'header'
    }
  },
  security: [
    {
      Basic: []
    }
  ]
}

const DEFAULT = 'default'

let plugins = []
const ENV = config.util.getEnv('NODE_ENV').trim()

if (ENV !== DEFAULT) {
  swaggerOptions.schemes = ['https', 'http']
  swaggerOptions.host = 'https://yoqal-api.aakba.com'
  mongoose.set('debug', true)
}
// if (ENV !== PRODUCTION) {
plugins = [
  {
    plugin: '@hapi/vision'
  },
  {
    plugin: 'hapi-swagger',
    options: swaggerOptions
  },
  {
    plugin: 'hapi-dev-errors',
    options: {
      showErrors: process.env.NODE_ENV !== 'production',
      toTerminal: true
    }
  }
]
// }
plugins = plugins.concat([
  {
    plugin: '@hapi/inert'
  },
  {
    plugin: '@hapi/good',
    options: {
      ops: {
        interval: 1000
      },
      reporters: {
        myConsoleReporter: [
          {
            module: '@hapi/good-squeeze',
            name: 'Squeeze',
            args: [
              {
                log: '*',
                request: '*',
                response: '*',
                error: '*'
              }
            ]
          },
          {
            module: '@hapi/good-console'
          },
          'stdout'
        ]
      }
    }
  },
  {
    plugin: 'hapi-auth-jwt2'
  },
  {
    plugin: '@hapi/basic'
  },
  {
    plugin: 'schmervice'
  },
  {
    plugin: 'mrhorse',
    options: {
      policyDirectory: `${__dirname}/../server/policies`,
      defaultApplyPoint:
        'onPreHandler' /* optional.  Defaults to onPreHandler */
    }
  },
  {
    plugin: '@plugins/mongoose.plugin',
    options: {
      connections: Config.connections
    }
  },
  {
    // if you need authentication then uncomment this plugin, and remove "auth: false" below
    plugin: '@plugins/auth.plugin'
  },
  {
    plugin: '@routes/root.route'
  }
])

const routesMerchantOb = {
  'auth.route': 'merchant',
  'merchant.route': 'merchant',
  'business.route': 'merchant',
  'store.route': 'merchant',
  'storecustomer.route': 'merchant',
  'bill.route': 'merchant',
  'deal.route': 'merchant',
  'subCategory.route': 'merchant',
  'amenities.route': 'merchant',
  'payAccept.route': 'merchant',
  'productCategory.route': 'merchant',
  'product.route': 'merchant',
  'city.route': 'merchant',
  'state.route': 'merchant',
  'area.route': 'merchant',
  'country.route': 'merchant',
  'tag.route': 'merchant'
}

const routesMerchant = Object.keys(routesMerchantOb)
routesMerchant.forEach(r => {
  plugins = plugins.concat([
    {
      plugin: `@routes_${routesMerchantOb[r]}/${r}`,
      routes: {
        prefix: `/api/v1${routesMerchantOb[r] ? `/${routesMerchantOb[r]}` : ``}`
      }
    }
  ])
})

const routesPublisherOb = {
  'auth.route': 'publisher',
  'publisher.route': 'publisher'
}

const routesPublisher = Object.keys(routesPublisherOb)
routesPublisher.forEach(r => {
  plugins = plugins.concat([
    {
      plugin: `@routes_${routesPublisherOb[r]}/${r}`,
      routes: {
        prefix: `/api/v1${
          routesPublisherOb[r] ? `/${routesPublisherOb[r]}` : ``
        }`
      }
    }
  ])
})

const routesAdminOb = {
  'auth.route': 'admin',
  'home.route': 'admin',

  'category.route': 'admin',
  'categoryCity.route': 'admin',
  'businessRating.route': 'admin',
  'businessMedia.route': 'admin',
  'flyer.route': 'admin',
  'userFlyer.route': 'admin',
  'publicationTemplate.route': 'admin',
  'order.route': 'admin',
  'flyerTemplates.route': 'admin',
  'flyertype.route': 'admin',
  'seeder.route': 'admin'
}

const routesAdmin = Object.keys(routesAdminOb)
routesAdmin.forEach(r => {
  plugins = plugins.concat([
    {
      plugin: `@routes_${routesAdminOb[r]}/${r}`,
      routes: {
        prefix: `/api/v1${routesAdminOb[r] ? `/${routesAdminOb[r]}` : ``}`
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
        headers: ['Accept', 'Authorization', 'Session', 'Content-Type']
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
    debug: Config.debug,
    port: Config.port
  },
  register: {
    plugins
  }
}

exports.options = {}
