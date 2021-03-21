const errors = {
  general: {
    defaultSettingNotFound: {
      status: 400,
      code: 'setting_not_found',
      message: 'default settings not found'
    },
    notFound: {
      status: 404,
      code: 'not_found',
      message: 'not found'
    },
    internal_server: {
      status: 500,
      code: 'internal_server',
      message: 'Internal server error'
    },
    contactSupport: {
      status: 400,
      code: 'contact_support',
      message: 'contact support'
    },
    invalidRequest: {
      status: 400,
      code: 'invalid_request',
      message: 'invalid request parameters'
    },
    emailNotFound: {
      status: 404,
      code: 'email_not_found',
      message: 'email not found'
    }
  },
  authorization: {
    unauthorized: {
      status: 401,
      code: 'unauthorized',
      message: 'trying to access unauthorized resource'
    },
    invalideCredentials: {
      status: 401,
      code: 'invalid_credentials',
      message: 'invalide credentials'
    }
  },
  user: {
    invalideCredentials: {
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
    userExist: {
      status: 400,
      code: 'user_exist',
      message: 'User is already exist'
    },
    verificationPending: {
      status: 401,
      code: 'email_verification_pending',
      message: 'email verification pending'
    },
    emailAlreadyExist: {
      status: 400,
      code: 'email_exist',
      message: 'email address is already exist'
    },
    phoneAlreadyExist: {
      status: 400,
      code: 'phone_exist',
      message: 'phone number is already exist'
    },
    wrongPassword: {
      status: 400,
      code: 'invalid_credentials',
      message: 'wrong password'
    },
    newPasswordWrong: {
      status: 400,
      code: 'invalid_credentials',
      message: 'new password should not same as old'
    }
  },
  repoAccess: {
    alreadyAccessGiven: {
      status: 400,
      code: 'invalid_credentials',
      message: 'You already gave permission to this account'
    },
    blockAccount: {
      status: 400,
      code: 'invalid_credentials',
      message: 'You have blocked this account for this repository'
    }
  },
  dataset: {
    alreadyExists: {
      status: 400,
      code: 'already_exists',
      message: 'already exists'
    },
    notAdded: {
      status: 404,
      code: 'not_added',
      message: 'Something went wrong while adding files'
    },
    invalidFileType: {
      status: 400,
      code: 'invalid_file_type',
      message: 'invalid file type'
    }
  },
  accessLevel: {
    alreadyAccessGiven: {
      status: 400,
      code: 'invalid_credentials',
      message: 'You already gave permission to this account'
    },
    blockAccount: {
      status: 400,
      code: 'invalid_credentials',
      message: 'You have blocked this account for this repository'
    }
  }
}

module.exports = {
  errors
}
