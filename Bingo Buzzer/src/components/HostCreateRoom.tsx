type HostCreateRoomProps = {
  value: string
  onChange: (value: string) => void
  onCreate: () => void
}

export default function HostCreateRoom({
  value,
  onChange,
  onCreate,
}: HostCreateRoomProps) {
  return (
    <div className="host-container">
      <h1>Create Room</h1>
      <input 
        type="text"
        placeholder="Enter room name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
       />

       <button onClick={onCreate}>Create Room</button>
    </div>
  )
}