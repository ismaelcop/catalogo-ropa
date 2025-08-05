let productos = [];
let carrito = [];
let productoActual = null;

const catalogo = document.getElementById("catalogo");
const modal = document.getElementById("modal-detalle");
const modalNombre = document.getElementById("modal-nombre");
const modalDescripcion = document.getElementById("modal-descripcion");
const modalPrecio = document.getElementById("modal-precio");
const modalTalle = document.getElementById("modal-talle");
const imgPrincipal = document.getElementById("img-principal");
const miniaturas = document.getElementById("miniaturas");
const agregarCarritoBtn = document.getElementById("agregar-carrito");

const modalCarrito = document.getElementById("modal-carrito");
const carritoItems = document.getElementById("carrito-items");
const totalCarrito = document.getElementById("total-carrito");

// URL CORRECTA del backend de Replit
const backendBase = 'https://0549afa3-f5f3-433d-a9ee-469bca56b06c-00-3eup8qamcaglh.picard.replit.dev';
const backendURL = `${backendBase}/productos`;

// 📦 Cargar productos
fetch(backendURL)
  .then(res => res.json())
  .then(data => {
    productos = data;
    mostrarCatalogo();
  })
  .catch(error => {
    console.error("Error al cargar productos:", error);
    alert("No se pudieron cargar los productos.");
  });

function mostrarCatalogo(productos) {
  const catalogo = document.getElementById("catalogo");
  catalogo.innerHTML = "";

  productos.forEach(producto => {
    // Verifica si imagenes es un array y tiene al menos una imagen
    const imagenPrincipal = Array.isArray(producto.imagenes) && producto.imagenes.length > 0
      ? producto.imagenes[0]
      : "https://via.placeholder.com/150"; // imagen por defecto

    const card = document.createElement("div");
    card.className = "producto";
    card.innerHTML = `
      <img src="${imagenPrincipal}" alt="${producto.nombre}" />
      <h3>${producto.nombre} - $${producto.precio}</h3>
      <p>${producto.descripcion}</p>
      <p>Talle: ${producto.talle} - Activo</p>
      <button onclick="editarProducto(${producto.id})">✏️ Editar</button>
      <button onclick="eliminarProducto(${producto.id})">🗑️ Eliminar</button>
    `;
    catalogo.appendChild(card);
  });
}


function mostrarDetalle(prod) {
  productoActual = prod;
  modal.classList.remove("hidden");
  modalNombre.textContent = prod.nombre;
  modalDescripcion.textContent = prod.descripcion;
  modalPrecio.textContent = prod.precio;
  modalTalle.textContent = prod.talle;
  imgPrincipal.src = prod.imagenes[0].startsWith('/uploads') ? backendBase + prod.imagenes[0] : prod.imagenes[0];
  miniaturas.innerHTML = "";
  prod.imagenes.forEach((img, i) => {
    const mini = document.createElement("img");
    mini.src = img.startsWith('/uploads') ? backendBase + img : img;
    mini.classList.toggle("selected", i === 0);
    mini.onclick = () => {
      imgPrincipal.src = mini.src;
      document.querySelectorAll("#miniaturas img").forEach(m => m.classList.remove("selected"));
      mini.classList.add("selected");
    };
    miniaturas.appendChild(mini);
  });
}

document.querySelector(".close").onclick = () => {
  modal.classList.add("hidden");
};

agregarCarritoBtn.onclick = () => {
  carrito.push(productoActual);
  alert("Agregado al carrito");
  modal.classList.add("hidden");
};

document.getElementById("ver-carrito").onclick = () => {
  mostrarCarrito();
  modalCarrito.classList.remove("hidden");
};

document.querySelector(".close-carrito").onclick = () => {
  modalCarrito.classList.add("hidden");
};

function mostrarCarrito() {
  carritoItems.innerHTML = "";
  let total = 0;
  carrito.forEach(item => {
    const div = document.createElement("div");
    div.textContent = `${item.nombre} - $${item.precio}`;
    carritoItems.appendChild(div);
    total += item.precio;
  });
  totalCarrito.textContent = total;
}

document.getElementById("formulario-pedido").onsubmit = (e) => {
  e.preventDefault();
  
  const fechaInput = e.target.fecha.value;
  const fecha = new Date(fechaInput);
  const dia = fecha.getDay(); // 2 = Martes, 4 = Jueves

  if (dia !== 2 && dia !== 4) {
    alert("Solo se puede seleccionar martes o jueves como fecha de entrega.");
    return;
  }

  alert("¡Gracias por tu compra! Te contactaremos pronto.");
  carrito = [];
  modalCarrito.classList.add("hidden");
};


