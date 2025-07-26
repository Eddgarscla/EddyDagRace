console.log("Script.js v2 cargado ✅");
//alert("Script.js v2 ejecutado en brackets ✅");

window.addEventListener("DOMContentLoaded", () => {
  // Recupera las reinas seleccionadas del localStorage
  const selectedQueens = JSON.parse(localStorage.getItem('selectedQueens') || '[]');

  // Referencias a elementos del DOM
  const queenPool = document.getElementById('queenPool');
  const listA = document.getElementById('listA');
  const listB = document.getElementById('listB');
  const listC = document.getElementById('listC');

  const brackets = {
    A: [],
    B: [],
    C: []
  };

  function renderQueenPool() {
  queenPool.innerHTML = '';
  selectedQueens.forEach((queen, idx) => {
    const div = document.createElement('div');
    div.className = 'queen-card';
    div.innerHTML = `
      <img src="${queen.image}" alt="${queen.name}" />
      <span>${queen.name}</span>
      <div class="bracket-buttons">
        <button class="btn-ruby" onclick="addToBracket(${idx}, 'A')">A</button>
        <button class="btn-emerald" onclick="addToBracket(${idx}, 'B')">B</button>
        <button class="btn-sapphire" onclick="addToBracket(${idx}, 'C')">C</button>
      </div>
    `;
    queenPool.appendChild(div);
  });
}

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

  function addToBracket(queenIndex) {
  const queen = selectedQueens[queenIndex];

  // Evita duplicados
  if (brackets.A.find(q => q.name === queen.name) ||
      brackets.B.find(q => q.name === queen.name) ||
      brackets.C.find(q => q.name === queen.name)) {
    alert(`${queen.name} ya está asignada a un bracket.`);
    return;
  }

  // Crea los botones de selección
  const modal = document.createElement('div');
  modal.className = 'bracket-choice-modal';
  modal.innerHTML = `
    <div class="bracket-choice-inner">
      <h3>¿A qué bracket quieres agregar a <strong>${queen.name}</strong>?</h3>
      <div class="choice-buttons">
        <button class="bracket-btn ruby" data-bracket="A">Bracket A 💎</button>
        <button class="bracket-btn emerald" data-bracket="B">Bracket B 💚</button>
        <button class="bracket-btn sapphire" data-bracket="C">Bracket C 💙</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Añadir eventos a los botones
  modal.querySelectorAll('.bracket-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const chosen = btn.dataset.bracket;
      if (brackets[chosen].length >= 6) {
        alert(`El Bracket ${chosen} ya está lleno.`);
      } else {
        brackets[chosen].push(queen);
        renderBrackets();
      }
      modal.remove(); // Cierra el modal
    });
  });
}
window.addToBracket = addToBracket;
  
  function removeFromBracket(listId, queenIndex) {
    if (listId === 'listA') brackets.A.splice(queenIndex, 1);
    else if (listId === 'listB') brackets.B.splice(queenIndex, 1);
    else if (listId === 'listC') brackets.C.splice(queenIndex, 1);

    renderBrackets();
  }
  window.removeFromBracket = removeFromBracket;

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

  document.getElementById('manualAssign').addEventListener('click', () => {
    renderQueenPool();
  });

  document.getElementById('startEpisodes').addEventListener('click', () => {
    localStorage.setItem('bracketA', JSON.stringify(brackets.A));
    localStorage.setItem('bracketB', JSON.stringify(brackets.B));
    localStorage.setItem('bracketC', JSON.stringify(brackets.C));

    alert('¡Brackets guardados! Próximo: episodios.');
    // window.location.href = 'episodes.html';
  });

  // Mostrar automáticamente la pool si hay reinas cargadas
  if (selectedQueens.length > 0) {
    renderQueenPool();
  }
});
