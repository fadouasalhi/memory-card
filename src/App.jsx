import { useState,useEffect} from 'react'


import Gameboard from './components/Gameboard/Gameboard.jsx'
import './App.css'
function App() {

  
  const [score,setScore]=useState(0)
  const [topScore,setTopScore]=useState(0)
  const [clickedCards,setClickedCards]=useState([])
  const [cards,setCards]=useState([]);
   const [loading, setLoading] = useState(false) // Add this line
  const [error, setError] = useState(null) // Add this line
const [gameStarted,setGameStarted]=useState(false)
const [Difficulty,setDifficulty]=useState("")

const DifficultySettings = {
  easy: { Limit: 6, name: 'Easy (6 cards)' },
  medium: { Limit: 12, name: 'Medium (12 cards)' },
  hard: { Limit: 18, name: 'Hard (18 cards)' }
}
const startGame = (selectedDifficulty) => {
  setDifficulty(selectedDifficulty);
  setLoading(true);
  setGameStarted(true);

}
const cardLimit = DifficultySettings[Difficulty]?.Limit; // Note: capital 'L' in Limit

useEffect(() => {
  if (!Difficulty) return
 fetch(`https://pokeapi.co/api/v2/pokemon?limit=${cardLimit}`)
      .then((res) => {
        console.log("Response received:", res);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Data received:", data);
        
        const pokemonCards = data.results.map((pokemon, index) => {
          // Extract the Pokémon ID from its URL
          const urlParts = pokemon.url.split("/");
          const id = urlParts[urlParts.length - 2]; // Get second-to-last part (last part is empty)
          
          console.log(`Pokemon ${index}: ${pokemon.name}, ID: ${id}`);
          
          return {
            id: id,
            name: pokemon.name,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
          };
        });

        console.log("Pokemon cards created:", pokemonCards);
        setCards(pokemonCards);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Pokemon data:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [Difficulty]);
  const restartGame = () => {
    setScore(0);
    setClickedCards([]);
    setCards([]);
    setGameStarted(false);
    setDifficulty("");
    setLoading(false);
    setError(null);
  }

  function handleClick(id) {
    if (clickedCards.includes(id)) { 
      alert("You already clicked this card! Game Over!");
     restartGame();
       return; // stop execution here
      
    
    }
      const newscore= score + 1
      setScore(newscore)
      if(newscore>topScore){
        setTopScore(newscore)
      }
      setClickedCards([... clickedCards,id])
    
    if(newscore===cards.length){
      alert("Congratulations! You clicked all cards without repeating. You win!");
      restartGame();
      return;
    }
    shuffleCards();
  }
  
  function shuffleCards(){
    const shuffledCards=[...cards]
    for(let i=shuffledCards.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [shuffledCards[i],shuffledCards[j]]=[shuffledCards[j],shuffledCards[i]]
    }
    setCards(shuffledCards);
  }
  if(!gameStarted){
  return (
    <div className="mode-Selection">
      <header>
        <h1>Pokemon Memory Game</h1>
        <p>choose your Difficulty level:</p>
        {topScore>0 && <p> your best score is : {topScore}</p>}
      </header>
      <div className="difficulty-buttons">
      {/* Convert object to array of [key, value] pairs so we can use the map function that only works on arrays */}
      {Object.entries(DifficultySettings).map(([mode, settings])=>(
        <button key={mode} onClick={() => startGame(mode)} className={`difficulty-btn ${mode}`}>
          <h3>{settings.name}</h3>
          <p>Match all {settings.Limit} cards</p>
        </button>
       
        
      ))}
      </div>
      <div className="game-rules">
          <h3>How to play:</h3>
          <ul>
            <li>Click on Pokemon cards, but don't click the same one twice!</li>
            <li>Cards will shuffle after each click</li>
            <li>Try to click all cards without repeating any</li>
            <li>Your score increases with each new card clicked</li>
          </ul>
        </div>
    </div>
  )
}
if(loading){
  return(
  <div className="loading-screen">
    <h2>Loading {DifficultySettings[Difficulty].name}...</h2>

    <p>Please wait while we fetch the Pokémon data.</p>
    <button onClick={restartGame}>Back to Menu</button>
  </div>
  )
}
if(error){
  return(
    <div className="error-screen">
      <h2>Oops! Something went wrong.</h2>
      <p>Error: {error}</p>
      <button onClick={()=>startGame(Difficulty )}>try again</button>
    </div>
  )
}
//game screen
return(
  <div className="Game">
    <header>
      <h2 className='game-title'>
        Pokemon Memory Game - {DifficultySettings[Difficulty].name}
        <p className="score">Score: {score} | Top Score: {topScore}</p>
      </h2>
      <button onClick={restartGame} className='Back-btn'>Restart Game</button>
    </header>
    <div className="body">
      <Gameboard cards={cards} onCardClick={handleClick} />
    </div>
    <div className="footer">
      <p>Created by fadoua ❤️</p>
    </div>
  </div>
)
}
export default App