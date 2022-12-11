export default function setupUserSocketListener(socket, user) {
	socket.join(`user:${user._id}`)
}
