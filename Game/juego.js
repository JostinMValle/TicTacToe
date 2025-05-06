const soundClick = new Audio('../sounds/click.mp3');
const soundWin = new Audio('../sounds/win.mp3');
const soundLose = new Audio('../sounds/lose.mp3');
const board = document.getElementById("board");
const modo = sessionStorage.getItem("modoDeJuego") || "jugador";
const dificultad = sessionStorage.getItem("dificultadIA") || "facil";

let currentPlayer = "X";
let gameState = Array(9).fill("");
let gameActive = true;
let scoreX = 0;
let scoreO = 0;

const winConditions = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function createBoard() {
  board.innerHTML = "";
  gameState.forEach((cell, i) => {
    const div = document.createElement("div");
    div.classList.add("cell");
    div.dataset.index = i;
    div.textContent = cell;
    div.addEventListener("click", handleClick);
    board.appendChild(div);
  });

  if (modo === "ia") {
    document.getElementById("marcadorO").textContent = `IA: ${scoreO}`;
  }
  
}


function handleClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || gameState[index]) return;

  gameState[index] = currentPlayer;
  e.target.textContent = currentPlayer;
e.target.classList.add(currentPlayer === "X" ? "color-x" : "color-o");

  soundClick.play();

  e.target.classList.add("marked");

  if (checkWin(currentPlayer)) {
    gameActive = false;
    resaltarGanador(currentPlayer);
   
updateScore(currentPlayer);
    return;
  }

  if (!gameState.includes("")) {
    gameActive = false;
    board.classList.add("empate");
    setTimeout(() => {
      
    board.classList.add("empate");
    
      board.classList.remove("empate");
      resetGame();
    }, 1000);
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";

  if (modo === "ia" && currentPlayer === "O") {
    setTimeout(() => {
      if (dificultad === "facil") {
        iaMoveFacil();
      } else {
        const mejorMovimiento = obtenerMovimientoMinimax();
        document.querySelector(`[data-index="${mejorMovimiento}"]`).click();
      }
    }, 300);
  }
}

function iaMoveFacil() {
  const vacias = gameState
    .map((val, i) => (val === "" ? i : null))
    .filter(i => i !== null);
  const randomIndex = vacias[Math.floor(Math.random() * vacias.length)];
  document.querySelector(`[data-index="${randomIndex}"]`).click();
}

function obtenerMovimientoMinimax() {
  let mejorScore = -Infinity;
  let movimiento = -1;

  for (let i = 0; i < gameState.length; i++) {
    if (gameState[i] === "") {
      gameState[i] = "O";
      let score = minimax(gameState, 0, false);
      gameState[i] = "";
      if (score > mejorScore) {
        mejorScore = score;
        movimiento = i;
      }
    }
  }
  return movimiento;
}

function minimax(tablero, profundidad, esMaximizador) {
  if (checkGanadorMinimax("O", tablero)) return 10 - profundidad;
  if (checkGanadorMinimax("X", tablero)) return profundidad - 10;
  if (!tablero.includes("")) return 0;

  if (esMaximizador) {
    let maxEval = -Infinity;
    for (let i = 0; i < tablero.length; i++) {
      if (tablero[i] === "") {
        tablero[i] = "O";
        const eval = minimax(tablero, profundidad + 1, false);
        tablero[i] = "";
        maxEval = Math.max(maxEval, eval);
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let i = 0; i < tablero.length; i++) {
      if (tablero[i] === "") {
        tablero[i] = "X";
        const eval = minimax(tablero, profundidad + 1, true);
        tablero[i] = "";
        minEval = Math.min(minEval, eval);
      }
    }
    return minEval;
  }
}

function checkGanadorMinimax(player, tablero) {
  return winConditions.some(combo => combo.every(i => tablero[i] === player));
}

function checkWin(player) {
  return winConditions.some(combo => combo.every(i => gameState[i] === player));
}

function resaltarGanador(player) {
  const comboGanador = winConditions.find(combo =>
    combo.every(i => gameState[i] === player)
  );

  if (comboGanador) {
    if (modo === "ia" && player === "O") {
      board.classList.add("ia-gana");
      soundLose.play(); 
    } else {
      comboGanador.forEach(i => {
        const cell = document.querySelector(`[data-index="${i}"]`);
        cell.classList.add("ganador");
      });
      soundWin.play(); 
    }
  }
}


function updateScore(player) {
  if (player === "X") scoreX++;
  else scoreO++;

  document.getElementById("marcadorX").textContent = `Jugador X: ${scoreX}`;
  document.getElementById("marcadorO").textContent = (modo === "ia" ? `IA: ${scoreO}` : `Jugador O: ${scoreO}`);
}



function resetGame() {
  gameState = Array(9).fill("");
  gameActive = true;
  board.classList.remove("ia-gana");
  currentPlayer = "X";
  createBoard();
}

function volverInicio() {
  sessionStorage.clear();
  window.location.href = "../index.html";
}

createBoard();
