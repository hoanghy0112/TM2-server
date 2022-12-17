import { Server } from 'socket.io'
import server from './httpServer'

const io = new Server(server, {
	path: '/socket/v2/',
	cors: {
		credentials: true,
		origin: true,
	},
})

export default io
