'use strict'

const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const Boom = require('@hapi/boom')
const errorHelper = require('@utilities/error-helper')

const apiHeaders = () => {
  return Joi.object({
    authorization: Joi.string()
  }).options({
    allowUnknown: true
  })
}

const encodeBase64 = string => {
  return Buffer.from(string).toString('base64')
}

const decodeBase64 = string => {
  return Buffer.from(string, 'base64').toString()
}

const kbToBytes = kb => {
  return kb * 1024
}

const mbToBytes = mb => {
  return mb * 1048576
}

const bytesToGb = bytes => {
  return bytes / 1024 / 1024 / 1024
}

const ConvertTbToGb = tb => {
  return tb / 1024
}


const sourceSort = async data => {
  const sortedNameData = data.sort((a, b) => {
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  })
  const sortedFileFolderData = sortedNameData.sort((a, b) => {
    return a.type.toLowerCase().localeCompare(b.type.toLowerCase())
  })
  return sortedFileFolderData
}

const generateRandomString = length => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  let result = ''
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

// key, array
const inArray = (needle, haystack) => {
  var length = haystack.length
  for (var i = 0; i < length; i++) {
    if (haystack[i] === needle) return true
  }
  return false
}


module.exports = {
  apiHeaders,
  encodeBase64,
  decodeBase64,
  sourceSort,
  generateRandomString,
  inArray,
  kbToBytes,
  bytesToGb,
  ConvertTbToGb,
  mbToBytes
}
