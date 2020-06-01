'use strict'

const amqp = require('amqplib')
const queue = process.env.QUEUE || 'hello'
const exchangeName = process.env.EXCHANGE || 'my-topic'
const exchangeType = 'topic'

console.log({
    queue,
    exchangeName,
    exchangeType
})

function intensiveOperation() {
    let i = 1e3
    while (i--) {}
}

async function subscriber() {
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()

    await channel.deleteExchange(exchangeName)

    await channel.assertQueue(queue)

    await channel.assertExchange(exchangeName, exchangeType)

    //remember to do unbind
    // await channel.unbindQueue(queue, exchangeName, 'aba.*')
    await channel.bindQueue(queue, exchangeName, 'aba.*.*')

    channel.consume(queue, (message) => {
        const content = JSON.parse(message.content.toString())

        intensiveOperation()

        console.log(`Received message from "${queue}" queue`)
        console.log(`Routing key "${message.fields.routingKey}" routingKey`)
        console.log(content)

        channel.ack(message)
    })
}

subscriber().catch((error) => {
    console.error(error)
    process.exit(1)
})
