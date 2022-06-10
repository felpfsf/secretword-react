// CSS
import './App.css'

// React
import { useCallback, useEffect, useState } from 'react'

// Components
import StartScreen from './components/StartScreen/StartScreen'
import Game from './components/Game/Game'
import GameOver from './components/GameOver/GameOver'

// Data
import { wordsList } from './data/words'

const stages = [
  { id: 1, name: 'start' },
  { id: 2, name: 'game' },
  { id: 3, name: 'end' }
]

const guessesQty = 6

function App() {
  // useState para controlar os estágios do jogo
  const [gameStage, setGameStage] = useState(stages[0].name)

  // useState para recolher as palavras do arquivo
  const [words] = useState(wordsList)

  // useState para letras
  const [pickedWords, setPickedWords] = useState('')
  const [pickedCategory, setPickedCategory] = useState('')
  const [letters, setLetters] = useState([])

  // useState para as letras adivinhadas, erradas e tentativas e pontuação
  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessesQty)
  const [score, setScore] = useState(0)

  // Funções

  const pickWordAndCategory = useCallback(() => {
    // Função que irá escolher uma categoria aleatória dentro do objeto
    // Armazena em categories os id do objeto; através da função random
    // é escolhido um valor aleatório dentro da quantidade existente de categorias(categories.length)
    const categories = Object.keys(words)
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)]

    // console.log(category)

    // Dentro de category está uma série de palavras
    // Assim como foi feito para escolher a categoria, aqui tb faz o mesmo
    // escolhendo de forma aleatória uma palavra dentro da quantidade existente(words[category].length)
    const word =
      words[category][Math.floor(Math.random() * words[category].length)]

    // Controle
    // console.log(word)

    return { word, category }
  }, [words])

  // Inicia o jogo
  const startGame = useCallback(() => {
    // Limpa os estados de letters
    clearLetterStates()
    // Escolhe a palavra e a categoria
    const { word, category } = pickWordAndCategory()

    // Divide a palavra em um array de letras
    let wordLetters = word.split('')

    // Deixa todas as letras minúsculas
    wordLetters = wordLetters.map(l => l.toLowerCase())

    // Controle
    // console.log(word, category)
    // console.log(wordLetters)

    // Preenche os states com a categoria e a palavra escolhida
    // e a palavra dividida em um array de letras
    setPickedWords(word)
    setPickedCategory(category)
    setLetters(wordLetters)

    // Estágio do jogo
    setGameStage(stages[1].name)
  }, [pickWordAndCategory])

  const verifyLetter = letter => {
    // console.log(letter)
    // setGameStage(stages[2].name)
    const normalizedLetter = letter.toLowerCase()
    // Checa se a letra já foi utilizada e retorna assim o usuário não perde a chance
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return
    }

    // Checa se a letra pertence a palavra escolhida
    // e adiciona ao array de palavras corretas ou
    // palavras erradas com o uso do spread operator (...)
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters(actualGuessedLetters => [
        ...actualGuessedLetters,
        normalizedLetter
      ])
    } else {
      setWrongLetters(actualWrongLetters => [
        ...actualWrongLetters,
        normalizedLetter
      ])

      // Aqui uma função que irá diminuir as tentativas a cada palavra errada
      setGuesses(actualGuesses => actualGuesses - 1)
    }
  }

  // Função que limpa o estado das letras
  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  // useEffect que vai monitorar o estado das tentativas
  useEffect(() => {
    if (guesses <= 0) {
      // reset dos states de letters
      clearLetterStates()
      // Envia o usuário para a página de game over!
      setGameStage(stages[2].name)
    }
  }, [guesses])

  // Controle
  // console.log(guessedLetters)
  // console.log(wrongLetters)

  // useEffect para monitorar os pontos
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)]
    if (
      guessedLetters.length === uniqueLetters.length &&
      gameStage === stages[1].name
    ) {
      setScore(actualScore => (actualScore += 100))

      startGame()
    }
    // console.log(uniqueLetters)
  }, [guessedLetters, letters, startGame, gameStage])

  const retry = () => {
    // Ao reiniciar a partida o placar de pontos é zerado
    // e a quantidade de tentativas retorna ao valor
    setScore(0)
    setGuesses(guessesQty)

    setGameStage(stages[0].name)
  }

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' && (
        <Game
          verifyLetter={verifyLetter}
          pickedWords={pickedWords}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === 'end' && <GameOver retry={retry} score={score} />}
    </div>
  )
}

export default App
