function uuid() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function llamarApi(action, payload) {
  const body = {
    action: action,
    token: sessionStorage.getItem('token') || undefined,
    idem: uuid(),
    payload: payload || {}
  };

  let respuesta;
  try {
    respuesta = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body)
    });
  } catch (e) {
    throw { code: 'RED', msg: 'No se pudo conectar con el servidor' };
  }

  const json = await respuesta.json();

  if (!json.ok) {
    if (json.error.code === 'AUTH_EXPIRED' || json.error.code === 'AUTH_INVALID') {
      cerrarSesionLocal();
      if (!location.pathname.endsWith('index.html') && location.pathname !== '/') {
        location.href = 'index.html';
      }
    }
    throw json.error;
  }

  return json.data;
}

function cerrarSesionLocal() {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('usuario');
  sessionStorage.removeItem('permisos');
}
