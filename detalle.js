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
        <div class="buttons">
          <button class="btn-comprar">Comprar ahora</button>
          <button class="btn-volver">Volver</button>
        </div>
      </div>
    </div>
  `;

  // Funciones de los botones
  document.querySelector(".btn-comprar").addEventListener("click", () => {
    window.open(producto.mp_url, "_blank");
  });

  document.querySelector(".btn-volver").addEventListener("click", () => {
    window.location.href = "index.html";
  });

} else {
  detalle.innerHTML = "<p>Producto no encontrado.</p>";
}
