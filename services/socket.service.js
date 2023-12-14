const logger = require('./logger.service')

var gIo = null

function setupSocketAPI(http) {
    gIo = require('socket.io')(http, {
        cors: {
            origin: '*',
        },
    })
    gIo.on('connection', socket => {
        logger.info(`New connected socket [id: ${socket.id}]`)
        socket.on('disconnect', socket => {
            logger.info(`Socket disconnected [id: ${socket.id}]`)
        })
        socket.on('set-wap-room', room => {
            if (socket.myRoom === room) return
            if (socket.myRoom) {
                socket.leave(socket.myRoom)
                logger.info(`Socket is leaving room ${socket.myRoom} [id: ${socket.id}]`)
            }
            socket.join(room)
            socket.myRoom = room
        })
        socket.on('update-wap', wap => {
            broadcast({
                type: 'updated-wap',
                data: wap,
                room: socket.myRoom,
                userId: socket.id,
            })
        })
        socket.on('update-mouse-pos', mousePos => {
            broadcast({
                type: 'mouse-move',
                data: mousePos,
                room: socket.myRoom,
                userId: socket.id,
            })
        })
        socket.on('guest-msg', ({ guestMsg, to }) => {
            console.log('GUEST MSG FROM socket id', socket.id, 'socket.userId:', socket.userId, 'TO OWNER', to)
            console.log('GUEST MSG', guestMsg)
            logger.info(`New chat msg from socket [id: ${socket.id}], emitting to ${to}`)
            // emits to all sockets:
            // gIo.emit('chat addMsg', msg)
            // emits only to sockets in the same room
            // gIo.to(socket.myRoom).emit('guest-add-msg', msg)
            emitToUser({
                type: 'guest-add-msg',
                data: [guestMsg[0], { by: 'customer', txt: `${guestMsg[1]}`, date: new Date().getTime() }],
                userId: to,
            })
        })
        socket.on('user-watch', userId => {
            logger.info(`user-watch from socket [id: ${socket.id}], on user ${userId}`)
            socket.join('watching:' + userId)
        })

        socket.on('owner-msg', ({ ownerMsg, to }) => {
            console.log('OWNER MSG FROM socket id', socket.id, 'socket.userId:', socket.userId, 'TO GUEST', to)
            console.log(ownerMsg)
            logger.info(`New chat msg from socket [id: ${socket.id}], emitting to ${to}`)
            gIo.sockets.to(to).emit('owner-add-msg', { by: 'owner', txt: `${ownerMsg}`, date: new Date().getTime() })
        })

        socket.on('set-user-socket', userId => {
            logger.info(`Setting socket.userId = ${userId} for socket [id: ${socket.id}]`)
            socket.userId = userId
            // socket.id = userId
            console.log('userId:', userId)
        })
        socket.on('unset-user-socket', () => {
            logger.info(`Removing socket.userId for socket [id: ${socket.id}]`)
            delete socket.userId
        })

        socket.on('send-subscription', ({ email, to }) => {
            logger.info(`New subscription from socket [id:${socket.id}]`)
            console.log(to)
            console.log(email)
            emitToUser({
                type: 'add-subscription',
                data: email,
                userId: to,
            })
        })

        socket.on('send-lead', ({ data, to }) => {
            logger.info(`New lead from socket [id:${socket.id}]`)
            console.log(to)
            console.log(data)
            emitToUser({
                type: 'add-lead',
                data,
                userId: to,
            })
        })

        socket.on('send-schedule', ({ data, to }) => {
            logger.info(`New appointment from socket [id:${socket.id}]`)
            console.log(to)
            console.log(data)
            emitToUser({
                type: 'add-schedule',
                data,
                userId: to,
            })
        })

        socket.on('user-at-editor', wapId => {
            if (socket.currWap === wapId) return
            if (socket.currWap) {
                socket.leave(socket.wapId)
            }
            socket.join(wapId)
            socket.currWap = wapId
        })
    })
}

function emitTo({ type, data, label }) {
    if (label) gIo.to('watching:' + label.toString()).emit(type, data)
    else gIo.emit(type, data)
}

async function emitToUser({ type, data, userId }) {
    userId = userId.toString() || userId
    // const socket = await _getUserSocket(userId)
    const sockets = await _getAllSockets()
    const socket = sockets.find(s => {
        console.log(s.id, userId)
        return s.userId == userId
    })
    // console.log(socket, 'SOCKET')
    if (socket) {
        console.log('SENDING')
        console.log(`Emiting event: ${type} to user: ${userId} socket [id: ${socket.id}]`)
        logger.info(`Emiting event: ${type} to user: ${userId} socket [id: ${socket.id}]`)
        console.log('SOCKET.USERID::', socket.userId, 'SOCKET DATA', data)
        socket.emit(type, data)
    } else {
        console.log(`No active socket for user: ${userId}`)
        logger.info(`No active socket for user: ${userId}`)
        // _printSockets()
    }
}

// If possible, send to all sockets BUT not the current socket
// Optionally, broadcast to a room / to all
async function broadcast({ type, data, room = null, userId }) {
    userId = userId.toString()
    logger.info(`Broadcasting event: ${type}`)
    const excludedSocket = await _getUserSocket(userId)
    if (room && excludedSocket) {
        logger.info(`Broadcast to room ${room} excluding user: ${userId}`)
        excludedSocket.broadcast.to(room).emit(type, data)
    } else if (excludedSocket) {
        logger.info(`Broadcast to all excluding user: ${userId}`)
        excludedSocket.broadcast.emit(type, data)
    } else if (room) {
        logger.info(`Emit to room: ${room}`)
        gIo.to(room).emit(type, data)
    } else {
        logger.info(`Emit to all`)
        gIo.emit(type, data)
    }
}

async function _getUserSocket(userId) {
    const sockets = await _getAllSockets()
    const socket = sockets.find(s => {
        return s.id === userId
    })
    return socket
}
async function _getAllSockets() {
    // return all Socket instances
    const sockets = await gIo.fetchSockets()
    return sockets
}

async function _printSockets() {
    const sockets = await _getAllSockets()
    console.log(`Sockets: (count: ${sockets.length}):`)
    sockets.forEach(_printSocket)
}
function _printSocket(socket) {
    console.log(`Socket - socketId: ${socket.id} userId: ${socket.userId}`)
}

module.exports = {
    // set up the sockets service and define the API
    setupSocketAPI,
    // emit to everyone / everyone in a specific room (label)
    emitTo,
    // emit to a specific user (if currently active in system)
    emitToUser,
    // Send to all sockets BUT not the current socket - if found
    // (otherwise broadcast to a room / to all)
    broadcast,
}
