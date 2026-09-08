async function iniciarSesion(usuario, pin) {
  const data = await llamarApi('auth.login', { usuario: usuario, pin: pin });
  sessionStorage.setItem('token', data.token);
  sessionStorage.setItem('usuario', JSON.stringify(data.usuario));
  sessionStorage.setItem('permisos', JSON.stringify(data.permisos));
  return data;
}

async function cerrarSesion() {
  try { await llamarApi('auth.logout', {}); } catch (e) { /* ignorar, igual limpiamos local */ }
  cerrarSesionLocal();
  location.href = 'index.html';
}

function exigirSesion() {
  if (!sessionStorage.getItem('token')) {
    location.href = 'index.html';
    return null;
  }
  return {
    usuario: JSON.parse(sessionStorage.getItem('usuario') || '{}'),
    permisos: JSON.parse(sessionStorage.getItem('permisos') || '[]')
  };
}

function tienePermiso(permiso) {
  const permisos = JSON.parse(sessionStorage.getItem('permisos') || '[]');
  return permisos.indexOf(permiso) !== -1;
}
