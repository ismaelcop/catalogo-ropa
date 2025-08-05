const API_URL  = 'https://0549afa3-f5f3-433d-a9ee-469bca56b06c-00-3eup8qamcaglh.picard.replit.dev/productos';
const API_BASE = API_URL.replace('/productos', '');

const lista        = document.getElementById('lista-productos');
const mensaje      = document.getElementById('mensaje');
const btnNuevo     = document.getElementById('btn-nuevo');
const modalForm    = document.getElementById('modal-form');
const modalClose   = document.getElementById('modal-close');
const form         = document.getElementById('form-producto');

// Abrir modal para nuevo o editar
btnNuevo.addEventListener('click', () => abrirModal());
modalClose.addEventListener('click', cerrarModal);

// Envía creación o edición
form.onsubmit = async (e) => {
  e.preventDefault();

  // Construyo FormData manualmente
  const fd = new FormData();
  fd.append('nombre',      form.nombre.value);
  fd.append('precio',      form.precio.value);
  fd.append('talle',       form.talle.value);
  fd.append('descripcion', form.descripcion.value);
  fd.append('activo',      form.activo.checked);
  fd.append('oferta',      form.oferta.checked);

  // Archivos (si hay)
  for (const file of form.imagenes.files) {
    fd.append('imagenes', file);
  }

  const id = form['id'].value;
  if (id) fd.append('id', id);

  const method = id ? 'PUT' : 'POST';
  const url    = id ? `${API_URL}/${id}` : API_URL;

  try {
    const res = await fetch(url, { method, body: fd });
    if (!res.ok) throw new Error('No se pudo guardar');
    mostrarMsg('✅ Producto guardado', true);
    cerrarModal();
    cargarProductos();
  } catch (err) {
    console.error(err);
    mostrarMsg('❌ Error al guardar', false);
  }
};

// Carga listado
async function cargarProductos() {
  try {
    const res = await fetch(API_URL);
    const ct  = res.headers.get('content-type') || '';
    if (!res.ok || !ct.includes('application/json')) {
      throw new Error('Respuesta inválida');
    }
    const productos = await res.json();
    lista.innerHTML = '';

    productos.forEach(p => {
      const card = document.createElement('div');
      card.style.border = '1px solid #ccc';
      card.style.padding = '10px';
      card.style.margin  = '10px 0';

      const h3 = document.createElement('h3');
      h3.textContent = `${p.nombre} - $${p.precio}`;
      card.appendChild(h3);

      const desc = document.createElement('p');
      desc.textContent = p.descripcion;
      card.appendChild(desc);

      const info = document.createElement('p');
      info.textContent = `Talle: ${p.talle} - ${p.activo ? 'Activo' : 'Inactivo'} ${p.oferta ? '(Oferta)' : ''}`;
      card.appendChild(info);

      // Imágenes
      const imgs = Array.isArray(p.imagenes) ? p.imagenes : [];
      imgs.forEach(img => {
        const src = img.startsWith('/uploads') ? API_BASE + img : img;
        const imgEl = document.createElement('img');
        imgEl.src = src;
        imgEl.width = 80;
        imgEl.style.marginRight = '5px';
        card.appendChild(imgEl);
      });

      // Botones
      const btnE = document.createElement('button');
      btnE.textContent = '✏️ Editar';
      btnE.addEventListener('click', () => abrirModal(p));
      card.appendChild(btnE);

      const btnD = document.createElement('button');
      btnD.textContent = '🗑️ Eliminar';
      btnD.style.marginLeft = '5px';
      btnD.addEventListener('click', () => eliminar(p.id));
      card.appendChild(btnD);

      lista.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    mostrarMsg('❌ No se pudieron cargar productos', false);
  }
}

// Abre modal; si recibe producto, lo carga para editar
function abrirModal(producto = null) {
  form.reset();
  form['id'].value = '';
  if (producto) {
    form['id'].value        = producto.id;
    form.nombre.value       = producto.nombre;
    form.precio.value       = producto.precio;
    form.talle.value        = producto.talle;
    form.descripcion.value  = producto.descripcion;
    form.activo.checked     = producto.activo;
    form.oferta.checked     = producto.oferta;
  }
  modalForm.classList.add('active');
}

// Cierra modal
function cerrarModal() {
  modalForm.classList.remove('active');
}

// Borra producto
async function eliminar(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error();
    mostrarMsg('🗑️ Producto eliminado', true);
    cargarProductos();
  } catch {
    mostrarMsg('❌ Error al eliminar', false);
  }
}

// Mensajes arriba
function mostrarMsg(text, ok) {
  mensaje.textContent = text;
  mensaje.style.display = 'block';
  mensaje.style.backgroundColor = ok ? '#d4edda' : '#f8d7da';
  mensaje.style.color           = ok ? '#155724' : '#721c24';
  mensaje.style.border          = ok ? '1px solid #c3e6cb' : '1px solid #f5c6cb';
  setTimeout(() => mensaje.style.display = 'none', 3000);
}

// Inicial
cargarProductos();




