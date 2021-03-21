'use strict'

const Jwt = require('jsonwebtoken')
const errorHelper = require('./error-helper')

function createToken(user, expirationPeriod) {
  try {
    let token = {}

    const tokenUser = {
      firstName: user.firstName,
      userName: user.userName,
      lastName: user.lastName,
      email: user.email,
      _id: user._id
    }

    token = Jwt.sign({
      user: tokenUser
    },
      'JWT_SECRET', {
      algorithm: 'HS256',
      expiresIn: expirationPeriod
    }
    )

    return token
  } catch (err) {
    errorHelper.handleError(err)
  }
}

module.exports = createToken
