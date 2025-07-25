fetch("productos.json") // reemplazá con tu archivo exportado y subido
  .then(res => res.json())
  .then(productos => {
    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = ""; // Limpia contenido previo

    productos
      .filter(p => p.activo === "Sí" || p.activo === true) // Mostrar solo activos
      .forEach(p => {
        const div = document.createElement("div");
        div.className = "producto";
        div.innerHTML = `
          <img src="${p.foto}" alt="${p.nombre}">
          <h3>${p.nombre}</h3>
          <p>Talle: ${p.talle}</p>
          <p>$${p.precio}</p>
          <a href="${p.mp_url}" target="_blank">
            <button>Comprar</button>
          </a>
        `;
        contenedor.appendChild(div);
      });
  })
  .catch(error => console.error("Error cargando productos:", error));
