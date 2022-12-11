import http from 'http'

import app from '../src/app'

const server = http.createServer(app)

export default server
