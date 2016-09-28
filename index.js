'use strict'

const fs = require('fs')
const peerId = require('peer-id')
const R = require('ramda')
const keyStore = require('./keys')

const NUM_MAX_KEYS = 10000
const NUM_KEYS_TO_GEN_PER_BATCH = 100

const keyCache = keyStore.keys || []
const startLength = keyCache.length

console.log(`Start length: ${startLength}`)

if (startLength >= NUM_MAX_KEYS) {
  console.log(`${NUM_MAX_KEYS} keys exist`)
  return
}

console.log(`Generating ${NUM_KEYS_TO_GEN_PER_BATCH} additional keys`)

// Generate the keys and cache them in memory
R.forEach((n) => {
  console.log(`Now adding key number ${n + 1 + startLength}`)
  const id = peerId.create()
  const json = id.toJSON()
  keyCache.push(json)
}, R.range(0, NUM_KEYS_TO_GEN_PER_BATCH))

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
