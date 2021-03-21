const errors = {
  user: {
    invalidCredentials: {
      status: 401,
      code: 'invalid_credentials',
      message: 'wrong username or password'
    },
    deleted: {
      status: 400,
      code: 'user_deleted',
      message: 'user is deleted'
    },
    userNotExist: {
      status: 400,
      code: 'user_not_exist',
      message: 'User is not exist'
    },
  },
}

const constants = {
  JWT_SECRET: 'sjflkjsdlfjslkdjfjsdljflksdjf',
  EXPIRATION_PERIOD: '730d',
  LOCAL: {
    port: 3600,
    debug: {
      request: ['error', 'info'],
      log: ['info', 'error', 'warning']
    },
    connections: {
      db: process.env.DB
    },
    consoleUrl: ''
  },
  DEV: {

  },
  PROD: {

  }
}

const environment = constants[process.env.ENV]

module.exports = {
  errors,
  constants,
  environment
}
