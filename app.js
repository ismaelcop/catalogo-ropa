// app.js (tienda online)
let carrito = [];
let productoActual = null;

const catalogo         = document.getElementById('catalogo');
const modalDetalle     = document.getElementById('modal-detalle');
const modalNombre      = document.getElementById('modal-nombre');
const modalDescripcion = document.getElementById('modal-descripcion');
const modalPrecio      = document.getElementById('modal-precio');
const modalTalle       = document.getElementById('modal-talle');
const imgPrincipal     = document.getElementById('img-principal');
const miniaturas       = document.getElementById('miniaturas');
const btnAgregar       = document.getElementById('agregar-carrito');
const modalCarrito     = document.getElementById('modal-carrito');
const carritoItems     = document.getElementById('carrito-items');
const totalCarrito     = document.getElementById('total-carrito');
const ORDER_FORM       = document.getElementById('formulario-pedido');

// Solo una vez:
const backendBase = 'https://0549afa3-f5f3-433d-a9ee-469bca56b06c-00-3eup8qamcaglh.picard.replit.dev';
const backendURL  = `${backendBase}/productos`;

// Carga inicial
fetch(backendURL)
  .then(r => r.json())
  .then(data => mostrarCatalogo(data))
  .catch(() => catalogo.innerHTML = '<p>Error cargando productos.</p>');

function mostrarCatalogo(productos) {
  catalogo.innerHTML = '';
  productos.forEach(p => {
    const imgs = Array.isArray(p.imagenes) ? p.imagenes : [];
    const srcMain = imgs.length
      ? (imgs[0].startsWith('/uploads') ? backendBase + imgs[0] : imgs[0])
      : 'https://via.placeholder.com/150';

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${srcMain}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <p>$${p.precio}</p>
    `;
    card.onclick = () => mostrarDetalle(p);
    catalogo.appendChild(card);
  });
}

function mostrarDetalle(p) {
  productoActual = p;
  modalDetalle.classList.remove('hidden');
  modalNombre.textContent      = p.nombre;
  modalDescripcion.textContent = p.descripcion;
  modalPrecio.textContent      = p.precio;
  modalTalle.textContent       = p.talle;

  const imgs = Array.isArray(p.imagenes) ? p.imagenes : [];
  const mainUrl = imgs.length
    ? (imgs[0].startsWith('/uploads') ? backendBase + imgs[0] : imgs[0])
    : 'https://via.placeholder.com/300';
  imgPrincipal.src = mainUrl;

  miniaturas.innerHTML = '';
  imgs.forEach((img, i) => {
    const url = img.startsWith('/uploads') ? backendBase + img : img;
    const thumb = document.createElement('img');
    thumb.src = url;
    if (i === 0) thumb.classList.add('selected');
    thumb.onclick = () => {
      imgPrincipal.src = url;
      document.querySelectorAll('#miniaturas img').forEach(m => m.classList.remove('selected'));
      thumb.classList.add('selected');
    };
    miniaturas.appendChild(thumb);
  });
}

document.querySelector('#modal-detalle .close').onclick = () => {
  modalDetalle.classList.add('hidden');
};

btnAgregar.onclick = () => {
  carrito.push(productoActual);
  alert('Agregado al carrito');
  modalDetalle.classList.add('hidden');
};

document.getElementById('ver-carrito').onclick = () => {
  mostrarCarrito();
  modalCarrito.classList.remove('hidden');
};
document.querySelector('.close-carrito').onclick = () => {
  modalCarrito.classList.add('hidden');
};

function mostrarCarrito() {
  carritoItems.innerHTML = '';
  let total = 0;
  carrito.forEach(item => {
    const div = document.createElement('div');
    div.textContent = `${item.nombre} - $${item.precio}`;
    carritoItems.appendChild(div);
    total += item.precio;
  });
  totalCarrito.textContent = total;
}

ORDER_FORM.onsubmit = e => {
  e.preventDefault();
  const dia = new Date(e.target.fecha.value).getDay();
  if (dia !== 2 && dia !== 4) {
    alert('Solo martes o jueves permitidos.');
    return;
  }
  alert('¡Gracias por tu compra!');
  carrito = [];
  modalCarrito.classList.add('hidden');
};


