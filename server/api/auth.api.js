'use strict'


const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
// const Boom = require('@hapi/boom')
const errorHelper = require('@utilities/error-helper')
const Token = require('@utilities/create-token')
const generalHelper = require('@utilities/helper')
const { errors } = require('@utilities/constants')
const User = require('@models/user.model').schema


module.exports = {
  login: {
    validate: {
      payload: Joi.object().keys({
        email: Joi.string()
          .required()
          .trim()
          .label('Email'),
        password: Joi.string()
          .required()
          .trim()
          .label('Password')
      })
    },
    pre: [
      {
        assign: 'user',
        method: async (request, h) => {
          try {
            const { payload } = request
            const user = await User.findByCredentials(
              payload.email,
              payload.password
            )
            if (user) {
              return user
            } else {
              errorHelper.setValidationError({
                password: 'invalid username or password'
              })
            }
          } catch (err) {
            errorHelper.handleError(err)
          }
          return h.continue
        }
      },
      {
        assign: 'accessToken',
        method: (request, h) => {
          const { pre } = request
          return Token(pre.user, '730d')
        }
      },
      {
        assign: 'isDeleted',
        method: (request, h) => {
          const {
            pre: { user }
          } = request
          if (user.isDeleted) {
            errorHelper.handleError(errors.user.deleted)
          }
          return h.continue
        }
      },
      // {
      //   assign: 'emailVerified',
      //   method: async (request, h) => {
      //     const {
      //       pre: { user }
      //     } = request
      //     if (!user.emailVerified) {
      //       errorHelper.setValidationError({
      //         email: 'Please verify your email'
      //       })
      //     }
      //     return h.continue
      //   }
      // }
    ],
    handler: async (request, h) => {
      const {
        pre: { user, accessToken }
      } = request
      let response = {}
      delete user.password
      delete user.isDeleted
      response = {
        user,
        accessToken
      }
      return h.response(response).code(200)
    }
  },
  signup: {
    validate: {
      payload: Joi.object().keys({
        firstName: Joi.string()
          .required()
          .trim()
          .label('First Name'),
        lastName: Joi.string()
          .required()
          .trim()
          .label('Last Name'),
        userName: Joi.string()
          .required()
          .trim()
          .label('User Name'),
        email: Joi.string()
          .lowercase()
          .email()
          .required()
          .trim()
          .label('Email'),
        password: Joi.string()
          .required()
          .trim()
          .label('Password'),
        cPassword: Joi.string()
          .required()
          .trim()
          .valid(Joi.ref('password'))
          .label('Compare Password'),
      })
    },
    pre: [
      {
        assign: 'uniqueEmail',
        method: async (request, h) => {
          const { payload } = request
          try {
            const user = await User.findOne({
              email: payload.email
            })
            if (user) {
              errorHelper.setValidationError({
                email: 'email already exists'
              })
            }
            const userName = await User.findOne({
              userName: payload.userName
            })
            if (userName) {
              errorHelper.setValidationError({
                userName: 'UserName already exists'
              })
            }
          } catch (err) {
            errorHelper.handleError(err)
          }
          return h.continue
        }
      },
      {
        assign: 'signup',
        method: async (request, h) => {
          const { payload } = request
          delete payload.cPassword
          try {
            const { payload } = request
            const createdUser = await User.create(payload)
            return createdUser
          } catch (err) {
            errorHelper.handleError(err)
          }
        }
      },
      // {
      //   assign: 'sendmail',
      //   method: async (request, h) => {
      //     try {
      //       const {
      //         pre: { signup }
      //       } = request
      //       const id = generalHelper.encodeBase64(
      //         `${signup._id}:${signup.emailToken}`
      //       )
      //       const mailObj = {
      //         to: signup.email,
      //         subject: `Account verification`,
      //         html: `${signup.userName}, <br>
      //         Your account has been created.<br>
      //         Please <a href=${config.console_url}/auth/verify-account/${id} target="_blank">Click Here</a> to verify your account.`
      //       }
      //       await generalHelper.sendEmail(mailObj)
      //       return h.continue
      //     } catch (err) {
      //       errorHelper.handleError(err)
      //     }
      //   }
      // },
    ],
    handler: async (request, h) => {
      const {
        pre: { signup }
      } = request
      return h.response(signup).code(201)
    }
  },
  // verifyEmail: {
  //   validate: {
  //     payload: Joi.object().keys({
  //       id: Joi.string()
  //         .required()
  //         .trim()
  //         .label('User Id')
  //     })
  //   },
  //   pre: [
  //     {
  //       assign: 'user',
  //       method: async (request, h) => {
  //         const { payload } = request
  //         try {
  //           const id = generalHelper.decodeBase64(payload.id)
  //           if (id.split(':')[0] && id.split(':')[1]) {
  //             return await User.findOne({
  //               _id: id.split(':')[0]
  //             })
  //           } else {
  //             errorHelper.handleError(errors.user.userNotExist)
  //           }
  //         } catch (err) {
  //           errorHelper.handleError(err)
  //         }
  //       }
  //     }
  //   ],
  //   handler: async (request, h) => {
  //     try {
  //       const {
  //         payload,
  //         pre: { user }
  //       } = request
  //       const id = generalHelper.decodeBase64(payload.id)
  //       if (user && user.emailVerified) {
  //         return h
  //           .response({
  //             message: 'Account already verified!..'
  //           })
  //           .code(200)
  //       }
  //       if (
  //         user &&
  //         user.emailTokenExpireAt &&
  //         user.emailToken === id.split(':')[1]
  //       ) {
  //         if (moment().isBefore(user.emailTokenExpireAt)) {
  //           user.emailVerified = true
  //           user.emailToken = null
  //           await user.save()
  //           return h
  //             .response({
  //               message: 'Account activated successfully!..'
  //             })
  //             .code(200)
  //         } else {
  //           errorHelper.handleError({
  //             status: 400,
  //             code: 'link_expired',
  //             message: 'Link is expired'
  //           })
  //         }
  //       } else {
  //         errorHelper.handleError(errors.user.userNotExist)
  //       }
  //     } catch (err) {
  //       errorHelper.handleError(err)
  //     }
  //   }
  // },
  me: {
    validate: {
      headers: Joi.object({
        authorization: Joi.string()
      }).options({
        allowUnknown: true
      })
    },
    pre: [
      {
        assign: 'user',
        method: async (request, h) => {
          try {
            const user = await User.findOne({ _id: request.auth.credentials.user._id })
            if (user) {
              return user
            }
            errorHelper.handleError(errors.user.invalideCredentials)
          } catch (err) {
            errorHelper.handleError(err)
          }
          return h.continue
        }
      }
    ],
    handler: async (request, h) => {
      const {
        pre: { user }
      } = request
      return h.response(user).code(200)
    }
  }
}
