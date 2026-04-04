import { useState, useEffect } from 'react'
import HostCreateRoom from '../components/HostCreateRoom'
import HostLobby from '../components/HostLobby'
import { socket } from '../socket'

type Player = {
  id: string
  name: string
  emoji: string
}

type Reaction = {
  id: number
  emoji: string
}

export default function HostPage() {
  const [roomInput, setRoomInput] = useState('')
  const [createdRoom, setCreatedRoom] = useState('')
  const [roomId, setRoomId] = useState('')
  const [players, setPlayers] = useState<Player[]>([])
  const [buzzList, setBuzzList] = useState<Player[]>([])
  const [reactions, setReactions] = useState<Reaction[]>([])
  const [gameStarted, setGameStarted] = useState(false)

  const [hostToken, setHostToken] = useState<string | null>(
    localStorage.getItem('hostToken')
  )

  const params = new URLSearchParams(window.location.search)
  const urlToken = params.get('host')

  if (createdRoom && hostToken && urlToken !== hostToken) {
    return <div>Access denied</div>
  }

  useEffect(() => {
    socket.on('players:update', setPlayers)
    socket.on('buzz:update', setBuzzList)

    socket.on('reaction:new', (reaction: Reaction) => {
      setReactions(prev => [...prev, reaction])

      setTimeout(() => {
        setReactions(prev => prev.filter(r => r.id !== reaction.id))
      }, 2000)
    })

    return () => {
      socket.off('players:update')
      socket.off('buzz:update')
      socket.off('reaction:new')
    }
  }, [])

  const handleCreateRoom = () => {
    if (!roomInput.trim()) return

    const token = Math.random().toString(36).substring(2, 10)
    const room = Math.random().toString(36).substring(2, 8)

    setHostToken(token)
    localStorage.setItem('hostToken', token)

    setRoomId(room)
    setCreatedRoom(roomInput.trim())

    // 🔥 CRITICAL FIX
    socket.emit('host:join', { room })

    window.history.replaceState(null, '', `/?host=${token}`)
  }

  const handleDeleteRoom = () => {
    setCreatedRoom('')
    setRoomInput('')
    setGameStarted(false)
  }

  const handleResetBuzz = () => {
    socket.emit('buzz:reset', { room: roomId })
  }

  const handleRemoveBuzz = (id: string) => {
    socket.emit('buzz:remove', { room: roomId, playerId: id })
  }

  const handleStartGame = () => {
    setGameStarted(true)
  }

  if (!createdRoom) {
    return (
      <HostCreateRoom
        value={roomInput}
        onChange={setRoomInput}
        onCreate={handleCreateRoom}
      />
    )
  }

  return (
    <HostLobby
      roomName={createdRoom}
      roomId={roomId}
      onDelete={handleDeleteRoom}
      players={players}
      buzzList={buzzList}
      onReset={handleResetBuzz}
      onRemoveBuzz={handleRemoveBuzz}
      reactions={reactions}
      gameStarted={gameStarted}
      onStartGame={handleStartGame}
    />
  )
}