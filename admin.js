const API_URL = 'https://0549afa3-f5f3-433d-a9ee-469bca56b06c-00-3eup8qamcaglh.picard.replit.dev/productos';
const API_BASE = API_URL.replace('/productos', '');

const form = document.getElementById('form-producto');
const lista = document.getElementById('lista-productos');
const mensaje = document.getElementById('mensaje');

form.onsubmit = async (e) => {
  e.preventDefault();

  // FormData ya incluye tus <input name="imagenes" multiple>
  const formData = new FormData(form);
  formData.append('activo', document.getElementById('activo').checked);
  formData.append('oferta', document.getElementById('oferta').checked);

  const id = document.getElementById('producto-id').value;
  const method = id ? 'PUT' : 'POST';
  const url = id ? `${API_URL}/${id}` : API_URL;

  try {
    const res = await fetch(url, { method, body: formData });
    if (!res.ok) throw new Error("No se pudo guardar el producto");

    mostrarMensaje("✅ Producto guardado con éxito", true);
    form.reset();
    document.getElementById('producto-id').value = '';
    cargarProductos();
  } catch (err) {
    console.error(err);
    mostrarMensaje("❌ Error al guardar el producto", false);
  }
};

async function cargarProductos() {
  try {
    const res = await fetch(API_URL);
    const contentType = res.headers.get("content-type") || "";

    if (!res.ok || !contentType.includes("application/json")) {
      throw new Error("La respuesta no es un JSON válido.");
    }

    const productos = await res.json();

    lista.innerHTML = productos.map(p => {
      const imgs = Array.isArray(p.imagenes) ? p.imagenes : [];
      const htmlImgs = imgs.map(img => {
        const src = img.startsWith('/uploads')
          ? API_BASE + img
          : img;
        return `<img src="${src}" width="100" style="margin-right:5px" />`;
      }).join('');

      return `
      <div style="border:1px solid #ccc; padding:10px; margin:10px 0;">
        <h3>${p.nombre} - $${p.precio}</h3>
        <p>${p.descripcion}</p>
        <p>Talle: ${p.talle} - ${p.activo ? 'Activo' : 'Inactivo'} ${p.oferta ? '(Oferta)' : ''}</p>
        ${htmlImgs}
        <br/>
        <button onclick="editar(${p.id})">✏️ Editar</button>
        <button onclick="eliminar(${p.id})">🗑️ Eliminar</button>
      </div>`;
    }).join('');
  } catch (err) {
    console.error("Error al cargar productos:", err);
    mostrarMensaje("❌ No se pudieron cargar los productos", false);
  }
}

function editar(id) {
  fetch(`${API_URL}/${id}`)
    .then(res => res.json())
    .then(p => {
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
  fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    .then(() => {
      mostrarMensaje("🗑️ Producto eliminado", true);
      cargarProductos();
    })
    .catch(() => mostrarMensaje("❌ Error al eliminar producto", false));
}

function mostrarMensaje(texto, exito = true) {
  mensaje.textContent = texto;
  mensaje.style.display = 'block';
  mensaje.style.backgroundColor = exito ? '#d4edda' : '#f8d7da';
  mensaje.style.color = exito ? '#155724' : '#721c24';
  mensaje.style.border = exito ? '1px solid #c3e6cb' : '1px solid #f5c6cb';

  setTimeout(() => mensaje.style.display = 'none', 3000);
}

cargarProductos();





