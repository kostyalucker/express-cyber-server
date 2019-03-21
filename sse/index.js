const EventEmitter = require('events')
const getMatches = require('../scrape')

const emitter = new EventEmitter()

const state = {
  likes: 10,
  comments: 3,
  matches: null
}

async function sendData() {
  await getMatches.then(res => {
    state.matches = res
  })
  await emitter.emit('push', 'matches', {
    value: state.matches
  })
}

module.exports = sendData
