const API_URL  = 'https://0549afa3-f5f3-433d-a9ee-469bca56b06c-00-3eup8qamcaglh.picard.replit.dev/productos';
const API_BASE = API_URL.replace('/productos', '');

const form    = document.getElementById('form-producto');
const lista   = document.getElementById('lista-productos');
const mensaje = document.getElementById('mensaje');

// Al enviar el formulario (crear o editar)
form.onsubmit = async (e) => {
  e.preventDefault();

  // Armo FormData manualmente
  const formData = new FormData();
  formData.append('nombre',      form.nombre.value);
  formData.append('precio',      form.precio.value);
  formData.append('talle',       form.talle.value);
  formData.append('descripcion', form.descripcion.value);
  formData.append('activo',      form.activo.checked);
  formData.append('oferta',      form.oferta.checked);

  // Archivos
  for (const file of form.imagenes.files) {
    formData.append('imagenes', file);
  }

  // Si viene ID, es edición
  const id = form['producto-id'].value;
  if (id) formData.append('id', id);

  const method = id ? 'PUT' : 'POST';
  const url    = id ? `${API_URL}/${id}` : API_URL;

  try {
    const res = await fetch(url, { method, body: formData });
    if (!res.ok) throw new Error('No se pudo guardar el producto');
    mostrarMensaje('✅ Producto guardado con éxito', true);
    form.reset();
    form['producto-id'].value = '';
    cargarProductos();
  } catch (err) {
    console.error(err);
    mostrarMensaje('❌ Error al guardar el producto', false);
  }
};

// Carga e imprime la lista de productos
async function cargarProductos() {
  try {
    const res = await fetch(API_URL);
    const ct  = res.headers.get('content-type') || '';
    if (!res.ok || !ct.includes('application/json')) {
      throw new Error('Respuesta no es JSON válido');
    }
    const productos = await res.json();

    // Limpio contenedor
    lista.innerHTML = '';

    productos.forEach(p => {
      // Card container
      const card = document.createElement('div');
      card.style.border = '1px solid #ccc';
      card.style.padding = '10px';
      card.style.margin  = '10px 0';

      // Título
      const h3 = document.createElement('h3');
      h3.textContent = `${p.nombre} - $${p.precio}`;
      card.appendChild(h3);

      // Descripción
      const desc = document.createElement('p');
      desc.textContent = p.descripcion;
      card.appendChild(desc);

      // Talle/estado
      const info = document.createElement('p');
      info.textContent = `Talle: ${p.talle} - ${p.activo ? 'Activo' : 'Inactivo'} ${p.oferta ? '(Oferta)' : ''}`;
      card.appendChild(info);

      // Imágenes
      const imgs = Array.isArray(p.imagenes) ? p.imagenes : [];
      imgs.forEach(img => {
        const src = img.startsWith('/uploads') ? API_BASE + img : img;
        const imageEl = document.createElement('img');
        imageEl.src = src;
        imageEl.width = 100;
        imageEl.style.marginRight = '5px';
        card.appendChild(imageEl);
      });

      // Edit button
      const btnEdit = document.createElement('button');
      btnEdit.textContent = '✏️ Editar';
      btnEdit.addEventListener('click', () => editar(p.id));
      card.appendChild(btnEdit);

      // Delete button
      const btnDel = document.createElement('button');
      btnDel.textContent = '🗑️ Eliminar';
      btnDel.style.marginLeft = '5px';
      btnDel.addEventListener('click', () => eliminar(p.id));
      card.appendChild(btnDel);

      // Agrego card al DOM
      lista.appendChild(card);
    });
  } catch (err) {
    console.error('Error al cargar productos:', err);
    mostrarMensaje('❌ No se pudieron cargar los productos', false);
  }
}

// Edición: carga datos en el formulario
async function editar(id) {
  console.log('Editar producto ID:', id);
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error('Producto no encontrado');
    const p = await res.json();

    form['producto-id'].value = p.id;
    form.nombre.value       = p.nombre;
    form.precio.value       = p.precio;
    form.talle.value        = p.talle;
    form.descripcion.value  = p.descripcion;
    form.activo.checked     = p.activo;
    form.oferta.checked     = p.oferta;
  } catch (err) {
    console.error('Error en editar():', err);
    mostrarMensaje('❌ No se pudo cargar datos del producto', false);
  }
}

// Eliminación
function eliminar(id) {
  fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    .then(() => {
      mostrarMensaje('🗑️ Producto eliminado', true);
      cargarProductos();
    })
    .catch(() => mostrarMensaje('❌ Error al eliminar producto', false));
}

// Mensajes de notificación
function mostrarMensaje(txt, exito = true) {
  mensaje.textContent = txt;
  mensaje.style.display = 'block';
  mensaje.style.backgroundColor = exito ? '#d4edda' : '#f8d7da';
  mensaje.style.color = exito ? '#155724' : '#721c24';
  mensaje.style.border = exito ? '1px solid #c3e6cb' : '1px solid #f5c6cb';
  setTimeout(() => mensaje.style.display = 'none', 3000);
}

// Al iniciar
cargarProductos();





