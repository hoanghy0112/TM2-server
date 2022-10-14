import https from 'https'
import http from 'http'
import fs from 'fs'

import 'dotenv/config'

import app from '../src/app'
import { connectMongo } from '../src/services/mongo'

import path, { dirname } from 'path'

https.globalAgent.options.rejectUnauthorized = false

const PORT = process.env.PORT

// const _dirname = dirname(import.meta.url).slice(8)

const privateKey = fs.readFileSync('./bin/ssl/key.pem', 'utf8')
const certificate = fs.readFileSync('./bin/ssl/cert.pem', 'utf8')

var credentials = { key: privateKey, cert: certificate }

// const server = https.createServer(credentials, app)
const server = http.createServer(app)

async function startServer() {
	await connectMongo()

	server.listen(PORT, () => {
		console.log(`Listening on port ${PORT}`)
	})
}

startServer()
