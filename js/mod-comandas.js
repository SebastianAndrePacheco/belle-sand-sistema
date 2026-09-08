const CONFIG_COMANDAS = {
  modulo: 'comandas',
  titulo: 'Comandas',
  permisoEscritura: 'comandas:write',
  permisoBorrado: 'comandas:delete',
  columnas: [
    { campo: 'numero_mesa', etiqueta: 'Mesa' },
    { campo: 'total', etiqueta: 'Total (S/)' },
    { campo: 'observaciones', etiqueta: 'Observaciones' },
    { campo: 'estado', etiqueta: 'Estado' }
  ],
  campos: [
    { nombre: 'numero_mesa', etiqueta: 'Número de mesa', tipo: 'text', requerido: true },
    { nombre: 'total', etiqueta: 'Total (S/)', tipo: 'number', requerido: true },
    { nombre: 'observaciones', etiqueta: 'Observaciones', tipo: 'text', requerido: false }
  ]
};
