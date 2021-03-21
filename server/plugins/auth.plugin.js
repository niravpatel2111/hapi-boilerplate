'use strict'
exports.plugin = {
  async register(server, options) {
    const User = require('@models/user.model').schema

    const jwtValidate = async (decodedToken, request, h) => {
      const credentials = {
        user: {}
      }
      let isValid = false
      credentials.user = await User.findById(decodedToken.user._id)
      if (credentials.user) {
        isValid = true
      }
      return {
        isValid,
        credentials
      }
    }

    server.auth.strategy('auth', 'jwt', {
      key: 'JWT_SECRET',
      validate: jwtValidate,
      verifyOptions: {
        algorithms: ['HS256']
      }
    })
  },
  name: 'auth',
  version: require('../../package.json').version
}
