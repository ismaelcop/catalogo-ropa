const API_URL  = 'https://0549afa3-f5f3-433d-a9ee-469bca56b06c-00-3eup8qamcaglh.picard.replit.dev/productos';
const API_BASE = API_URL.replace('/productos', '');

const lista      = document.getElementById('lista-productos');
const mensaje    = document.getElementById('mensaje');
const btnNuevo   = document.getElementById('btn-nuevo');
const modalForm  = document.getElementById('modal-form');
const modalClose = document.getElementById('modal-close');
const form       = document.getElementById('form-producto');

const get = id => document.getElementById(id);
const val = id => get(id).value;

// Abrir/cerrar modal
btnNuevo.addEventListener('click', () => abrirModal());
modalClose.addEventListener('click', cerrarModal);

// Crear o editar
form.onsubmit = async (e) => {
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

// Carga y renderiza
async function cargarProductos() {
  lista.innerHTML = '';
  try {
    const res  = await fetch(API_URL);
    const data = await res.json();

    data.forEach(p => {
      // DEBUG: ver p e p.id
      console.log('Renderizando producto:', p, 'id:', p.id);

      const card = document.createElement('div');
      card.className = 'card';

      card.innerHTML = `
        <h3>${p.nombre} - $${p.precio}</h3>
        <p>${p.descripcion}</p>
        <p>Talle: ${p.talle} - ${p.activo ? 'Activo' : 'Inactivo'} ${p.oferta ? '(Oferta)' : ''}</p>
      `;

      // Imágenes
      (Array.isArray(p.imagenes) ? p.imagenes : []).forEach(img => {
        const src = img.startsWith('/uploads') ? API_BASE + img : img;
        const i   = document.createElement('img');
        i.src     = src;
        i.width   = 80;
        i.style.margin = '0 5px';
        card.appendChild(i);
      });

      // Editar
      const be = document.createElement('button');
      be.textContent = '✏️ Editar';
      be.addEventListener('click', () => abrirModal(p));
      card.appendChild(be);

      // Eliminar
      const bd = document.createElement('button');
      bd.textContent = '🗑️ Eliminar';
      bd.style.marginLeft = '5px';
      bd.addEventListener('click', async () => {
        // Aqui uso p.id directamente
        console.log('Intentando eliminar producto p:', p, 'p.id:', p.id);
        try {
          const resDel = await fetch(`${API_URL}/${p.id}`, { method: 'DELETE' });
          if (!resDel.ok) throw new Error(`Status ${resDel.status}`);
          card.remove();
          mostrarMsgCard(card, '🗑️ Producto eliminado', true);
        } catch (err) {
          console.error('Error eliminando:', err);
          mostrarMsgCard(card, '❌ No se pudo eliminar', false);
        }
      });
      card.appendChild(bd);

      lista.appendChild(card);
    });
  } catch {
    mostrarMsg('❌ No se pudieron cargar', false);
  }
}

// Abrir modal y cargar datos para edición
function abrirModal(p = null) {
  form.reset();
  get('producto-id').value = '';
  if (p) {
    get('producto-id').value  = p.id;
    get('nombre').value       = p.nombre || '';
    get('precio').value       = p.precio || '';
    get('talle').value        = p.talle || '';
    get('descripcion').value  = p.descripcion || '';
    get('activo').checked     = !!p.activo;
    get('oferta').checked     = !!p.oferta;
  }
  modalForm.classList.add('active');
}

// Cerrar modal
function cerrarModal() {
  modalForm.classList.remove('active');
}

// Mensaje global
function mostrarMsg(txt, ok) {
  mensaje.textContent = txt;
  mensaje.style.display = 'block';
  mensaje.style.backgroundColor = ok ? '#d4edda' : '#f8d7da';
  mensaje.style.color           = ok ? '#155724' : '#721c24';
  mensaje.style.border          = ok ? '1px solid #c3e6cb' : '1px solid #f5c6cb';
  setTimeout(() => mensaje.style.display = 'none', 3000);
}

// Mensaje junto a la card
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

// Inicializar
cargarProductos();


