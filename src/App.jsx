import React, { useEffect, useState } from 'react'
import './App.css'
import { arrayShuffle } from 'array-shuffle'

const App = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [data, setData] = useState([])
  const [index, setIndex] = useState(0)
  const [options, setOptions] = useState([])
  const [selectOptions, setSelectedOptions] = useState('')
  const [result, setResult] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    fetch('https://the-trivia-api.com/v2/questions')
      .then((res) => res.json())
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.error(err);
        setError(true)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (data && data.length > 0) {
      const shuffled = arrayShuffle([...data[index].incorrectAnswers, data[index].correctAnswer])
      setOptions(shuffled)
      setSelectedOptions('')
    }
  }, [data, index])

  const changeQuestion = () => {
    if (selectOptions === data[index].correctAnswer) {
      setScore(prev => prev + 10)
    }
    if (index < data.length - 1) {
      setIndex(prev => prev + 1)
    }
    if (index === data.length - 1) {
      setResult(true)
    }
  }

  const restartQuiz = () => {
    setIndex(0)
    setScore(0)
    setResult(false)
    setSelectedOptions('')
  }

  return (
    <div className="quiz-container">
      <h1>Quiz App</h1>

      {/* Progress & Stats Headers */}
      {!result && data.length > 0 && !loading && !error && (
        <>
          <div className="progress-wrapper">
            <div
              className="progress-fill"
              style={{
                width: `${((index + 1) / data.length) * 100}%`
              }}
            ></div>
          </div>

          <div className="quiz-stats">
            <span>Question {index + 1} of {data.length}</span>
            <span>Score: {score}</span>
          </div>
        </>
      )}

      {/* Core Application Views */}
      {loading && <div className="loading">Loading questions...</div>}
      {error && <div className="error">Failed to load quiz. Please try again.</div>}
      
      {result && (
        <div className="result-card">
          <h1>{score}</h1>
          <h2>
            {score >= 80
              ? "🏆 Quiz Master"
              : score >= 50
              ? "🔥 Great Job"
              : "📚 Keep Learning"}
          </h2>
          <button onClick={restartQuiz}>Restart Quiz</button>
        </div>
      )}

      {!loading && !error && !result && data.length > 0 && (
        <>
          <div className="quiz-content">
            <h2 className="question">
              {data[index].question.text}
            </h2>

            {options.map((item, i) => (
              <label 
                className={`option ${selectOptions === item ? 'selected' : ''}`} 
                key={i}
              >
                <input
                  type="radio"
                  name="option"
                  value={item}
                  checked={selectOptions === item}
                  onChange={(e) => setSelectedOptions(e.target.value)}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>

          <button onClick={changeQuestion} disabled={!selectOptions}>
            {index === data.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        </>
      )}
    </div>
  )
}

export default App