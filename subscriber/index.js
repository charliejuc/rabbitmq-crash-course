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

    channel.assertQueue(queue, {
      durable: false
    })

    channel.consume(queue, message => {
      // console.log(message)
      console.log(queue, 'START')
      
      let i = 2e9
      while(--i) {}

      channel.ack(message)

      console.log(" [x] Received %s", message.content.toString())
    }, {
      noAck: false
    })
  })
})