'use strict'

const amqp = require('amqplib')
const queue = process.env.QUEUE || 'hello'

const baseWait = 200
const messagesAmount = 6

function waitLongerEveryLoopCycle(number, cb) {
  const max = number

  while(number--) {
    let wait = baseWait * (max - number) // take longer with the last few messages

    setTimeout(cb, wait)
  }
}

function exitAfterSend() {
  setTimeout(() => {
    process.exit(0)
  }, messagesAmount * baseWait * 1.2)
}

async function amqpPublish() {
  const connection = await amqp.connect('amqp://localhost')
  const channel = await connection.createChannel()

  channel.assertQueue(queue)

  waitLongerEveryLoopCycle(messagesAmount, () => {
    let message = {
      id: Math.random().toString(32).slice(2, 6),
      message: 'Hello world!'
    } 
    let sent = channel.sendToQueue(queue, Buffer.from(
      JSON.stringify(message)
    ))

    sent ?
      console.log(`Sent message to "${queue}" queue`, message) :
      console.log(`Fails sending message to "${queue}" queue`, message)
  })

  exitAfterSend()
}

amqpPublish()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })