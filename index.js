'use strict'

const cluster = require('cluster')
const fs = require('fs')
const numCPUs = require('os').cpus().length
const peerId = require('peer-id')
const R = require('ramda')

const keyStore = require('./keys')

const NUM_MAX_KEYS = 10000
const NUM_KEYS_TO_GEN_PER_BATCH = 50

const keyCache = keyStore.keys || []

const generateKeys = (numKeys) => {
  console.log(`Generating ${numKeys} additional keys`)

  try {
    R.forEach((idx) => {
      console.log(`Creating key: ${idx+1}`)
      const id = peerId.create()
      const json = id.toJSON()
      keyCache.push(json)
    }, R.range(0, numKeys))

    keyStore.keys = keyCache
  } catch (err) {
    throw err
  }

  console.log(`${numKeys} keys created`)

  const storeString = JSON.stringify(keyStore)

  fs.writeFile('keys.json', `${storeString}\r\n`, (err) => {
    if (err) {
      throw err
    }
    console.log('All keys written to keys.json')
  })
}

console.log(`Starting with ${keyCache.length} keys`)

generateKeys(NUM_KEYS_TO_GEN_PER_BATCH)


// TODO: Parallelize
// console.log(`Starting with ${keyCache.length} keys`)

// if (keyCache.length >= NUM_MAX_KEYS) {
//   console.log(`${NUM_MAX_KEYS} keys exist`)
// } else {
//   if (cluster.isMaster) {
//     console.log('Launching workers')
//     R.forEach((n) => cluster.fork(), R.range(0, numCPUs))
//   } else {
//     console.log('Worker launched')
//     generateKeys(NUM_KEYS_TO_GEN_PER_BATCH)
//   }
// }




