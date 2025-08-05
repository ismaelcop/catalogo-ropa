const API_URL  = 'https://0549afa3-f5f3-433d-a9ee-469bca56b06c-00-3eup8qamcaglh.picard.replit.dev/productos';
const API_BASE = API_URL.replace('/productos','');

const lista      = document.getElementById('lista-productos');
const mensaje    = document.getElementById('mensaje');
const btnNuevo   = document.getElementById('btn-nuevo');
const modalForm  = document.getElementById('modal-form');
const modalClose = document.getElementById('modal-close');
const form       = document.getElementById('form-producto');
const get        = id => document.getElementById(id);
const val        = id => get(id).value;

btnNuevo.addEventListener('click', () => abrirModal());
modalClose.addEventListener('click', cerrarModal);

form.onsubmit = async e => {
  e.preventDefault();
  const fd = new FormData();
  ['nombre','precio','talle','descripcion']
    .forEach(f => fd.append(f, val(f)));
  fd.append('activo',  get('activo').checked);
  fd.append('oferta',  get('oferta').checked);
  for (let file of get('imagenes').files) fd.append('imagenes', file);

  const id     = val('producto-id');
  const method = id ? 'PUT' : 'POST';
  const url    = id ? `${API_URL}/${id}` : API_URL;

  try {
    let res = await fetch(url, { method, body: fd });
    if (!res.ok) throw new Error();
    mostrarMsg('✅ Guardado', true);
    cerrarModal();
    cargarProductos();
  } catch {
    mostrarMsg('❌ Error', false);
  }
};

async function cargarProductos() {
  lista.innerHTML = '';
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    data.forEach(p => {
      const card = document.createElement('div');
      card.className  = 'card';
      card.dataset.id = p.id;

      card.innerHTML = `
        <h3>${p.nombre} – $${p.precio}</h3>
        <p>${p.descripcion}</p>
        <p>Talle: ${p.talle} – ${p.activo?'Activo':'Inactivo'} ${p.oferta? '(Oferta)':''}</p>
      `;

      // Imágenes
      (p.imagenes||[]).forEach(srcRel => {
        const src = srcRel.startsWith('/uploads')
          ? API_BASE + srcRel
          : srcRel;
        const img = document.createElement('img');
        img.src = src; img.width = 80; img.style.margin='0 5px';
        card.appendChild(img);
      });

      const be = document.createElement('button');
      be.textContent = '✏️ Editar';
      be.onclick     = () => abrirModal(p);
      card.appendChild(be);

      const bd = document.createElement('button');
      bd.textContent = '🗑️ Eliminar';
      bd.onclick     = async () => {
        await fetch(`${API_URL}/${p.id}`, { method:'DELETE' });
        card.remove();
      };
      card.appendChild(bd);

      lista.appendChild(card);
    });
  } catch {
    mostrarMsg('❌ No se cargaron', false);
  }
}

function abrirModal(p = {}) {
  form.reset();
  get('producto-id').value  = p.id || '';
  get('nombre').value       = p.nombre || '';
  get('precio').value       = p.precio || '';
  get('talle').value        = p.talle || '';
  get('descripcion').value  = p.descripcion || '';
  get('activo').checked     = !!p.activo;
  get('oferta').checked     = !!p.oferta;
  modalForm.classList.add('active');
}

function cerrarModal() {
  modalForm.classList.remove('active');
}

function mostrarMsg(txt, ok) {
  mensaje.textContent = txt;
  mensaje.className   = ok ? 'alert ok' : 'alert error';
  mensaje.style.display = 'block';
  setTimeout(() => mensaje.style.display = 'none', 3000);
}

cargarProductos();




