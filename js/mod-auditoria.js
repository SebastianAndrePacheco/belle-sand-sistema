async function renderAuditoria() {
  const vista = document.getElementById('vista');
  vista.innerHTML = '<div class="modulo-topbar"><h2>Auditoría</h2></div><div id="tabla-auditoria"></div>';

  const columnas = [
    { campo: 'ts', etiqueta: 'Fecha' },
    { campo: 'modulo', etiqueta: 'Módulo' },
    { campo: 'accion', etiqueta: 'Acción' },
    { campo: 'resultado', etiqueta: 'Resultado' },
    { campo: 'detalle_error', etiqueta: 'Error' }
  ];

  const data = await llamarConManejoDeErrores(llamarApi('auditoria.list', {}));
  const ordenados = data.items.slice().sort(function (a, b) { return b.ts.localeCompare(a.ts); });
  renderTabla('tabla-auditoria', columnas, ordenados);
}
