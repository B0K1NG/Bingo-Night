import { QRCodeCanvas } from 'qrcode.react'

type Player = {
  id: string
  name: string
  emoji: string
}

type Reaction = {
  id: number
  emoji: string
}

type HostLobbyProps = {
  roomName: string
  roomId: string
  onDelete: () => void
  players: Player[]
  buzzList: Player[]
  onReset: () => void
  onRemoveBuzz: (id: string) => void
  reactions: Reaction[]
  gameStarted: boolean
  onStartGame: () => void
}

export default function HostLobby({
  roomName,
  roomId,
  onDelete,
  players,
  buzzList,
  onReset,
  onRemoveBuzz,
  reactions,
  gameStarted,
  onStartGame,
}: HostLobbyProps) {

  const baseUrl = import.meta.env.VITE_FRONTEND_URL
  const joinUrl = `${baseUrl}/play?room=${roomId}`

  return (
    <div className='host__room'>
      <h1>{roomName}</h1>

      {!gameStarted && (
        <>
          <QRCodeCanvas value={joinUrl} size={200} />
          <p>{joinUrl}</p>

          <div className='host__room-buttons'>
            <button onClick={onStartGame}>Pradėti muzikinį bingo</button>
            <button onClick={onDelete}>Ištrynti kambarį</button>
          </div>

          <div className="host__joined-players">

            <h2>Žaidėjai</h2>
              {players.map((p) => (
                <div key={p.id}>
                  {p.emoji} {p.name}
                </div>
              ))}
          </div>
        </>
      )}

      <div className='host__leaderboard'>
        <h2>Lyderių lentelė</h2>

        <button onClick={onReset}>Išvalyti rezultatus </button>

        {buzzList.map((p, i) => (
          <div key={p.id}>
            #{i + 1} — {p.emoji} {p.name}
            <button onClick={() => onRemoveBuzz(p.id)}>❌</button>
          </div>
        ))}
      </div>

      <div className="reaction-layer">
        {reactions.map((r) => (
          <span
            key={r.id}
            className="floating-emoji"
            style={{ left: `${Math.random() * 80}%` }}
          >
            {r.emoji}
          </span>
        ))}
      </div>
    </div>
  )
}