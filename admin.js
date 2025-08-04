const API_URL = 'https://0549afa3-f5f3-433d-a9ee-469bca56b06c-00-3eup8qamcaglh.picard.replit.dev';

const form = document.getElementById('form-producto');
const lista = document.getElementById('lista-productos');

form.onsubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  formData.append('activo', document.getElementById('activo').checked);
  formData.append('oferta', document.getElementById('oferta').checked);

  const id = document.getElementById('producto-id').value;
  const method = id ? 'PUT' : 'POST';
  const url = id ? `${API_URL}/${id}` : API_URL;

  await fetch(url, {
    method,
    body: formData
  });

  form.reset();
  document.getElementById('producto-id').value = '';
  cargarProductos();
};

async function cargarProductos() {
  const res = await fetch(API_URL);
  const productos = await res.json();
  lista.innerHTML = productos.map(p => `
  <div>
    <h3>${p.nombre} - $${p.precio}</h3>
    <p>${p.descripcion}</p>
    <p>Talle: ${p.talle} - ${p.activo ? 'Activo' : 'Inactivo'} ${p.oferta ? '(Oferta)' : ''}</p>
    ${p.imagen ? `<img src="${API_URL}/${p.imagen}" width="100"/>` : ''}
    <button onclick="editar(${p.id})">Editar</button>
    <button onclick="eliminar(${p.id})">Eliminar</button>
  </div>
`).join('');
}

function editar(id) {
  fetch(`${API_URL}/${id}`).then(res => res.json()).then(p => {
    document.getElementById('producto-id').value = p.id;
    document.getElementById('nombre').value = p.nombre;
    document.getElementById('precio').value = p.precio;
    document.getElementById('talle').value = p.talle;
    document.getElementById('descripcion').value = p.descripcion;
    document.getElementById('activo').checked = p.activo;
    document.getElementById('oferta').checked = p.oferta;
  });
}

function eliminar(id) {
  fetch(`${API_URL}/${id}`, { method: 'DELETE' }).then(cargarProductos);
}

cargarProductos();





