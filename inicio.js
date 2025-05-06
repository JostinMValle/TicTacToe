function iniciarJuego(modo) {
  if (modo === "ia") {
    window.location.href = "dificultad.html";
  } else {
    sessionStorage.setItem("modoDeJuego", modo);
    window.location.href = "Game/juego.html";
  }
}
