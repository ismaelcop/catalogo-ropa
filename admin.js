const backendURL = 'https://0549afa3-f5f3-433d-a9ee-469bca56b06c-00-3eup8qamcaglh.picard.replit.dev';
const form = document.getElementById('form-producto');
const lista = document.getElementById('lista-productos');

let productos = [];

function cargarProductos() {
  fetch(`${backendURL}/productos`)
    .then(res => res.json())
    .then(data => {
      productos = data;
      mostrarLista();
    });
}

function mostrarLista() {
  lista.innerHTML = '';
  productos.forEach(prod => {
    const div = document.createElement('div');
    div.innerHTML = `
      <strong>${prod.nombre}</strong> - $${prod.precio} - Talle: ${prod.talle}<br>
      <button onclick="editarProducto(${prod.id})">Editar</button>
      <button onclick="eliminarProducto(${prod.id})">Eliminar</button>
      <hr/>
    `;
    lista.appendChild(div);
  });
}

form.onsubmit = (e) => {
  e.preventDefault();
  const id = document.getElementById('producto-id').value;
  const nuevoProducto = {
    nombre: document.getElementById('nombre').value,
    precio: parseFloat(document.getElementById('precio').value),
    talle: document.getElementById('talle').value,
    descripcion: document.getElementById('descripcion').value,
    imagenes: document.getElementById('imagenes').value.split(',').map(img => img.trim())
  };

  if (id) {
    // Editar
    fetch(`${backendURL}/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoProducto)
    }).then(() => {
      form.reset();
      cargarProductos();
    });
  } else {
    // Agregar nuevo
    fetch(`${backendURL}/productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoProducto)
    }).then(() => {
      form.reset();
      cargarProductos();
    });
  }
};

window.editarProducto = (id) => {
  const prod = productos.find(p => p.id === id);
  document.getElementById('producto-id').value = prod.id;
  document.getElementById('nombre').value = prod.nombre;
  document.getElementById('precio').value = prod.precio;
  document.getElementById('talle').value = prod.talle;
  document.getElementById('descripcion').value = prod.descripcion;
  document.getElementById('imagenes').value = prod.imagenes.join(', ');
};

window.eliminarProducto = (id) => {
  if (confirm('¿Eliminar este producto?')) {
    fetch(`${backendURL}/productos/${id}`, { method: 'DELETE' })
      .then(() => cargarProductos());
  }
};

cargarProductos();
