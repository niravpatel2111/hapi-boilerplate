'use strict'

const mongoose = require('mongoose')

const Bcrypt = require('bcrypt')

const Schema = mongoose.Schema

const { uuid } = require('uuidv4')

const Types = Schema.Types

const modelName = 'user'

const errorHelper = require('@utilities/error-helper')

const aiDBConn = require('@plugins/mongoose.plugin').plugin.aiDBConn()


const generalHelper = require('@utilities/helper')

const UserSchema = new Schema(
  {
    userName: {
      type: Types.String,
      require: true
    },
    password: {
      type: Types.String,
      require: true
    },
    firstName: {
      type: Types.String,
      default: null
    },
    lastName: {
      type: Types.String,
      default: null
    },
    email: {
      type: Types.String,
      default: null
    },
    emailVerified: {
      type: Types.Boolean,
      default: false
    },
    emailToken: {
      type: Types.String,
      default: false
    },
    emailTokenExpireAt: {
      type: Types.Date,
      default: null
    },
    createdAt: {
      type: Types.Date,
      default: null
    },
    updatedAt: {
      type: Types.Date,
      default: null
    }
  },
  {
    versionKey: false,
    strict: false,
    timestamps: true
  }
)

UserSchema.pre('save', async function (next) {
  const user = this

  // Set Password & hash before save it
  if (user.isNew) {
    const passHash = await user.generateHash(user.password)
    user.password = passHash.hash
  }

  // If user comes from invitation code we don't need to verify email address
  if (!user.emailVerified) {
    const emailHash = await user.generateHash()
    user.emailToken = emailHash.hash
  }
  next()
})

UserSchema.methods = {
  generateHash: async function (key) {
    try {
      if (key === undefined) {
        key = uuid()
      }
      const salt = await Bcrypt.genSalt(10)
      const hash = await Bcrypt.hash(key, salt)
      return {
        key,
        hash
      }
    } catch (err) {
      errorHelper.handleError(err)
    }
  }
}

UserSchema.statics = {
  findByCredentials: async function (username, password) {
    try {
      const self = this
      const mongooseQuery = await self.findOne({
        email: username.toLowerCase()
      })
      if (!mongooseQuery) {
        return false
      }
      const user = mongooseQuery.toObject()
      const source = user.password
      const passwordMatch = await Bcrypt.compare(password, source)
      if (passwordMatch) {
        return user
      }
    } catch (err) {
      errorHelper.handleError(err)
    }
  },
  generateHash: async function (key) {
    try {
      if (key === undefined) {
        key = uuid()
      }
      const salt = await Bcrypt.genSalt(10)
      const hash = await Bcrypt.hash(key, salt)
      return {
        key,
        hash
      }
    } catch (err) {
      errorHelper.handleError(err)
    }
  }

}

exports.schema = aiDBConn.model(modelName, UserSchema)
