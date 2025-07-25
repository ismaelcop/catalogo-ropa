// script.js (actualizado)
fetch("productos.json")
  .then(res => res.json())
  .then(productos => {
    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";

    productos.forEach((p, index) => {
      const div = document.createElement("div");
      div.className = "producto";
      div.innerHTML = `
        <a href="detalle.html?id=${index}" class="link-detalle">
          <img src="${p.imagen}" alt="${p.nombre}">
          <h3>${p.nombre}</h3>
        </a>
        <p>$${p.precio}</p>
        <a href="${p.mp_url}" target="_blank">
          <button>Comprar</button>
        </a>
      `;
      contenedor.appendChild(div);
    });

    // Guardamos productos en localStorage para que estén disponibles en detalle.html
    localStorage.setItem("productos", JSON.stringify(productos));
  })
  .catch(error => console.error("Error cargando productos:", error));
