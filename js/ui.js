function mostrarToast(mensaje, tipo) {
  const contenedor = document.getElementById('toasts');
  if (!contenedor) return;
  const toast = document.createElement('div');
  toast.className = 'toast toast--' + (tipo || 'info');
  toast.textContent = mensaje;
  contenedor.appendChild(toast);
  setTimeout(function () { toast.remove(); }, 4000);
}

function abrirModal(tituloHtml, contenidoHtml) {
  const fondo = document.getElementById('modal-fondo');
  const titulo = document.getElementById('modal-titulo');
  const cuerpo = document.getElementById('modal-cuerpo');
  titulo.innerHTML = tituloHtml;
  cuerpo.innerHTML = contenidoHtml;
  fondo.classList.remove('oculto');
}

function cerrarModal() {
  document.getElementById('modal-fondo').classList.add('oculto');
}

function renderTabla(contenedorId, columnas, filas, acciones) {
  const contenedor = document.getElementById(contenedorId);
  if (!filas.length) {
    contenedor.innerHTML = '<p class="tabla-vacia">Sin registros.</p>';
    return;
  }
  let html = '<table class="tabla"><thead><tr>';
  columnas.forEach(function (col) { html += '<th>' + col.etiqueta + '</th>'; });
  if (acciones) html += '<th>Acciones</th>';
  html += '</tr></thead><tbody>';
  filas.forEach(function (fila) {
    html += '<tr>';
    columnas.forEach(function (col) { html += '<td>' + (fila[col.campo] !== undefined ? fila[col.campo] : '') + '</td>'; });
    if (acciones) {
      html += '<td>' + acciones(fila) + '</td>';
    }
    html += '</tr>';
  });
  html += '</tbody></table>';
  contenedor.innerHTML = html;
}

async function llamarConManejoDeErrores(promesa, mensajeExitoso) {
  try {
    const data = await promesa;
    if (mensajeExitoso) mostrarToast(mensajeExitoso, 'exito');
    return data;
  } catch (err) {
    if (err.code === 'PERM_DENIED') {
      mostrarToast('No tiene permiso para esta acción', 'error');
    } else if (err.code === 'VALIDATION') {
      mostrarToast(err.msg || 'Datos inválidos', 'error');
    } else if (err.code === 'RED') {
      mostrarToast('Sin conexión con el servidor, reintenta', 'error');
    } else {
      mostrarToast(err.msg || 'Ocurrió un error', 'error');
    }
    throw err;
  }
}
