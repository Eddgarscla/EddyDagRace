console.log("Episodios.js cargado ✅");

// Suponiendo que tienes 12 episodios en total
const episodios = [
  { titulo: "Episodio 1", descripcion: "Inicio del Bracket A" },
  { titulo: "Episodio 2", descripcion: "Segundo episodio del Bracket A" },
  { titulo: "Episodio 3", descripcion: "Final del Bracket A" },
  { titulo: "Episodio 4", descripcion: "Inicio del Bracket B" },
  // ...hasta el episodio 12
];

let episodioActual = 0;

const container = document.getElementById("episodio-container");
const btnAnterior = document.getElementById("btnAnterior");
const btnSiguiente = document.getElementById("btnSiguiente");

function mostrarEpisodio(idx) {
  const ep = episodios[idx];
  container.innerHTML = `
    <h2>${ep.titulo}</h2>
    <p>${ep.descripcion}</p>
  `;

  btnAnterior.disabled = idx === 0;
  btnSiguiente.disabled = idx === episodios.length - 1;
}

btnAnterior.addEventListener("click", () => {
  if (episodioActual > 0) {
    episodioActual--;
    mostrarEpisodio(episodioActual);
  }
});

btnSiguiente.addEventListener("click", () => {
  if (episodioActual < episodios.length - 1) {
    episodioActual++;
    mostrarEpisodio(episodioActual);
  }
});

// Mostrar el primer episodio al cargar
mostrarEpisodio(episodioActual);
