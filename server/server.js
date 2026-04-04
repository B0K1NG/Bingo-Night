const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

const app = express()
app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
  cors: { origin: '*' },
})

let rooms = {}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('host:join', ({ room }) => {
    socket.join(room)
  })

  socket.on('player:join', ({ name, emoji, room }) => {
    if (!room) return

    socket.join(room)

    if (!rooms[room]) {
      rooms[room] = {
        players: [],
        buzzOrder: [],
      }
    }

    rooms[room].players.push({
      id: socket.id,
      name,
      emoji,
    })

    io.to(room).emit('players:update', rooms[room].players)
  })

  socket.on('player:buzz', ({ room }) => {
    const r = rooms[room]
    if (!r) return

    const already = r.buzzOrder.find(p => p.id === socket.id)
    if (already) return

    const player = r.players.find(p => p.id === socket.id)
    if (!player) return

    r.buzzOrder.push(player)

    io.to(room).emit('buzz:update', r.buzzOrder)
  })

  socket.on('buzz:reset', ({ room }) => {
    const r = rooms[room]
    if (!r) return

    r.buzzOrder = []

    io.to(room).emit('buzz:update', [])
    io.to(room).emit('buzz:cleared')
  })

  socket.on('buzz:remove', ({ room, playerId }) => {
    const r = rooms[room]
    if (!r) return

    r.buzzOrder = r.buzzOrder.filter(p => p.id !== playerId)

    io.to(room).emit('buzz:update', r.buzzOrder)
    io.to(playerId).emit('buzz:cleared')
  })

  socket.on('player:reaction', ({ emoji, room }) => {
    io.to(room).emit('reaction:new', {
      emoji,
      id: Date.now() + Math.random(),
    })
  })

  socket.on('disconnect', () => {
    for (const room in rooms) {
      const r = rooms[room]

      r.players = r.players.filter(p => p.id !== socket.id)
      r.buzzOrder = r.buzzOrder.filter(p => p.id !== socket.id)

      io.to(room).emit('players:update', r.players)
      io.to(room).emit('buzz:update', r.buzzOrder)
    }
  })
})

server.listen(3000, '0.0.0.0', () => {
  console.log('Server running on port 3000')
})