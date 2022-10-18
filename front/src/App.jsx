import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

const delay = 5;

function App() {
  const [count, setCount] = useState(0);

  useEffect(
    () => {
      // while (true){
      //   let timer1 = setTimeout(() => componentDidMount(), 1000);
      // }

      // return () => {
      //   clearTimeout(timer1);
      // };
    },
    []
  );

  setInterval(async () => {
    const res = await fetch("http://localhost:8080/devices")
    .then(res => res.json())
    .then(
      (result) => {
        console.log(result)

        if (result == null) {
          setCount((count) => 0)
        }
        else {
          setCount((count) => result.length)
        }
      },
      (error) => {
        console.log(error)
      }
    );
  }, 2000);

  function componentDidMount() {
    fetch("http://localhost:8080/devices")
    .then(res => res.json())
    .then(
      (result) => {
        if (result == null) {
          setCount((count) => 0)
        }
        else {
          setCount((count) => result.length)
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        {/* <button onClick={() => setCount((count) => count + 1)}> */}
        <button onClick={() => Counter()}>
          Device(s) connected {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
