async function renderModuloGenerico(config) {
  const vista = document.getElementById('vista');
  vista.innerHTML =
    '<div class="modulo-topbar">' +
      '<h2>' + config.titulo + '</h2>' +
      (tienePermiso(config.permisoEscritura) ? '<button class="boton boton-chico" id="btn-nuevo">Nuevo</button>' : '') +
    '</div>' +
    '<div id="tabla-modulo"></div>';

  let itemsActuales = [];

  async function cargar() {
    const data = await llamarConManejoDeErrores(llamarApi(config.modulo + '.list', {}));
    itemsActuales = data.items;
    renderTabla('tabla-modulo', config.columnas, itemsActuales, function (fila) {
      let html = '';
      if (tienePermiso(config.permisoEscritura)) html += '<button class="boton boton--secundario boton-chico" data-editar="' + fila.id + '">Editar</button> ';
      if (tienePermiso(config.permisoBorrado)) html += '<button class="boton boton--secundario boton-chico" data-anular="' + fila.id + '">Anular</button>';
      return html;
    });

    vista.querySelectorAll('[data-editar]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const item = itemsActuales.filter(function (i) { return i.id === btn.dataset.editar; })[0];
        abrirFormulario(item);
      });
    });
    vista.querySelectorAll('[data-anular]').forEach(function (btn) {
      btn.addEventListener('click', async function () {
        if (!confirm('¿Anular este registro?')) return;
        await llamarConManejoDeErrores(llamarApi(config.modulo + '.anular', { id: btn.dataset.anular }), 'Registro anulado');
        cargar();
      });
    });
  }

  function abrirFormulario(item) {
    const camposHtml = config.campos.map(function (c) {
      const valor = item ? (item[c.nombre] !== undefined ? item[c.nombre] : '') : '';
      return '<div class="campo"><label>' + c.etiqueta + '</label>' +
        '<input type="' + c.tipo + '" name="' + c.nombre + '" value="' + valor + '" ' + (c.requerido ? 'required' : '') + (c.tipo === 'number' ? ' step="0.01"' : '') + '></div>';
    }).join('');

    abrirModal(
      item ? 'Editar — ' + config.titulo : 'Nuevo — ' + config.titulo,
      '<form id="form-modulo">' + camposHtml + '<button type="submit" class="boton">Guardar</button></form>'
    );

    document.getElementById('form-modulo').addEventListener('submit', async function (ev) {
      ev.preventDefault();
      const payload = {};
      config.campos.forEach(function (c) {
        const valor = ev.target[c.nombre].value;
        payload[c.nombre] = c.tipo === 'number' ? Number(valor) : valor;
      });
      if (item) payload.id = item.id;

      await llamarConManejoDeErrores(
        llamarApi(config.modulo + (item ? '.editar' : '.crear'), payload),
        item ? 'Actualizado correctamente' : 'Creado correctamente'
      );
      cerrarModal();
      cargar();
    });
  }

  if (document.getElementById('btn-nuevo')) {
    document.getElementById('btn-nuevo').addEventListener('click', function () { abrirFormulario(null); });
  }

  cargar();
}
