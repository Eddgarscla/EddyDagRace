function startSimulation() {
  const selectedQueens = getSelectedQueens(); // esta función depende de cómo guardes las seleccionadas
  localStorage.setItem("selectedQueens", JSON.stringify(selectedQueens));
  window.location.href = "brackets.html";
}
