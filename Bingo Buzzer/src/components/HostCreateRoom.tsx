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
    <div className="host__container">
      <h1>Sukurti kambarį</h1>
      
      <div className="host__inputs">
        <input 
          type="text"
          placeholder="Įveskite kambario pavadinimą"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

        <button onClick={onCreate}>Sukurti kambarį</button>
       </div>
    </div>
  )
}