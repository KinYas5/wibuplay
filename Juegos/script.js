function cambiarModo() {
    var cuerpo = document.body;
    cuerpo.classList.toggle("dark-mode");
    
    // Obtener todas las cajas de juego
    var gameBoxes = document.querySelectorAll(".game-box");
    
    // Alternar la clase dark-mode en las cajas de juego
    gameBoxes.forEach(function(box) {
        box.classList.toggle("dark-mode");
    });
}
