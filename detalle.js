const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const productos = JSON.parse(localStorage.getItem("productos"));
const producto = productos[id];

const detalle = document.getElementById("detalle");

if (producto) {
  detalle.innerHTML = `
    <div class="producto-detalle">
      <img src="${producto.imagen}" alt="${producto.nombre}" />
      <div class="info">
        <h2>${producto.nombre}</h2>
        <p><strong>Precio:</strong> $${producto.precio}</p>
        <p><strong>Talle:</strong> ${producto.talle}</p>
        <a href="${producto.mp_url}" target="_blank">
          <button>Comprar ahora</button>
        </a>
        <a href="index.html">
          <button style="background-color: grey; margin-left: 10px;">Volver</button>
        </a>
      </div>
    </div>
  `;
} else {
  detalle.innerHTML = "<p>Producto no encontrado.</p>";
}
