import http from 'http'

import 'dotenv/config'

import app from '../src/app'
import { connectMongo } from '../src/services/mongo'

http.globalAgent.options.rejectUnauthorized = false

const PORT = process.env.PORT

const server = http.createServer(app)

async function startServer() {
	await connectMongo()

	server.listen(PORT, () => {
		console.log(`Listening on port ${PORT}`)
	})
}

startServer()