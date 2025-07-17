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
// Leer las reinas seleccionadas guardadas en localStorage
const selectedQueens = JSON.parse(localStorage.getItem('selectedQueens')) || [];

// Referencias a contenedores en brackets.html
const queenPool = document.getElementById('queenPool');
const listA = document.getElementById('listA');
const listB = document.getElementById('listB');
const listC = document.getElementById('listC');

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

// Arrays para guardar las reinas asignadas a cada bracket
const brackets = {
  A: [],
  B: [],
  C: []
};

// Función para agregar una reina al primer bracket disponible con espacio
function addToBracket(queenIndex) {
  const queen = selectedQueens[queenIndex];

  // Evitar duplicados en brackets
  if (brackets.A.find(q => q.name === queen.name) ||
      brackets.B.find(q => q.name === queen.name) ||
      brackets.C.find(q => q.name === queen.name)) {
    alert(${queen.name} ya está asignada a un bracket.);
    return;
  }

  // Asignar a bracket con menos de 6 reinas
  if (brackets.A.length < 6) brackets.A.push(queen);
  else if (brackets.B.length < 6) brackets.B.push(queen);
  else if (brackets.C.length < 6) brackets.C.push(queen);
  else {
    alert('Todos los brackets están completos.');
    return;
  }
  renderBrackets();
}

// Mostrar las reinas en cada bracket
function renderBrackets() {
  // Función para renderizar una lista de reinas
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

// Función para eliminar reina de un bracket
function removeFromBracket(listId, queenIndex) {
  if (listId === 'listA') brackets.A.splice(queenIndex,1);
  if (listId === 'listB') brackets.B.splice(queenIndex,1);
  if (listId === 'listC') brackets.C.splice(queenIndex,1);
  renderBrackets();
}

// Botón para asignar al azar todas las reinas
document.getElementById('randomAssign').addEventListener('click', () => {
  // Limpiar brackets
  brackets.A = [];
  brackets.B = [];
  brackets.C = [];

  // Shuffle (mezclar) reinas seleccionadas
  let shuffled = [...selectedQueens].sort(() => 0.5 - Math.random());

  // Repartir en brackets de 6
  brackets.A = shuffled.slice(0,6);
  brackets.B = shuffled.slice(6,12);
  brackets.C = shuffled.slice(12,18);

  renderBrackets();
});

// Botón para asignar manualmente (simplemente muestra la pool para elegir)
document.getElementById('manualAssign').addEventListener('click', () => {
  renderQueenPool();
});

// Al cargar la página mostramos la pool para asignar
renderQueenPool();

// Aquí puedes añadir la lógica para el botón "Start the Competition!" cuando tengas los brackets listos
document.getElementById('startEpisodes').addEventListener('click', () => {
  // Guardar brackets en localStorage para la próxima página (episodios)
  localStorage.setItem('bracketA', JSON.stringify(brackets.A));
  localStorage.setItem('bracketB', JSON.stringify(brackets.B));
  localStorage.setItem('bracketC', JSON.stringify(brackets.C));

  // Ir a la siguiente etapa (episodios)
  alert('¡Brackets guardados! Ahora vamos a los episodios (pendiente de crear).');
  // window.location.href = 'episodes.html'; // Más adelante
});
