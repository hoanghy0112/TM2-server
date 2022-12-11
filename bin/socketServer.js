import { Server } from 'socket.io'
import server from './httpServer'

const io = new Server(server, { path: '/socket/v2/' })

export default io
