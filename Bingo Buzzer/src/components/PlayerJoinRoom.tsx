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
    <div className="player__container">
      <h1>Komandos informacija</h1>
      <input
        type="text"
        placeholder="Įveskite komandos pavadinimą"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      <button onClick={() => onJoin(value)}>Prisijungti prie kambario</button>
    </div>
  )
}