// URL base de tu backend en Replit
const backendBase = 'https://0549afa3-f5f3-433d-a9ee-469bca56b06c-00-3eup8qamcaglh.picard.replit.dev';
const backendURL  = `${backendBase}/productos`;

// Estado global
let productos = [];
let carrito = [];
let productoActual = null;

// Elementos del DOM
const catalogo      = document.getElementById("catalogo");
const modalDetalle  = document.getElementById("modal-detalle");
const modalNombre   = document.getElementById("modal-nombre");
const modalDesc     = document.getElementById("modal-descripcion");
const modalPrecio   = document.getElementById("modal-precio");
const modalTalle    = document.getElementById("modal-talle");
const imgPrincipal  = document.getElementById("img-principal");
const miniaturas    = document.getElementById("miniaturas");
const btnAgregar    = document.getElementById("agregar-carrito");
const modalCarrito  = document.getElementById("modal-carrito");
const carritoItems  = document.getElementById("carrito-items");
const totalCarrito  = document.getElementById("total-carrito");

// 1) Carga inicial de productos
fetch(backendURL)
  .then(res => res.json())
  .then(data => {
    productos = data;
    mostrarCatalogo(productos);
  })
  .catch(err => {
    console.error("Error al cargar productos:", err);
    catalogo.innerHTML = "<p>No se pudieron cargar los productos.</p>";
  });

// 2) Función para renderizar el catálogo
function mostrarCatalogo(items) {
  catalogo.innerHTML = "";
  items.forEach(prod => {
    // Validar imágenes
    const imgs = Array.isArray(prod.imagenes) ? prod.imagenes : [];
    const src = imgs.length
      ? (imgs[0].startsWith('/uploads') ? backendBase + imgs[0] : imgs[0])
      : 'https://via.placeholder.com/150';

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${src}" alt="${prod.nombre}" />
      <h3>${prod.nombre}</h3>
      <p>$${prod.precio}</p>
    `;
    card.onclick = () => mostrarDetalle(prod);
    catalogo.appendChild(card);
  });
}

// 3) Mostrar modal de detalle
function mostrarDetalle(prod) {
  productoActual = prod;
  modalDetalle.classList.remove("hidden");
  modalNombre.textContent = prod.nombre;
  modalDesc.textContent  = prod.descripcion;
  modalPrecio.textContent= prod.precio;
  modalTalle.textContent = prod.talle;

  // Imagen principal y miniaturas
  const imgs = Array.isArray(prod.imagenes) ? prod.imagenes : [];
  const mainSrc = imgs.length
    ? (imgs[0].startsWith('/uploads') ? backendBase + imgs[0] : imgs[0])
    : 'https://via.placeholder.com/300';
  imgPrincipal.src = mainSrc;

  miniaturas.innerHTML = "";
  imgs.forEach((img, i) => {
    const url = img.startsWith('/uploads') ? backendBase + img : img;
    const thumb = document.createElement("img");
    thumb.src = url;
    thumb.classList.toggle("selected", i === 0);
    thumb.onclick = () => {
      imgPrincipal.src = url;
      miniaturas.querySelectorAll("img").forEach(m => m.classList.remove("selected"));
      thumb.classList.add("selected");
    };
    miniaturas.appendChild(thumb);
  });
}

// 4) Cerrar modal detalle
document.querySelector("#modal-detalle .close").onclick = () => {
  modalDetalle.classList.add("hidden");
};

// 5) Agregar al carrito
btnAgregar.onclick = () => {
  carrito.push(productoActual);
  alert("Producto agregado al carrito");
  modalDetalle.classList.add("hidden");
};

// 6) Ver carrito
document.getElementById("ver-carrito").onclick = () => {
  mostrarCarrito();
  modalCarrito.classList.remove("hidden");
};

// 7) Cerrar carrito
document.querySelector(".close-carrito").onclick = () => {
  modalCarrito.classList.add("hidden");
};

// 8) Renderizar carrito
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

// 9) Validar y enviar pedido
document.getElementById("formulario-pedido").onsubmit = (e) => {
  e.preventDefault();
  const fecha = new Date(e.target.fecha.value);
  const dia   = fecha.getDay(); // 2=Martes,4=Jueves

  if (dia !== 2 && dia !== 4) {
    alert("Solo martes o jueves permitidos.");
    return;
  }
  alert("¡Gracias por tu compra!");
  carrito = [];
  modalCarrito.classList.add("hidden");
};






