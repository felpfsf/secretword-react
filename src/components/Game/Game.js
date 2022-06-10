import { useState, useRef } from 'react'
import './Game.css'

const Game = ({
  verifyLetter,
  pickedWords,
  pickedCategory,
  letters,
  guessedLetters,
  wrongLetters,
  guesses,
  score
}) => {
  // Estado para as letras escolhidas
  const [letter, setLetter] = useState('')
  const letterInputRef = useRef(null)

  // Submit do formulário
  const handleSubmit = e => {
    e.preventDefault()

    // Chama a função e passa a letra digitada como argumento
    verifyLetter(letter)

    setLetter('')
    // Retorna o foco para o input
    letterInputRef.current.focus()
  }
  return (
    <div className="game">
      <p className="points">
        <span>Pontuação: {score}</span>
      </p>
      <h1>Adivinhe a palavra: </h1>
      <h3 className="tip">
        Dica sobre a palavra: <span>{pickedCategory}</span>
      </h3>
      <p>Você ainda tem {guesses} tentativas</p>
      <div className="wordContainer">
        {/* mapeando o array letters
            caso encontre a letra correspondente então
            será impresso na tela a sua posição[i] correspondente
            senão os espaços continuarão em branco
         */}
        {letters.map((letter, i) =>
          guessedLetters.includes(letter) ? (
            <span key={i} className="letter">
              {letter}
            </span>
          ) : (
            <span key={i} className="blankSquare"></span>
          )
        )}
      </div>

      <div className="letterContainer">
        <p>Tente adivinhar uma letra da palavra</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="letter"
            maxLength={1}
            required
            onChange={event => setLetter(event.target.value)}
            value={letter}
            ref={letterInputRef}
          />
          <button>Play</button>
        </form>
      </div>
      <div className="wrongLettersContainer">
        <p>Letras já utilizadas: </p>
        {wrongLetters.map((letter, i) => (
          <span key={i}>{letter}, </span>
        ))}
      </div>
    </div>
  )
}

export default Game
