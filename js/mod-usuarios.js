async function renderUsuarios() {
  const vista = document.getElementById('vista');
  vista.innerHTML =
    '<div class="modulo-topbar">' +
      '<h2>Usuarios</h2>' +
      (tienePermiso('usuarios:write') ? '<button class="boton boton-chico" id="btn-nuevo-usuario">Nuevo</button>' : '') +
    '</div>' +
    '<div id="tabla-usuarios"></div>';

  const columnas = [
    { campo: 'usuario', etiqueta: 'Usuario' },
    { campo: 'nombres', etiqueta: 'Nombres' },
    { campo: 'apellidos', etiqueta: 'Apellidos' },
    { campo: 'cargo', etiqueta: 'Cargo' },
    { campo: 'activo', etiqueta: 'Activo' }
  ];

  let roles = [];

  async function cargarRoles() {
    const data = await llamarConManejoDeErrores(llamarApi('roles.list', {}));
    roles = data.items.filter(function (r) { return esVerdaderoFrontend(r.activo); });
  }

  function esVerdaderoFrontend(v) { return v === true || v === 'TRUE' || v === 'true'; }

  async function cargar() {
    const data = await llamarConManejoDeErrores(llamarApi('usuarios.list', {}));
    renderTabla('tabla-usuarios', columnas, data.items, function (fila) {
      if (!tienePermiso('usuarios:write')) return '';
      const accion = esVerdaderoFrontend(fila.activo) ? 'desactivar' : 'activar';
      return '<button class="boton boton--secundario boton-chico" data-toggle="' + fila.id + '" data-estado="' + fila.activo + '">' + accion + '</button>';
    });

    vista.querySelectorAll('[data-toggle]').forEach(function (btn) {
      btn.addEventListener('click', async function () {
        const nuevoEstado = esVerdaderoFrontend(btn.dataset.estado) ? 'FALSE' : 'TRUE';
        await llamarConManejoDeErrores(llamarApi('usuarios.editar', { id: btn.dataset.toggle, activo: nuevoEstado }), 'Usuario actualizado');
        cargar();
      });
    });
  }

  function abrirFormularioNuevo() {
    const opcionesRoles = roles.map(function (r) { return '<option value="' + r.id + '">' + r.nombre + '</option>'; }).join('');
    abrirModal('Nuevo usuario',
      '<form id="form-usuario">' +
        '<div class="campo"><label>Usuario (para ingresar)</label><input type="text" name="usuario" required></div>' +
        '<div class="campo"><label>Nombres</label><input type="text" name="nombres" required></div>' +
        '<div class="campo"><label>Apellidos</label><input type="text" name="apellidos"></div>' +
        '<div class="campo"><label>Cargo</label><input type="text" name="cargo"></div>' +
        '<div class="campo"><label>Rol</label><select name="rol_id" required>' + opcionesRoles + '</select></div>' +
        '<button type="submit" class="boton">Crear</button>' +
      '</form>'
    );
    document.getElementById('form-usuario').addEventListener('submit', async function (ev) {
      ev.preventDefault();
      const payload = {
        usuario: ev.target.usuario.value,
        nombres: ev.target.nombres.value,
        apellidos: ev.target.apellidos.value,
        cargo: ev.target.cargo.value,
        rol_id: ev.target.rol_id.value
      };
      const data = await llamarConManejoDeErrores(llamarApi('usuarios.crear', payload), 'Usuario creado');
      cerrarModal();
      cargar();
      abrirModal('PIN temporal generado', '<p>Usuario: <strong>' + payload.usuario + '</strong></p><p>PIN temporal: <strong>' + data.pin_temporal + '</strong></p><p>Debe cambiarlo en su primer ingreso.</p>');
    });
  }

  await cargarRoles();
  if (document.getElementById('btn-nuevo-usuario')) {
    document.getElementById('btn-nuevo-usuario').addEventListener('click', abrirFormularioNuevo);
  }
  cargar();
}
