'use strict'

const fs = require('fs')
const peerId = require('peer-id')
const R = require('ramda')
const keyStore = require('./keys')

const NUM_KEYS_TO_GEN = 10

const keyCache = keyStore.keys || []
const startLength = keyCache.length
console.log(`Start length: ${startLength}`)

// Generate the keys and cache them in memory
R.forEach((n) => {
  console.log(`Now adding key number ${n + 1 + startLength}`)
  const id = peerId.create()
  const json = id.toJSON()
  keyCache.push(json)
}, R.range(0, NUM_KEYS_TO_GEN))

keyStore.keys = keyCache
const finalLength = keyCache.length

console.log(`Final length: ${finalLength}`)
console.log(`${finalLength - startLength} keys added`)

fs.writeFile('keys.json', `${JSON.stringify(keyStore)}\r\n`, (err) => {
  if (err) {
    throw err
  }
  console.log('All keys written to keys.json')
})
