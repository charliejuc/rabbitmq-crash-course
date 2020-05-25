'use strict'

const amqp = require('amqplib/callback_api')
const queue = process.env.QUEUE || 'hello'

amqp.connect('amqp://localhost', function(error, connection) {
  if (error) {  
    throw error
  }
  console.log('CONNECTED')

  connection.createChannel(function(error, channel) {
    if (error) {
      throw error
    }

    const message = 'Test world! ' + Math.random().toString(32).slice(2)

    // channel.deleteQueue(queue, {}, console.log)

    channel.assertQueue(queue, {
      durable: false
    })

    channel.sendToQueue(queue, Buffer.from(message))
    console.log(" [x] Sent %s", message)
  })
})