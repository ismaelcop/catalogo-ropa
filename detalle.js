const BACKEND_URL = "https://mi-backend--ismael201650.repl.co";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch(`${BACKEND_URL}/productos/${id}`)
  .then(res => res.json())
  .then(producto => {
    const detalle = document.getElementById("detalle");

    if (producto) {
      // Mostrar múltiples imágenes (como MercadoLibre)
      const galeria = producto.imagenes.map(
        url => `<img src="${url}" alt="${producto.nombre}" style="max-width: 100px; margin: 5px;">`
      ).join("");

      detalle.innerHTML = `
        <div class="producto-detalle">
          <div style="max-width: 350px;">
            <img src="${producto.imagenes[0]}" alt="${producto.nombre}" style="width: 100%; border-radius: 10px;" />
            <div style="margin-top: 1rem;">${galeria}</div>
          </div>
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
  })
  .catch(error => {
    document.getElementById("detalle").innerHTML = "<p>Error al cargar el producto.</p>";
    console.error("Error:", error);
  });
