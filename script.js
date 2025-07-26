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
        <button class="btn-ruby" data-idx="${idx}" data-bracket="A">A</button>
        <button class="btn-emerald" data-idx="${idx}" data-bracket="B">B</button>
        <button class="btn-sapphire" data-idx="${idx}" data-bracket="C">C</button>
      </div>
    `;
    queenPool.appendChild(div);
  });

  // Asignar eventos a todos los botones recién creados
  document.querySelectorAll('.bracket-buttons button').forEach(button => {
    button.addEventListener('click', e => {
      const idx = parseInt(e.target.getAttribute('data-idx'));
      const bracket = e.target.getAttribute('data-bracket');
      const queen = selectedQueens[idx];
      addToBracket(queen, bracket);
    });
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

  function addToBracket(queen, bracket) {
  const list = brackets[bracket];
  if (list.find(q => q.name === queen.name)) {
    alert(`${queen.name} ya está en el Bracket ${bracket}`);
    return;
  }
  list.push(queen);
  renderBrackets();
}
  
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
     window.location.href = 'episodes.html';
  });

  // Mostrar automáticamente la pool si hay reinas cargadas
  if (selectedQueens.length > 0) {
    renderQueenPool();
  }
});
