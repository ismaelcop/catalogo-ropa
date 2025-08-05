const API = 'https://0549afa3-f5f3-433d-a9ee-469bca56b06c-00-3eup8qamcaglh.picard.replit.dev/productos';

const catalogo      = document.getElementById('catalogo');
const mdDetalle     = document.getElementById('modal-detalle');
const mdCarrito     = document.getElementById('modal-carrito');
const imgPrin       = document.getElementById('img-principal');
const miniaturas    = document.getElementById('miniaturas');
const nombreEl      = document.getElementById('modal-nombre');
const descEl        = document.getElementById('modal-descripcion');
const precioEl      = document.getElementById('modal-precio');
const talleEl       = document.getElementById('modal-talle');
const btnAgregar    = document.getElementById('agregar-carrito');

let productos = [], carrito = [], current = null;

// 1) Carga inicial
fetch(API)
  .then(r => r.json())
  .then(d => { productos = d; renderCatalogo(); })
  .catch(_ => catalogo.innerHTML = '<p>Error cargando catálogo</p>');

function renderCatalogo() {
  catalogo.innerHTML = '';
  productos.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    const img = (p.imagenes&&p.imagenes[0])
      ? `<img src="${API.replace('/productos','')}${p.imagenes[0]}"/>`
      : `<img src="https://via.placeholder.com/150"/>`;
    card.innerHTML = `${img}<h3>${p.nombre}</h3><p>$${p.precio}</p>`;
    card.onclick = () => showDetalle(p);
    catalogo.appendChild(card);
  });
}

function showDetalle(p) {
  current = p;
  mdDetalle.classList.remove('hidden');
  nombreEl.textContent = p.nombre;
  descEl.textContent   = p.descripcion;
  precioEl.textContent = p.precio;
  talleEl.textContent  = p.talle;

  imgPrin.src = p.imagenes&&p.imagenes[0]
    ? `${API.replace('/productos','')}${p.imagenes[0]}`
    : 'https://via.placeholder.com/300';

  miniaturas.innerHTML = '';
  (p.imagenes||[]).forEach(u => {
    const thumb = document.createElement('img');
    thumb.src = `${API.replace('/productos','')}${u}`;
    thumb.onclick = () => imgPrin.src = thumb.src;
    miniaturas.appendChild(thumb);
  });
}

document.querySelector('#modal-detalle .close').onclick = () =>
  mdDetalle.classList.add('hidden');

btnAgregar.onclick = () => {
  carrito.push(current);
  alert('Agregado al carrito');
  mdDetalle.classList.add('hidden');
};

document.getElementById('ver-carrito').onclick = () => {
  mdCarrito.classList.remove('hidden');
  renderCarrito();
};

document.querySelector('.close-carrito').onclick = () =>
  mdCarrito.classList.add('hidden');

function renderCarrito() {
  const cont = document.getElementById('carrito-items');
  cont.innerHTML = '';
  let total = 0;
  carrito.forEach(item => {
    cont.innerHTML += `<div>${item.nombre} – $${item.precio}</div>`;
    total += item.precio;
  });
  document.getElementById('total-carrito').textContent = total;
}

document.getElementById('formulario-pedido').onsubmit = e => {
  e.preventDefault();
  const dia = new Date(e.target.fecha.value).getDay();
  if (![2,4].includes(dia)) {
    alert('Solo martes o jueves');
    return;
  }
  alert('¡Compra realizada!');
  carrito = [];
  mdCarrito.classList.add('hidden');
};




