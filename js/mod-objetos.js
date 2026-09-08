async function renderObjetos() {
  const vista = document.getElementById('vista');
  vista.innerHTML =
    '<div class="modulo-topbar">' +
      '<h2>Objetos olvidados</h2>' +
      (tienePermiso('objetos:write') ? '<button class="boton boton-chico" id="btn-nuevo-objeto">Nuevo</button>' : '') +
    '</div>' +
    '<div id="tabla-objetos"></div>';

  const columnas = [
    { campo: 'descripcion', etiqueta: 'Descripción' },
    { campo: 'lugar_hallazgo', etiqueta: 'Lugar' },
    { campo: 'fecha_hallazgo', etiqueta: 'Fecha hallazgo' },
    { campo: 'estado_entrega', etiqueta: 'Estado' },
    { campo: 'receptor_nombre', etiqueta: 'Entregado a' }
  ];

  let itemsActuales = [];

  async function cargar() {
    const data = await llamarConManejoDeErrores(llamarApi('objetos.list', {}));
    itemsActuales = data.items;
    renderTabla('tabla-objetos', columnas, itemsActuales, function (fila) {
      let html = '';
      if (tienePermiso('objetos:write') && fila.estado_entrega === 'pendiente') {
        html += '<button class="boton boton--secundario boton-chico" data-entregar="' + fila.id + '">Entregar</button> ';
      }
      if (tienePermiso('objetos:delete')) {
        html += '<button class="boton boton--secundario boton-chico" data-anular="' + fila.id + '">Anular</button>';
      }
      return html;
    });

    vista.querySelectorAll('[data-entregar]').forEach(function (btn) {
      btn.addEventListener('click', function () { abrirFormularioEntrega(btn.dataset.entregar); });
    });
    vista.querySelectorAll('[data-anular]').forEach(function (btn) {
      btn.addEventListener('click', async function () {
        if (!confirm('¿Anular este registro?')) return;
        await llamarConManejoDeErrores(llamarApi('objetos.anular', { id: btn.dataset.anular }), 'Registro anulado');
        cargar();
      });
    });
  }

  function abrirFormularioNuevo() {
    abrirModal('Nuevo objeto olvidado',
      '<form id="form-objeto">' +
        '<div class="campo"><label>Descripción</label><input type="text" name="descripcion" required></div>' +
        '<div class="campo"><label>Lugar donde se encontró</label><input type="text" name="lugar_hallazgo"></div>' +
        '<div class="campo"><label>Observaciones</label><input type="text" name="observaciones"></div>' +
        '<button type="submit" class="boton">Guardar</button>' +
      '</form>'
    );
    document.getElementById('form-objeto').addEventListener('submit', async function (ev) {
      ev.preventDefault();
      const payload = {
        descripcion: ev.target.descripcion.value,
        lugar_hallazgo: ev.target.lugar_hallazgo.value,
        observaciones: ev.target.observaciones.value
      };
      await llamarConManejoDeErrores(llamarApi('objetos.crear', payload), 'Registrado correctamente');
      cerrarModal();
      cargar();
    });
  }

  function abrirFormularioEntrega(objetoId) {
    abrirModal('Entregar objeto',
      '<form id="form-entrega">' +
        '<div class="campo"><label>Nombre de quien recibe</label><input type="text" name="receptor_nombre" required></div>' +
        '<div class="campo"><label>Documento de identidad</label><input type="text" name="receptor_doc" required></div>' +
        '<div class="campo"><label>Observaciones</label><input type="text" name="observaciones"></div>' +
        '<button type="submit" class="boton">Confirmar entrega</button>' +
      '</form>'
    );
    document.getElementById('form-entrega').addEventListener('submit', async function (ev) {
      ev.preventDefault();
      const payload = {
        objeto_id: objetoId,
        receptor_nombre: ev.target.receptor_nombre.value,
        receptor_doc: ev.target.receptor_doc.value,
        observaciones: ev.target.observaciones.value
      };
      await llamarConManejoDeErrores(llamarApi('objetos.entregar', payload), 'Entrega registrada');
      cerrarModal();
      cargar();
    });
  }

  if (document.getElementById('btn-nuevo-objeto')) {
    document.getElementById('btn-nuevo-objeto').addEventListener('click', abrirFormularioNuevo);
  }

  cargar();
}
