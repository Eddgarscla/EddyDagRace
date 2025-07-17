console.log("Script.js v2 cargado ✅");
const selected = localStorage.getItem("selectedQueens");
console.log("Reinas recibidas desde localStorage:", selected);

let queens = [];
try {
  queens = JSON.parse(selected);
} catch (e) {
  console.error("Error al convertir las reinas desde localStorage:", e);
}
const testDiv = document.createElement("div");
testDiv.style.position = "fixed";
testDiv.style.bottom = "20px";
testDiv.style.left = "20px";
testDiv.style.background = "black";
testDiv.style.color = "lime";
testDiv.style.padding = "10px";
testDiv.style.zIndex = "9999";
testDiv.innerText = "Reinas recibidas: " + (queens?.map(q => q.name).join(", ") || "ninguna");
document.body.appendChild(testDiv);
function startSimulation() {
  const selectedQueens = getSelectedQueens(); // esta función depende de cómo guardes las seleccionadas
  localStorage.setItem("selectedQueens", JSON.stringify(selectedQueens));
  window.location.href = "brackets.html";
}
window.addEventListener("DOMContentLoaded", () => {
  
// --- script.js completo para brackets.html ---

// Recupera las reinas seleccionadas del localStorage
const selectedQueens = JSON.parse(localStorage.getItem('selectedQueens')) || [];

// Referencias a elementos del DOM (asegúrate que existan en brackets.html)
const queenPool = document.getElementById('queenPool');
const listA = document.getElementById('listA');
const listB = document.getElementById('listB');
const listC = document.getElementById('listC');

const brackets = {
  A: [],
  B: [],
  C: []
};

// Renderiza la pool de reinas disponibles para asignar
function renderQueenPool() {
  queenPool.innerHTML = '';
  selectedQueens.forEach((queen, idx) => {
    const div = document.createElement('div');
    div.className = 'queen-card';
    div.innerHTML = `
      <img src="${queen.image}" alt="${queen.name}" />
      <span>${queen.name}</span>
      <button onclick="addToBracket(${idx})">Agregar</button>
    `;
    queenPool.appendChild(div);
  });
}

// Añade una reina a un bracket disponible
function addToBracket(queenIndex) {
  const queen = selectedQueens[queenIndex];

  // Evitar duplicados en brackets
  if (brackets.A.find(q => q.name === queen.name) ||
      brackets.B.find(q => q.name === queen.name) ||
      brackets.C.find(q => q.name === queen.name)) {
    alert('${queen.name} ya está asignada a un bracket.');
    return;
  }

  if (brackets.A.length < 6) brackets.A.push(queen);
  else if (brackets.B.length < 6) brackets.B.push(queen);
  else if (brackets.C.length < 6) brackets.C.push(queen);
  else {
    alert('Todos los brackets están completos.');
    return;
  }

  renderBrackets();
}

// Renderiza las reinas asignadas en cada bracket
function renderBrackets() {
  function renderList(listElement, queensArray) {
    listElement.innerHTML = '';
    queensArray.forEach((queen, idx) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <img src="${queen.image}" alt="${queen.name}" width="40" height="40" />
        ${queen.name}
        <button onclick="removeFromBracket('${listElement.id}', ${idx})">X</button>
      `;
      listElement.appendChild(li);
    });
  }

  renderList(listA, brackets.A);
  renderList(listB, brackets.B);
  renderList(listC, brackets.C);
}

// Elimina una reina de un bracket
function removeFromBracket(listId, queenIndex) {
  if (listId === 'listA') brackets.A.splice(queenIndex, 1);
  else if (listId === 'listB') brackets.B.splice(queenIndex, 1);
  else if (listId === 'listC') brackets.C.splice(queenIndex, 1);

  renderBrackets();
}

// Asignación aleatoria de reinas a los brackets
document.getElementById('randomAssign').addEventListener('click', () => {
  brackets.A = [];
  brackets.B = [];
  brackets.C = [];

  let shuffled = [...selectedQueens].sort(() => 0.5 - Math.random());

  brackets.A = shuffled.slice(0, 6);
  brackets.B = shuffled.slice(6, 12);
  brackets.C = shuffled.slice(12, 18);

  renderBrackets();
});

// Asignación manual: muestra la pool para seleccionar
document.getElementById('manualAssign').addEventListener('click', () => {
  renderQueenPool();
});

// Botón para iniciar episodios (próximo paso)
document.getElementById('startEpisodes').addEventListener('click', () => {
  localStorage.setItem('bracketA', JSON.stringify(brackets.A));
  localStorage.setItem('bracketB', JSON.stringify(brackets.B));
  localStorage.setItem('bracketC', JSON.stringify(brackets.C));

  // Cambia esta línea cuando tengas la página de episodios
  alert('¡Brackets guardados! Próximo: episodios.');
  // window.location.href = 'episodes.html';
});

// Al cargar la página, muestra la pool para asignar
renderQueenPool();

        
