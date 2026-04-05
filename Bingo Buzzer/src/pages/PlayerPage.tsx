import { useState, useEffect } from "react";
import PlayerJoinRoom from "../components/PlayerJoinRoom";
import { socket } from '../socket';

type Player = {
  name: string;
  emoji: string;
}

export default function PlayerPage() {

  const params = new URLSearchParams(window.location.search);
  const room = params.get('room') || '';

  const emojis = ['🤣','🥳','😡','💋','💃','🕺🏼', '🔥', '🎉', '❤️', '🍾'];

  const [playerName, setPlayerName] = useState('');
  const [joinedPlayer, setJoinedPlayer] = useState<Player | null>(null);
  const [hasBuzzed, setHasBuzzed] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected:', socket.id)
    })

    socket.on('buzz:cleared', () => {
      setHasBuzzed(false)
    })

    return () => {
      socket.off('connect')
      socket.off('buzz:cleared')
    }
  }, [])

  const handlePlayerName = (value: string) => {
    setPlayerName(value);
  };

  const handleJoinRoom = (name: string) => {
    if (!name.trim()) {
      alert('Please enter a team name');
      return;
    }

    if (!room) {
      alert('Invalid room');
      return;
    }

    const randomEmoji =
      emojis[Math.floor(Math.random() * emojis.length)];

    socket.emit('player:join', {
      name: name.trim(),
      emoji: randomEmoji,
      room,
    });

    setJoinedPlayer({
      name: name.trim(),
      emoji: randomEmoji,
    });
  };

  const handleBuzz = () => {
    if (hasBuzzed) return;

    setHasBuzzed(true);

    socket.emit('player:buzz', { room });
  };

  const handleReaction = (emoji: string) => {
    socket.emit('player:reaction', { emoji, room });
  };

  if (!joinedPlayer) {
    return (
      <PlayerJoinRoom
        value={playerName}
        onChange={handlePlayerName}
        onJoin={handleJoinRoom}
      />
    )
  }

  return (
    <div className="player">

      <div className="player__container">

        <h2 className="player__title">
          {joinedPlayer.emoji} {joinedPlayer.name}
        </h2>

        <div className="player__buzz">
          <button
            onClick={handleBuzz}
            disabled={hasBuzzed}
          >
            {hasBuzzed ? 'BINGO!' : 'BINGO!'}
          </button>
        </div>

        <div className="player__reactions">
          {emojis.slice(0, 9).map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleReaction(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>

      </div>

    </div>
  )
}