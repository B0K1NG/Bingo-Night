type PlayerJoinRoomProps = {
  value: string
  onChange: (value: string) => void
  onJoin: (name: string) => void
}

export default function PlayerJoinRoom({
  value,
  onChange,
  onJoin,
}: PlayerJoinRoomProps) {
  return (
    <div className="player-container">
      <h1>Join Room</h1>
      <input
        type="text"
        placeholder="Enter your team name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      <button onClick={() => onJoin(value)}>Join Room</button>
    </div>
  )
}