'use strict'

const amqp = require('amqplib')
const queue = process.env.QUEUE || 'hello'

function intensiveOperation() {
  let i = 1e9
  while(i--) {}
}

async function amqpPublish() {
  const connection = await amqp.connect('amqp://localhost')
  const channel = await connection.createChannel()

  channel.assertQueue(queue)

  channel.consume(queue, message => {
    const content = JSON.parse(message.content)

    intensiveOperation()

    console.log(`Received message from "${queue}" queue`, content.id)
    console.log(content)

    channel.ack(message)
  }, {
    // noAck: true
  })
}

amqpPublish()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })