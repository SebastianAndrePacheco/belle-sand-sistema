const CONFIG_VENTAS = {
  modulo: 'ventas',
  titulo: 'Ventas de productos',
  permisoEscritura: 'ventas:write',
  permisoBorrado: 'ventas:delete',
  columnas: [
    { campo: 'producto_nombre', etiqueta: 'Producto' },
    { campo: 'cantidad', etiqueta: 'Cant.' },
    { campo: 'precio_unitario', etiqueta: 'P. unit. (S/)' },
    { campo: 'total', etiqueta: 'Total (S/)' },
    { campo: 'cliente_nombre', etiqueta: 'Cliente' },
    { campo: 'metodo_pago', etiqueta: 'Pago' }
  ],
  campos: [
    { nombre: 'producto_nombre', etiqueta: 'Producto', tipo: 'text', requerido: true },
    { nombre: 'cantidad', etiqueta: 'Cantidad', tipo: 'number', requerido: true },
    { nombre: 'precio_unitario', etiqueta: 'Precio unitario (S/)', tipo: 'number', requerido: true },
    { nombre: 'total', etiqueta: 'Total (S/)', tipo: 'number', requerido: true },
    { nombre: 'cliente_nombre', etiqueta: 'Cliente (opcional)', tipo: 'text', requerido: false },
    { nombre: 'metodo_pago', etiqueta: 'Método de pago', tipo: 'text', requerido: false }
  ]
};
