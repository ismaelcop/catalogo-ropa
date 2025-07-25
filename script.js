fetch("productos.json")
  .then(res => res.json())
  .then(productos => {
    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";

    productos.forEach(p => {
      const div = document.createElement("div");
      div.className = "producto";
      div.innerHTML = `
        <img src="${p.imagen}" alt="${p.nombre}">
        <h3>${p.nombre}</h3>
        <p>$${p.precio}</p>
        <a href="${p.mp_url}" target="_blank">
          <button>Comprar</button>
        </a>
      `;
      contenedor.appendChild(div);
    });
  })
  .catch(error => console.error("Error cargando productos:", error));
