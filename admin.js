const API_URL  = 'https://0549afa3-f5f3-433d-a9ee-469bca56b06c-00-3eup8qamcaglh.picard.replit.dev/productos';
const API_BASE = API_URL.replace('/productos', '');

const lista      = document.getElementById('lista-productos');
const mensaje    = document.getElementById('mensaje');
const btnNuevo   = document.getElementById('btn-nuevo');
const modalForm  = document.getElementById('modal-form');
const modalClose = document.getElementById('modal-close');
const form       = document.getElementById('form-producto');

// Abrir modal
btnNuevo.addEventListener('click', () => abrirModal());
modalClose.addEventListener('click', cerrarModal);

// Submit (crear o editar)
form.onsubmit = async (e) => {
  e.preventDefault();
  const fd = new FormData();
  ['nombre','precio','talle','descripcion'].forEach(f => fd.append(f, form[f].value));
  fd.append('activo', form.activo.checked);
  fd.append('oferta', form.oferta.checked);
  for (const file of form.imagenes.files) fd.append('imagenes', file);
  const id = form.id.value;
  const method = id ? 'PUT' : 'POST';
  const url    = id ? `${API_URL}/${id}` : API_URL;
  if (id) fd.append('id', id);

  try {
    const res = await fetch(url, { method, body: fd });
    if (!res.ok) throw new Error();
    mostrarMsg('✅ Producto guardado', true);
    cerrarModal();
    cargarProductos();
  } catch {
    mostrarMsg('❌ Error al guardar', false);
  }
};

// Carga listado
async function cargarProductos() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    lista.innerHTML = '';
    data.forEach(p => {
      const card = document.createElement('div');
      card.style = 'border:1px solid #ccc; padding:10px; margin:10px 0';

      card.innerHTML = `
        <h3>${p.nombre} - $${p.precio}</h3>
        <p>${p.descripcion}</p>
        <p>Talle: ${p.talle} - ${p.activo?'Activo':'Inactivo'} ${p.oferta? '(Oferta)':''}</p>
      `;
      // imágenes
      (Array.isArray(p.imagenes)? p.imagenes : []).forEach(img => {
        const url = img.startsWith('/uploads') ? API_BASE + img : img;
        const i = document.createElement('img');
        i.src = url; i.width = 80; i.style.margin = '0 5px';
        card.appendChild(i);
      });

      // editar
      const be = document.createElement('button');
      be.textContent = '✏️ Editar';
      be.onclick = () => abrirModal(p);
      card.appendChild(be);

      // eliminar
      const bd = document.createElement('button');
      bd.textContent = '🗑️ Eliminar';
      bd.style.marginLeft = '5px';
      bd.onclick = async () => {
        await fetch(`${API_URL}/${p.id}`, { method: 'DELETE' });
        mostrarMsg('🗑️ Producto eliminado', true);
        cargarProductos();
      };
      card.appendChild(bd);

      lista.appendChild(card);
    });
  } catch {
    mostrarMsg('❌ No se pudieron cargar', false);
  }
}

// Abrir modal, cargando datos si recibe producto
function abrirModal(p = null) {
  form.reset();
  form.id.value = '';
  if (p) {
    form.id.value           = p.id;
    form.nombre.value       = p.nombre;
    form.precio.value       = p.precio;
    form.talle.value        = p.talle;
    form.descripcion.value  = p.descripcion;
    form.activo.checked     = p.activo;
    form.oferta.checked     = p.oferta;
  }
  modalForm.classList.add('active');
}

// Cerrar
function cerrarModal() {
  modalForm.classList.remove('active');
}

// Mensaje
function mostrarMsg(txt, ok) {
  mensaje.textContent = txt;
  mensaje.style.display = 'block';
  mensaje.style.backgroundColor = ok ? '#d4edda' : '#f8d7da';
  mensaje.style.color           = ok ? '#155724' : '#721c24';
  mensaje.style.border          = ok ? '1px solid #c3e6cb' : '1px solid #f5c6cb';
  setTimeout(() => mensaje.style.display = 'none', 3000);
}

// Init
cargarProductos();



