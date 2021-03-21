'use strict'
// Never take constants here
module.exports = {
  plugin: {
    async register(server, options) {
      const API = require('@api/auth.api')
      server.route([
        {
          method: 'POST',
          path: '/signup',
          config: {
            auth: null,
            plugins: {
              policies: ['log.policy']
            },
            tags: ['api', 'Authentication'],
            description: 'Sign Up',
            notes: 'Sign Up',
            validate: API.signup.validate,
            pre: API.signup.pre,
            handler: API.signup.handler
          }
        },
        // {
        //   method: 'POST',
        //   path: '/verify-email',
        //   config: {
        //     auth: null,
        //     plugins: {
        //       policies: ['log.policy']
        //     },
        //     tags: ['api', 'Authentication'],
        //     description: 'Verify email',
        //     notes: 'Verify email',
        //     validate: API.verifyEmail.validate,
        //     pre: API.verifyEmail.pre,
        //     handler: API.verifyEmail.handler
        //   }
        // },
        {
          method: 'POST',
          path: '/login',
          config: {
            auth: null,
            plugins: {
              policies: ['log.policy']
            },
            tags: ['api', 'Authentication'],
            description: 'Login',
            notes: 'Login',
            validate: API.login.validate,
            pre: API.login.pre,
            handler: API.login.handler
          }
        },
        {
          method: 'GET',
          path: '/me',
          config: {
            auth: 'auth',
            plugins: {
              policies: ['log.policy'],
              'hapi-swaggered': {
                security: [
                  {
                    ApiKeyAuth: []
                  }
                ]
              }
            },
            tags: ['api', 'Authentication'],
            description: 'Me',
            notes: 'Me',
            validate: API.me.validate,
            pre: API.me.pre,
            handler: API.me.handler
          }
        }
      ])
    },
    version: require('../../package.json').version,
    name: 'auth-routes'
  }
}
