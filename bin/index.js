import 'dotenv/config'

import { connectMongo } from '../src/services/mongo'

import io from './socketServer'

import server from './httpServer'
import { socketHandlerV2 } from '../src/apiRouter/v2'

const PORT = process.env.PORT

async function startServer() {
	await connectMongo()

	server.listen(PORT, () => {
		console.log(`Listening on port ${PORT}`)
	})

	socketHandlerV2(io)
}

startServer()
