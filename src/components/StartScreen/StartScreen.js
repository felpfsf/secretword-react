import './StartScreen.css'

const StartScreen = ({ startGame }) => {
  return (
    <div className="start">
      <h1>Palavra Secreta</h1>
      <p>Click to start</p>
      <button onClick={startGame}>Start</button>
    </div>
  )
}

export default StartScreen
