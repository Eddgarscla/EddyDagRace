function startSimulation() {
  const selectedQueens = getSelectedQueens(); // esta función depende de cómo guardes las seleccionadas
  localStorage.setItem("selectedQueens", JSON.stringify(selectedQueens));
  window.location.href = "brackets.html";
}
window.addEventListener("DOMContentLoaded", () => {
  const queenPool = document.getElementById("queenPool");

  // Recuperar las reinas seleccionadas del localStorage
  const storedQueens = localStorage.getItem("selectedQueens");
  if (!storedQueens) {
    queenPool.innerHTML = "<p style='color:white;'>No hay reinas seleccionadas 😢</p>";
    return;
  }

  const queens = JSON.parse(storedQueens);

  // Mostrar cada reina en el pool
  queens.forEach((queen, index) => {
    const queenCard = document.createElement("div");
    queenCard.classList.add("queen-card");
    queenCard.innerHTML = `
      <img src="${queen.image}" alt="${queen.name}" style="width:80px; height:80px; border-radius:50%; border: 3px solid hotpink;" />
      <span style="color:white; font-weight:bold; font-size:1.1rem;">${queen.name}</span>
    `;
    // Más adelante podrás hacer drag & drop o asignación
    queenPool.appendChild(queenCard);
  });
});
