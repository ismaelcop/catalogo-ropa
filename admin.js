// admin.js
const API_URL  = 'https://0549afa3-f5f3-433d-a9ee-469bca56b06c-00-3eup8qamcaglh.picard.replit.dev/productos';
const API_BASE = API_URL.replace('/productos', '');

const lista      = document.getElementById('lista-productos');
const mensaje    = document.getElementById('mensaje');
const btnNuevo   = document.getElementById('btn-nuevo');
const modalForm  = document.getElementById('modal-form');
const modalClose = document.getElementById('modal-close');
const form       = document.getElementById('form-producto');

// Helpers
const get = id => document.getElementById(id);
const val = id => get(id).value;

// Abrir y cerrar modal
btnNuevo.addEventListener('click', () => abrirModal());
modalClose.addEventListener('click', cerrarModal);

// Submit: crear o editar
form.onsubmit = async e => {
  e.preventDefault();
  const fd = new FormData();
  ['nombre','precio','talle','descripcion'].forEach(f => fd.append(f, val(f)));
  fd.append('activo', get('activo').checked);
  fd.append('oferta', get('oferta').checked);
  for (const file of get('imagenes').files) fd.append('imagenes', file);

  const id = val('producto-id');
  if (id) fd.append('id', id);

  const method = id ? 'PUT' : 'POST';
  const url    = id ? `${API_URL}/${id}` : API_URL;

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

// Carga y pinta la lista
async function cargarProductos() {
  lista.innerHTML = '';
  try {
    const res  = await fetch(API_URL);
    if (!res.ok) throw new Error();
    const data = await res.json();

    data.forEach(p => {
      // DEBUG: verifica p.id
      console.log('Renderizando p.id =', p.id, 'p =', p);

      const card = document.createElement('div');
      card.className  = 'card';
      card.dataset.id = p.id;

      card.innerHTML = `
        <h3>${p.nombre} - $${p.precio}</h3>
        <p>${p.descripcion}</p>
        <p>Talle: ${p.talle} - ${p.activo ? 'Activo' : 'Inactivo'} ${p.oferta ? '(Oferta)' : ''}</p>
      `;

      // Imágenes
      (Array.isArray(p.imagenes) ? p.imagenes : []).forEach(img => {
        const src = img.startsWith('/uploads') ? API_BASE + img : img;
        const imgEl = document.createElement('img');
        imgEl.src = src;
        imgEl.width = 80;
        imgEl.style.margin = '0 5px';
        card.appendChild(imgEl);
      });

      // Botón Editar
      const be = document.createElement('button');
      be.textContent = '✏️ Editar';
      be.onclick = () => abrirModal(p);
      card.appendChild(be);

      // Botón Eliminar
      const bd = document.createElement('button');
      bd.textContent = '🗑️ Eliminar';
      bd.style.marginLeft = '5px';
      bd.onclick = async () => {
        const idToDelete = card.dataset.id;
        console.log('ID a eliminar:', idToDelete);
        try {
          const resDel = await fetch(`${API_URL}/${idToDelete}`, { method: 'DELETE' });
          if (!resDel.ok) throw new Error(`Status ${resDel.status}`);
          card.remove();
          mostrarMsgCard(card, '🗑️ Producto eliminado', true);
        } catch (err) {
          console.error('Error eliminando:', err);
          mostrarMsgCard(card, '❌ No se pudo eliminar', false);
        }
      };
      card.appendChild(bd);

      lista.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    mostrarMsg('❌ No se pudieron cargar los productos', false);
  }
}

// Abre modal; si recibe p, precarga para editar
function abrirModal(p = null) {
  form.reset();
  get('producto-id').value = '';
  if (p) {
    get('producto-id').value  = p.id;
    get('nombre').value       = p.nombre || '';
    get('precio').value       = p.precio || '';
    get('talle').value        = p.talle || '';
    get('descripcion').value  = p.descripcion || '';
    get('activo').checked     = Boolean(p.activo);
    get('oferta').checked     = Boolean(p.oferta);
  }
  modalForm.classList.add('active');
}

// Cierra modal
function cerrarModal() {
  modalForm.classList.remove('active');
}

// Notificación global
function mostrarMsg(txt, ok) {
  mensaje.textContent = txt;
  mensaje.style.display = 'block';
  mensaje.style.backgroundColor = ok ? '#d4edda' : '#f8d7da';
  mensaje.style.color           = ok ? '#155724' : '#721c24';
  mensaje.style.border          = ok ? '1px solid #c3e6cb' : '1px solid #f5c6cb';
  setTimeout(() => mensaje.style.display = 'none', 3000);
}

// Notificación junto al card
function mostrarMsgCard(card, txt, ok) {
  const prev = card.querySelector('.msg-card');
  if (prev) prev.remove();
  const span = document.createElement('span');
  span.className    = 'msg-card';
  span.textContent  = txt;
  span.style.marginLeft = '10px';
  span.style.color  = ok ? '#155724' : '#721c24';
  card.appendChild(span);
  setTimeout(() => span.remove(), 3000);
}

// Inicial
cargarProductos();


