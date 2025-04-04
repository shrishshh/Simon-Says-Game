import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [gameSeq, setGameSeq] = useState([]);
  const [userSeq, setUserSeq] = useState([]);
  const [started, setStarted] = useState(false);
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0); 
  const [isGameOver, setIsGameOver] = useState(false);
  const [bgColor, setBgColor] = useState("white");
  
  const btns = ["yellow", "red", "purple", "green"];
  

  const keyPressListener = useRef(null);
  
  useEffect(() => {
    keyPressListener.current = (event) => {
      if (!started || isGameOver) {
        setStarted(true);
        setIsGameOver(false);
        setBgColor("white");
        setLevel(0); 
        levelUp();
      }
    };
    
    document.addEventListener("keypress", keyPressListener.current);
    
    return () => {
      document.removeEventListener("keypress", keyPressListener.current);
    };
  }, [started, isGameOver]);
  

  useEffect(() => {
    if (userSeq.length > 0 && started && !isGameOver) {
      checkAns(userSeq.length - 1);
    }
  }, [userSeq]);
  
  useEffect(() => {
    document.body.style.backgroundColor = bgColor;
  }, [bgColor]);
  

  useEffect(() => {
    if (level > 0) {
      setScore(level);
    }
  }, [level]);
  
  const gameFlash = (color) => {
    const btn = document.querySelector(`.${color}`);
    if (btn) {
      btn.classList.add("flash");
      setTimeout(() => {
        btn.classList.remove("flash");
      }, 250);
    }
  };
  
  const userFlash = (btn) => {
    btn.classList.add("userflash");
    setTimeout(() => {
      btn.classList.remove("userflash");
    }, 250);
  };
  
  const levelUp = () => {
    setUserSeq([]);
    setLevel(prevLevel => prevLevel + 1);
    
    const randIdx = Math.floor(Math.random() * 4);
    const randColor = btns[randIdx];
    
    setGameSeq(prevSeq => {
      const newSeq = [...prevSeq, randColor];
      
      setTimeout(() => {
        gameFlash(randColor);
      }, 500);
      
      return newSeq;
    });
  };
  
  const checkAns = (idx) => {
    if (userSeq[idx] === gameSeq[idx]) {
      if (userSeq.length === gameSeq.length) {
        setTimeout(levelUp, 1000);
      }
    } else {

      setIsGameOver(true);
      

      setBgColor("red");
      setTimeout(() => {
        setBgColor("white");
      }, 150);
      
      reset();
    }
  };
  
  const btnPress = (e) => {
    if (!started || isGameOver) return;
    
    const btn = e.currentTarget;
    userFlash(btn);
    
    const userColor = btn.id;
    setUserSeq(prevSeq => [...prevSeq, userColor]);
  };
  
  const reset = () => {
    setGameSeq([]);
    setUserSeq([]);
  };

  const getStatusMessage = () => {
    if (isGameOver) {
      return (
        <span>Game Over! Your score was <b>{score}</b> <br/>Press any key to start again.</span>
      );
    } else if (!started) {
      return "Press any key to start the Game";
    } else {
      return `Level ${level}`;
    }
  };

  return (
    <div className="App">
      <div className="game-wrapper">
        <h1>Simon Says Game</h1>
        <h2 className="status-text">
          {getStatusMessage()}
        </h2>
        <div className="btn-container">
          <div className="line-one">
            <div className="btn red" id="red" onClick={btnPress}></div>
            <div className="btn yellow" id="yellow" onClick={btnPress}></div>
          </div>
          <div className="line-two">
            <div className="btn green" id="green" onClick={btnPress}></div>
            <div className="btn purple" id="purple" onClick={btnPress}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
