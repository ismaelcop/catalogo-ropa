// URL del backend de Replit
const BACKEND_URL = "https://mi-backend--ismael201650.repl.co";

fetch(`${BACKEND_URL}/productos`)
  .then(res => res.json())
  .then(productos => {
    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";

    productos.forEach((p) => {
      const div = document.createElement("div");
      div.className = "producto";
      div.innerHTML = `
        <a href="detalle.html?id=${p.id}">
          <img src="${p.imagenes[0]}" alt="${p.nombre}">
          <h3>${p.nombre}</h3>
        </a>
        <p><strong>Precio:</strong> $${p.precio}</p>
        <p><strong>Talle:</strong> ${p.talle}</p>
        <a href="${p.mp_url}" target="_blank">
          <button>Comprar</button>
        </a>
      `;
      contenedor.appendChild(div);
    });
  })
  .catch(error => console.error("Error cargando productos:", error));
