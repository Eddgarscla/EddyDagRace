console.log("Episodios.js cargado ✅");

const retos = [
  "Diseña un outfit de gala con materiales reciclados",
  "Lip sync con temática de los 80s",
  "Desafío de actuación dramática",
  "Desfile con atuendos inspirados en la playa",
  "Creación de un personaje de fantasía",
  "Desafío de comedia stand-up",
];

let pasoActual = 0;
let episodioActual = 1; 
let bracketActual = "A"; 
let reinas = [];
let puntajes = {};
let puntosRepartidos = {}; // para guardar a quién dieron puntos las bottom queens

const titulo = document.getElementById("titulo-episodio");
const retoDiv = document.getElementById("reto");
const reinasList = document.getElementById("reinas-list");
const infoEpisodio = document.getElementById("info-episodio");
const tablaPuntajes = document.getElementById("tabla-puntajes");
const btnSiguiente = document.getElementById("btn-siguiente");
const btnAnterior = document.getElementById("btn-anterior");
const btnSiguienteEpisodio = document.getElementById("btn-siguiente-episodio");

// Carga reinas del bracket A desde localStorage
function cargarReinas() {
  const almacenadas = localStorage.getItem("bracketA");
  if (!almacenadas) {
    alert("No se encontraron reinas en el Bracket A. Selecciona y asigna primero.");
    return [];
  }
  return JSON.parse(almacenadas);
}

function mostrarReinas() {
  reinasList.innerHTML = "";
  reinasList.className = "reinas-grid"; // Asegura el grid

  reinas.forEach((queen) => {
    const div = document.createElement("div");
    div.className = "queen-card episodio"; // Estilo adicional para esta sección
    div.innerHTML = `
      <img src="${queen.image}" alt="${queen.name}" class="queen-img" />
      <div class="queen-name">${queen.name}</div>
    `;
    reinasList.appendChild(div);
  });
}

function mostrarReto() {
  const reto = retos[Math.floor(Math.random() * retos.length)];
  retoDiv.textContent = "Reto: " + reto;
  infoEpisodio.textContent = "Prepárate para el desafío y observa cómo cada reina se desempeña.";
  tablaPuntajes.innerHTML = "";
  mostrarReinas();
  btnAnterior.disabled = true;
  btnSiguiente.textContent = "Ver desempeño";
  btnSiguienteEpisodio.style.display = "none";
  puntajes = {};
  puntosRepartidos = {};
}

function mostrarDesempeno() {
  retoDiv.textContent = "";
  infoEpisodio.textContent = "Resultados del desempeño:";
  tablaPuntajes.innerHTML = "";
  const niveles = ["Malo", "Regular", "Excelente"];
  reinasList.innerHTML = "";
  reinas.forEach((queen) => {
    const nivel = niveles[Math.floor(Math.random() * niveles.length)];
    const div = document.createElement("div");
    div.className = "queen-card";
    div.innerHTML = `
      <img src="${queen.image}" alt="${queen.name}" />
      <div>${queen.name}</div>
      <div><strong>Desempeño:</strong> ${nivel}</div>
    `;
    reinasList.appendChild(div);
    puntajes[queen.name] = nivel === "Excelente" ? 2 : nivel === "Regular" ? 1 : 0;
  });
  btnAnterior.disabled = false;
  btnSiguiente.textContent = "Ver Top 2";
}

function mostrarTop2() {
  retoDiv.textContent = "";
  infoEpisodio.textContent = "Top 2 de este episodio:";
  tablaPuntajes.innerHTML = "";

  const top2 = Object.entries(puntajes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);

  reinasList.innerHTML = "";
  top2.forEach(([name, puntos]) => {
    const queen = reinas.find((q) => q.name === name);
    const div = document.createElement("div");
    div.className = "queen-card";
    div.innerHTML = `
      <img src="${queen.image}" alt="${queen.name}" />
      <div>${queen.name}</div>
      <div>Puntos: ${puntos}</div>
    `;
    reinasList.appendChild(div);
  });

  top2.forEach(([name]) => {
    puntajes[name] = (puntajes[name] || 0) + 2;
  });

  btnAnterior.disabled = false;
  btnSiguiente.textContent = "Ver ganadora";
}

function mostrarGanadora() {
  retoDiv.textContent = "";
  infoEpisodio.textContent = "¡La ganadora del episodio es...";
  tablaPuntajes.innerHTML = "";

  const top2 = Object.entries(puntajes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);
  const ganadoraIndex = Math.floor(Math.random() * top2.length);
  const ganadoraName = top2[ganadoraIndex][0];

  reinasList.innerHTML = "";
  const queen = reinas.find((q) => q.name === ganadoraName);
  const div = document.createElement("div");
  div.className = "queen-card";
  div.innerHTML = `
    <img src="${queen.image}" alt="${queen.name}" />
    <div><strong>${queen.name}</strong></div>
    <div>Recibe 1 punto extra por ganar el reto</div>
  `;
  reinasList.appendChild(div);

  puntajes[ganadoraName] += 1;

  btnAnterior.disabled = false;
  btnSiguiente.textContent = "Repartir puntos del Bottom 4";
}

// Nuevo paso para repartir puntos de bottom 4
function mostrarRepartirPuntos() {
  retoDiv.textContent = "";
  infoEpisodio.textContent = "Las reinas del Bottom 4 deben repartir su punto a otra reina.";

  // Bottom 4 = las 4 con menos puntos
  const bottom4 = Object.entries(puntajes)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 4)
    .map(([name]) => name);

  puntosRepartidos = {};

  reinasList.innerHTML = "";

  bottom4.forEach((queenName) => {
    const queen = reinas.find(q => q.name === queenName);

    const div = document.createElement("div");
    div.className = "queen-card";

    // Crear selector con otras reinas excepto ella misma
    let opciones = reinas
      .filter(q => q.name !== queenName)
      .map(q => `<option value="${q.name}">${q.name}</option>`)
      .join("");

    div.innerHTML = `
      <img src="${queen.image}" alt="${queen.name}" />
      <div><strong>${queen.name}</strong> debe repartir 1 punto</div>
      <select id="select-${queenName}">
        <option value="" disabled selected>Selecciona a quién darle el punto</option>
        ${opciones}
      </select>
    `;
    reinasList.appendChild(div);
  });

  btnAnterior.disabled = false;
  btnSiguiente.textContent = "Confirmar reparto";
}

// Confirmar reparto de puntos y actualizar puntajes
function confirmarReparto() {
  const bottom4 = Object.entries(puntajes)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 4)
    .map(([name]) => name);

  let repartoCompleto = true;

  bottom4.forEach((queenName) => {
    const select = document.getElementById(`select-${queenName}`);
    if (!select || !select.value) {
      repartoCompleto = false;
    } else {
      puntosRepartidos[queenName] = select.value;
    }
  });

  if (!repartoCompleto) {
    alert("Por favor, selecciona a quién darle el punto para todas las reinas.");
    return;
  }

  // Sumar 1 punto a las reinas seleccionadas
  Object.values(puntosRepartidos).forEach((receptora) => {
    puntajes[receptora] = (puntajes[receptora] || 0) + 1;
  });

  pasoActual++;
  actualizarPaso();
}

function mostrarScoreboard() {
  retoDiv.textContent = "";
  infoEpisodio.textContent = "Tabla de puntajes actual:";
  reinasList.innerHTML = "";

  tablaPuntajes.innerHTML = "";
  for (const [name, puntos] of Object.entries(puntajes)) {
    const queen = reinas.find((q) => q.name === name);
    const div = document.createElement("div");
    div.className = "queen-score";
    div.innerHTML = `
      <img src="${queen.image}" alt="${queen.name}" />
      <span>${queen.name}</span>
      <span>Puntos: ${puntos}</span>
    `;
    tablaPuntajes.appendChild(div);
  }

  btnAnterior.disabled = false;
  btnSiguiente.style.display = "none";
  btnSiguienteEpisodio.style.display = "inline-block";
  btnSiguienteEpisodio.textContent = "Siguiente Episodio";
}

btnSiguiente.addEventListener("click", () => {
  if (pasoActual === 4) {
    // Confirmar reparto de puntos bottom 4
    confirmarReparto();
  } else {
    pasoActual++;
    if (pasoActual > 5) pasoActual = 5;
    actualizarPaso();
  }
});

btnAnterior.addEventListener("click", () => {
  pasoActual--;
  if (pasoActual < 0) pasoActual = 0;
  actualizarPaso();
});

btnSiguienteEpisodio.addEventListener("click", () => {
  alert("Por ahora solo el episodio 1 está implementado.");
  // Aquí en el futuro saltas al episodio 2
});

function actualizarPaso() {
  switch (pasoActual) {
    case 0:
      mostrarReto();
      break;
    case 1:
      mostrarDesempeno();
      break;
    case 2:
      mostrarTop2();
      break;
    case 3:
      mostrarGanadora();
      break;
    case 4:
      mostrarRepartirPuntos();
      break;
    case 5:
      mostrarScoreboard();
      break;
  }
}

function iniciar() {
  reinas = cargarReinas();
  if (reinas.length === 0) return;

  titulo.textContent = `Episodio ${episodioActual} - Bracket ${bracketActual}`;
  pasoActual = 0;

  // Mostrar solo las reinas visualmente bonitas al inicio
  infoEpisodio.textContent = "Estas son las reinas del Bracket A para este episodio:";
  retoDiv.textContent = "";
  tablaPuntajes.innerHTML = "";
  mostrarReinas();

  btnAnterior.disabled = true;
  btnSiguiente.textContent = "Iniciar reto";
  btnSiguiente.style.display = "inline-block";
  btnSiguienteEpisodio.style.display = "none";
}

iniciar();
