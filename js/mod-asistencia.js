async function renderAsistencia() {
  const vista = document.getElementById('vista');
  const esGerencial = tienePermiso('asistencia:write');

  vista.innerHTML =
    '<div class="modulo-topbar"><h2>Asistencia</h2></div>' +
    (tienePermiso('asistencia:marcar')
      ? '<div class="tarjeta-info" style="margin-bottom:1rem;">' +
          '<button class="boton boton-chico" id="btn-marcar-entrada">Marcar entrada</button> ' +
          '<button class="boton boton--secundario boton-chico" id="btn-marcar-salida">Marcar salida</button>' +
        '</div>'
      : '') +
    '<div id="tabla-asistencia"></div>';

  const columnas = [
    { campo: 'tipo', etiqueta: 'Tipo' },
    { campo: 'ts_servidor', etiqueta: 'Fecha y hora' },
    { campo: 'flag_sospechoso', etiqueta: 'Sospechoso' },
    { campo: 'motivo_sospecha', etiqueta: 'Motivo' }
  ];

  async function cargar() {
    const accion = esGerencial ? 'asistencia.list' : 'asistencia.misMarcas';
    const data = await llamarConManejoDeErrores(llamarApi(accion, {}));
    renderTabla('tabla-asistencia', columnas, data.items);
  }

  function obtenerUbicacion() {
    return new Promise(function (resolve) {
      if (!navigator.geolocation) { resolve(null); return; }
      navigator.geolocation.getCurrentPosition(
        function (pos) {
          resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy });
        },
        function () { resolve(null); },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }

  async function marcar(tipo) {
    const ubicacion = await obtenerUbicacion();
    const payload = { tipo: tipo };
    if (ubicacion) { payload.lat = ubicacion.lat; payload.lng = ubicacion.lng; payload.accuracy = ubicacion.accuracy; }
    else mostrarToast('No se pudo obtener tu ubicación, se registrará como sospechoso', 'info');

    await llamarConManejoDeErrores(llamarApi('asistencia.marcar', payload), 'Marca registrada: ' + tipo);
    cargar();
  }

  const btnEntrada = document.getElementById('btn-marcar-entrada');
  const btnSalida = document.getElementById('btn-marcar-salida');
  if (btnEntrada) btnEntrada.addEventListener('click', function () { marcar('entrada'); });
  if (btnSalida) btnSalida.addEventListener('click', function () { marcar('salida'); });

  cargar();
}
