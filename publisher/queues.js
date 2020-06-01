'use strict'

const amqp = require('amqplib')
const queue = process.env.QUEUE || 'hello'

const messagesAmount = 6
const wait = 400

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

async function sleepLoop(number, cb) {
    while (number--) {
        await sleep(wait)

        cb()
    }
}

async function exitAfterSend() {
    await sleep(messagesAmount * wait * 1.2)

    process.exit(0)
}

async function publisher() {
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()

    await channel.assertQueue(queue)

    sleepLoop(messagesAmount, async () => {
        const message = {
            id: Math.random().toString(32).slice(2, 6),
            text: 'Hello world!'
        }

        const sent = await channel.sendToQueue(
            queue,
            Buffer.from(JSON.stringify(message)),
            {
                // persistent: true
            }
        )

        sent
            ? console.log(`Sent message to "${queue}" queue`, message)
            : console.log(`Fails sending message to "${queue}" queue`, message)
    })
}

publisher().catch((error) => {
    console.error(error)
    process.exit(1)
})

exitAfterSend()
