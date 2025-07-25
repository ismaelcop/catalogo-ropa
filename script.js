fetch("productos.json")
  .then(res => res.json())
  .then(productos => {
    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";

    productos.forEach((p, index) => {
      const div = document.createElement("div");
      div.className = "producto";
      div.innerHTML = `
        <a href="detalle.html?id=${index}">
          <img src="${p.imagen}" alt="${p.nombre}">
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

    // Guardamos los productos en localStorage para usarlos en detalle.html
    localStorage.setItem("productos", JSON.stringify(productos));
  })
  .catch(error => console.error("Error cargando productos:", error));

