import React, { useState, useEffect, useCallback } from 'react';

// Data for the game
const CARD_DATA = [
  { name: 'P.E.K.K.A', elixir: 7, type: 'TROOP' },
  { name: 'HOG RIDER', elixir: 4, type: 'TROOP' },
  { name: 'WIZARD', elixir: 5, type: 'TROOP' },
  { name: 'MINION HORDE', elixir: 5, type: 'TROOP' },
  { name: 'FIREBALL', elixir: 4, type: 'SPELL' },
  { name: 'GOLEM', elixir: 8, type: 'TROOP' },
  { name: 'MINIONS', elixir: 3, type: 'TROOP' },
  { name: 'ARCHERS', elixir: 3, type: 'TROOP' },
  { name: 'GOBLIN GANG', elixir: 3, type: 'TROOP' },
  { name: 'KNIGHT', elixir: 3, type: 'TROOP' },
  { name: 'SKELETON ARMY', elixir: 3, type: 'TROOP' },
  { name: 'GOBLIN BARREL', elixir: 3, type: 'SPELL' },
  { name: 'LOG', elixir: 2, type: 'SPELL' },
  { name: 'POISON', elixir: 4, type: 'SPELL' },
  { name: 'ROCKET', elixir: 6, type: 'SPELL' },
  { name: 'RAGE', elixir: 2, type: 'SPELL' },
  { name: 'TORNADO', elixir: 3, type: 'SPELL' },
  { name: 'BOMBER', elixir: 3, type: 'TROOP' },
  { name: 'INFERNO TOWER', elixir: 5, type: 'BUILDING' },
  { name: 'GOBLIN HUT', elixir: 5, type: 'BUILDING' },
  { name: 'X-BOW', elixir: 6, type: 'BUILDING' },
  { name: 'ROYAL GIANT', elixir: 6, type: 'TROOP' },
  { name: 'ELIXIR COLLECTOR', elixir: 6, type: 'BUILDING' },
  { name: 'BARBARIAN HUT', elixir: 7, type: 'BUILDING' },
  { name: 'ROYAL RECRUITS', elixir: 7, type: 'TROOP' },
  { name: 'GIANT', elixir: 5, type: 'TROOP' },
];

// Helper function to pick a random card from the list
const getRandomCard = () => CARD_DATA[Math.floor(Math.random() * CARD_DATA.length)];

// Main App component
function App() {
  const [solution, setSolution] = useState<any | null>(null);
  const [guesses, setGuesses] = useState<any[]>([]);
  const [guessInput, setGuessInput] = useState('');
  const [message, setMessage] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);

  const resetGame = useCallback(() => {
    setSolution(getRandomCard());
    setGuesses([]);
    setGuessInput('');
    setMessage('');
    setIsGameOver(false);
  }, []);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuessInput(e.target.value);
  };

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (isGameOver) return;

    const guessedCard = CARD_DATA.find(card => card.name.toUpperCase() === guessInput.toUpperCase());

    if (!guessedCard) {
      setMessage('Not a valid Clash Royale card name!');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    const newGuess = {
      card: guessedCard,
      feedback: {
        name: guessedCard.name.toUpperCase() === solution.name.toUpperCase() ? 'correct' : 'incorrect',
        elixir: {
          status: guessedCard.elixir === solution.elixir ? 'correct' : 'incorrect',
          direction: guessedCard.elixir > solution.elixir ? 'down' : (guessedCard.elixir < solution.elixir ? 'up' : null),
        },
        type: guessedCard.type === solution.type ? 'correct' : 'incorrect',
      },
    };

    setGuesses(prev => [...prev, newGuess]);
    setGuessInput('');

    if (newGuess.feedback.name === 'correct') {
      setMessage(`You won! The card was ${solution.name}.`);
      setIsGameOver(true);
    } else if (guesses.length >= 5) {
      setMessage(`Game over! The card was ${solution.name}.`);
      setIsGameOver(true);
    }
  };

  const renderGuessGrid = () => {
    return (
      <div style={{width: '100%', maxWidth: '40rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#374151', borderRadius: '0.5rem 0.5rem 0 0', padding: '0.75rem', fontWeight: 'bold', color: '#D1D5DB', borderBottom: '1px solid #4B5563'}}>
          <div style={{flex: '1', textAlign: 'left', paddingLeft: '0.5rem'}}>Card Name</div>
          <div style={{width: '6rem', textAlign: 'center'}}>Elixir</div>
          <div style={{width: '6rem', textAlign: 'center'}}>Type</div>
        </div>
        {guesses.map((guess, index) => (
          <div key={index} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1F2937', borderRadius: '0.5rem', padding: '0.75rem'}}>
            <div style={{flex: '1', textAlign: 'left', fontWeight: '600', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
              {guess.card.name}
            </div>
            <div style={{width: '6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', borderRadius: '9999px', padding: '0.25rem', color: guess.feedback.elixir.status === 'correct' ? '#4ADE80' : '#F87171'}}>
              {guess.card.elixir}
              {guess.feedback.elixir.direction === 'up' && (
                <svg xmlns="http://www.w3.org/2000/svg" style={{height: '1rem', width: '1rem', marginLeft: '0.25rem'}} viewBox="0 0 512 512" fill="currentColor">
                  <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM271 9.4c-3.1-6.3-9.7-10.4-16.7-10.4S244.1 3.1 241 9.4L13.4 227.6c-4.4 8.9-3.4 19.6 2.6 27.5S24.6 272 32 272H240.2L128 392c-10.3 10.3-11.4 26.9-2.9 38.3s23.5 17.5 38.3 2.9L288 304.6l128 128.4c10.3 10.3 26.9 11.4 38.3 2.9s17.5-23.5 2.9-38.3L271 9.4z"/>
                </svg>
              )}
              {guess.feedback.elixir.direction === 'down' && (
                <svg xmlns="http://www.w3.org/2000/svg" style={{height: '1rem', width: '1rem', marginLeft: '0.25rem'}} viewBox="0 0 512 512" fill="currentColor">
                  <path d="M256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM241 502.6c3.1 6.3 9.7 10.4 16.7 10.4s13.6-4.1 16.7-10.4L498.6 284.4c4.4-8.9 3.4-19.6-2.6-27.5S487.4 240 480 240H271.8L384 120c10.3-10.3 11.4-26.9 2.9-38.3s-23.5-17.5-38.3-2.9L224 207.4 96 79c-10.3-10.3-26.9-11.4-38.3-2.9S40.2 99.4 55.4 114.7L241 502.6z"/>
                </svg>
              )}
            </div>
            <div style={{width: '6rem', fontWeight: 'bold', borderRadius: '9999px', padding: '0.25rem', color: guess.feedback.type === 'correct' ? '#4ADE80' : '#F87171'}}>
              {guess.card.type}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111827', color: '#fff', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');

          html, body, #root, #root > div {
            height: 100%;
            width: 100%;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          .game-title {
            font-size: 2.25rem;
            line-height: 2.5rem;
            font-weight: bold;
            letter-spacing: -0.025em;
            color: white;
          }
          
          .message-box {
            font-weight: bold;
            height: 1.5rem;
          }
          
          .message-text {
            font-size: 1.25rem;
            transition: opacity 0.3s;
          }

          @media (min-width: 768px) {
            .game-title {
              font-size: 3rem;
              line-height: 1;
            }
            .message-box {
              height: 2rem;
            }
          }

          input {
            flex: 1;
            max-width: 24rem;
            padding: 0.75rem;
            border-radius: 0.5rem;
            background-color: #1F2937;
            color: white;
            border: 1px solid #4B5563;
            outline: none;
            transition: border-color 0.2s;
          }
          input::placeholder {
            color: #9CA3AF;
          }
          input:focus {
            border-color: #3B82F6;
          }

          button {
            padding: 0.5rem 1.5rem;
            border-radius: 0.5rem;
            background-color: #3B82F6;
            transition: background-color 0.2s;
            color: white;
            font-weight: bold;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          }
          button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        `}
      </style>
      
      <header style={{ width: '100%', textAlign: 'center', padding: '1rem', marginBottom: '1rem' }}>
        <h1 className="game-title">Clash Royale Wordle</h1>
      </header>

      <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', padding: '1rem', width: '100%', maxWidth: '48rem' }}>
        {renderGuessGrid()}
        
        <form onSubmit={handleGuess} style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
          <input
            type="text"
            value={guessInput}
            onChange={handleInputChange}
            placeholder="Enter card name..."
            disabled={isGameOver}
          />
          <button
            type="submit"
            disabled={isGameOver}
          >
            Guess
          </button>
        </form>

        <div className="message-box" style={{ textAlign: 'center' }}>
          {message && (
            <p className="message-text" style={{ opacity: message ? '1' : '0' }}>
              {message}
            </p>
          )}
        </div>
        
        <button
          onClick={resetGame}
          style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.5rem' }} viewBox="0 0 512 512" fill="currentColor">
            <path d="M464 128H272.7C286.7 89.2 320.1 64 360 64c52.9 0 96 43.1 96 96c0 12.9-2.6 25.3-7.6 36.6l44.3 22.1C500 205.9 512 181.7 512 159.9c0-88.4-71.6-160-160-160c-60.2 0-113.6 32.7-142.6 81.3L135.2 24.3C124.7 9.8 106.3 0 86.4 0C55.7 0 31.7 22.8 28.5 53.5L.2 301.7C-3.2 334.3 19.1 364.5 51.7 367.9L299.8 396.2c32.6 3.4 62.8-19 66.2-51.6l28.3-255.4C398.7 89.9 430.7 64 464 64c26.5 0 48 21.5 48 48s-21.5 48-48 48zM56 192c-35.3 0-64 28.7-64 64s28.7 64 64 64s64-28.7 64-64s-28.7-64-64-64z"/>
          </svg>
          New Game
        </button>
      </main>
    </div>
  );
}

export default App;
