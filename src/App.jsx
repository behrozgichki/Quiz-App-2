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
        console.log(res);
        setData(res);
      })
      .catch((err) => {
        console.log(err);
        setError(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])
  useEffect(()=>{
    if(data && data.length > 0){
      const shuffled = arrayShuffle( [...data[index].incorrectAnswers, data[index].correctAnswer])
    setOptions(shuffled)
    setSelectedOptions('')
    }

  } ,[data , index])

  const changeQuestion = () => {
    if (selectOptions === data[index].correctAnswer) {
      setScore(prev => prev + 10)
    }
    if (index < data.length -1 ) {
      setIndex(prev => prev + 1)
      
    }
    
  }

  console.log(selectOptions);
  return (
    <div className="quiz-container">

      <h1>Quiz App</h1>

      {loading && <div className="loading">loading...</div>}
      {error && <div className="error">Error Occured!</div>}
      {score}

      {data.length > 0 && (
        <h2 className="question">
          Q{index + 1}: {data[index].question.text}
        </h2>
      )}

      {data.length > 0 && options.map((item, i) => (
            <label className="option" key={i}>
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

      <button onClick={changeQuestion}>Next</button>

    </div>
  )
}

export default App