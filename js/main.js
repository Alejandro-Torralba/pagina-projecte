/* =============================================
   RETROGAMES — main.js
   Toda la lógica JavaScript de la web.
   Se ejecuta cuando el HTML ha cargado del todo.
============================================= */

/* --------------------------------------------------
   CREDENCIALES DE LOGIN
   Usuario y contraseña definidos aquí directamente
   en el código (hardcodeados). No hay base de datos.
-------------------------------------------------- */
let USUARIO_VALIDO  = 'gamer';
let PASSWORD_VALIDA = '1234';


/* ==================================================
   1. MENÚ HAMBURGUESA
   En pantallas pequeñas, el menú se oculta y aparece
   un botón (☰). Al pulsarlo, el menú se muestra o
   se esconde añadiendo/quitando la clase "open".
================================================== */
function initMenu() {
  let hamburger = document.querySelector('.hamburger'); // botón de las tres rayas
  let navLinks  = document.querySelector('.nav-links'); // la lista de enlaces del nav

  // Si alguno de los dos no existe en esta página, salimos
  if (!hamburger || !navLinks) return;

  // Al hacer clic en el botón, cambiamos la visibilidad del menú
  hamburger.addEventListener('click', function () {
    navLinks.classList.toggle('open'); // toggle: si tiene "open" lo quita, si no lo pone
  });

  // Al hacer clic en cualquier enlace del menú, lo cerramos
  // (útil en móvil para que no quede el menú abierto tras navegar)
  navLinks.querySelectorAll('a').forEach(function (enlace) {
    enlace.addEventListener('click', function () {
      navLinks.classList.remove('open');
    });
  });
}


/* ==================================================
   2. MARCAR ENLACE ACTIVO EN EL NAV
   Compara el nombre del fichero actual (ej: juegos.html)
   con el href de cada enlace del nav, y añade la clase
   "active" al que coincida para resaltarlo visualmente.
================================================== */
function marcarActivo() {
  // Obtenemos el nombre del fichero de la URL actual
  // pathname.split('/').pop() devuelve la última parte de la ruta, ej: "juegos.html"
  let pagina = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-links a').forEach(function (enlace) {
    if (enlace.getAttribute('href') === pagina) {
      enlace.classList.add('active'); // lo marcamos como activo
    }
  });
}


/* ==================================================
   3. COMPROBAR SI EL USUARIO ESTÁ LOGUEADO
   Miramos en localStorage si hay guardada la clave
   'rg_logueado' con el valor 'si'.
   localStorage es un almacén del navegador que persiste
   aunque cerremos la pestaña.
================================================== */
function estaLogueado() {
  return localStorage.getItem('rg_logueado') === 'si';
}


/* ==================================================
   4. ACTUALIZAR EL NAV SEGÚN ESTADO DE LOGIN
   Si el usuario está logueado:
     - Muestra el botón "Logout"
     - Oculta el enlace "Login"
     - Muestra la barra con el nombre del usuario
   Si NO está logueado, hace lo contrario.
================================================== */
function actualizarNav() {
  let logoutBtn = document.getElementById('nav-logout');
  let loginLink = document.getElementById('nav-login-link');
  let userBar   = document.querySelector('.user-bar');

  if (estaLogueado()) {
    // Mostramos logout y ocultamos el enlace de login
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
    if (loginLink) loginLink.style.display = 'none';

    // Mostramos la barra superior con el nombre guardado
    if (userBar) {
      let nombre = localStorage.getItem('rg_usuario') || USUARIO_VALIDO;
      userBar.innerHTML = '&#9654; Jugador conectado: <strong>' + nombre + '</strong>';
      userBar.style.display = 'block';
    }
  } else {
    // Ocultamos logout y mostramos el enlace de login
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (loginLink) loginLink.style.display = 'inline';
    if (userBar)   userBar.style.display   = 'none';
  }
}


/* ==================================================
   5. LÓGICA DEL FORMULARIO DE LOGIN
   Escucha el envío del formulario. Compara lo que
   escribió el usuario con las credenciales hardcodeadas.
   - Si coinciden: guarda en localStorage y redirige
   - Si no coinciden: muestra mensaje de error
================================================== */
function initLogin() {
  let form = document.getElementById('login-form');
  if (!form) return; // si no hay formulario de login en esta página, salimos

  // Si el usuario ya está logueado, redirigimos directamente al inicio
  if (estaLogueado()) {
    window.location.href = 'index.html';
    return;
  }

  // Escuchamos el evento "submit" (cuando se pulsa el botón de enviar)
  form.addEventListener('submit', function (e) {
    e.preventDefault(); // evitamos que la página se recargue (comportamiento por defecto)

    let usuario  = document.getElementById('login-user').value.trim();
    let password = document.getElementById('login-pass').value;
    let errorEl  = document.getElementById('login-error');

    // Comparamos con las credenciales válidas
    if (usuario === USUARIO_VALIDO && password === PASSWORD_VALIDA) {
      // Login correcto: guardamos en localStorage y vamos al inicio
      localStorage.setItem('rg_logueado', 'si');
      localStorage.setItem('rg_usuario', usuario);
      window.location.href = 'index.html';
    } else {
      // Login incorrecto: mostramos el error y borramos la contraseña
      errorEl.style.display = 'block';
      errorEl.textContent   = '[ ERROR ] Usuario o contraseña incorrectos';
      document.getElementById('login-pass').value = '';
    }
  });
}


/* ==================================================
   6. LÓGICA DEL BOTÓN LOGOUT
   Al hacer clic en "Logout", borramos los datos de
   localStorage y recargamos el nav.
================================================== */
function initLogout() {
  let logoutBtn = document.getElementById('nav-logout');
  if (!logoutBtn) return;

  logoutBtn.addEventListener('click', function () {
    localStorage.removeItem('rg_logueado'); // borramos el estado de sesión
    localStorage.removeItem('rg_usuario');  // borramos el nombre guardado
    actualizarNav();                        // actualizamos la barra de navegación
    window.location.href = 'index.html';   // volvemos al inicio
  });
}


/* ==================================================
   7. VALIDACIÓN DEL FORMULARIO DE CONTACTO
   Comprueba campo a campo que los datos son correctos
   antes de mostrar el mensaje de éxito.
   No envía nada a ningún servidor.
================================================== */
function initContacto() {
  let form = document.getElementById('contacto-form');
  if (!form) return; // si no hay formulario de contacto en esta página, salimos

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // evitamos recarga de página

    let valido = true; // flag: empezamos asumiendo que todo está bien

    /* — Validar nombre — */
    let nombre    = document.getElementById('c-nombre');
    let errNombre = document.getElementById('err-nombre');
    if (nombre.value.trim().length < 2) {
      // Nombre demasiado corto: mostramos error
      errNombre.style.display = 'block';
      errNombre.textContent   = 'El nombre debe tener al menos 2 caracteres';
      valido = false;
    } else {
      errNombre.style.display = 'none'; // ocultamos error si antes lo había
    }

    /* — Validar email — */
    let email    = document.getElementById('c-email');
    let errEmail = document.getElementById('err-email');
    // Expresión regular básica para comprobar formato de email
    let regexMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexMail.test(email.value.trim())) {
      errEmail.style.display = 'block';
      errEmail.textContent   = 'Introduce un email válido';
      valido = false;
    } else {
      errEmail.style.display = 'none';
    }

    /* — Validar mensaje — */
    let mensaje    = document.getElementById('c-mensaje');
    let errMensaje = document.getElementById('err-mensaje');
    if (mensaje.value.trim().length < 10) {
      errMensaje.style.display = 'block';
      errMensaje.textContent   = 'El mensaje debe tener al menos 10 caracteres';
      valido = false;
    } else {
      errMensaje.style.display = 'none';
    }

    /* — Si todo es válido — */
    if (valido) {
      form.reset(); // limpiamos el formulario

      // Mostramos mensaje de éxito y lo ocultamos a los 4 segundos
      let exito = document.getElementById('form-exito');
      exito.style.display = 'block';
      exito.textContent   = '[ OK ] ¡Mensaje enviado! Nos pondremos en contacto contigo.';
      setTimeout(function () {
        exito.style.display = 'none';
      }, 4000);
    }
  });
}


/* ==================================================
   8. EFECTO CURSOR PARPADEANTE
   Alterna la visibilidad de un elemento cada 500ms
   para simular el cursor típico de los juegos retro.
================================================== */
function initParpadeo() {
  let cursor = document.getElementById('cursor-parpadeo');
  if (!cursor) return;

  // setInterval ejecuta la función cada X milisegundos indefinidamente
  setInterval(function () {
    cursor.style.visibility =
      cursor.style.visibility === 'hidden' ? 'visible' : 'hidden';
  }, 500);
}


/* ==================================================
   9. CONTADOR ANIMADO DE JUEGOS
   Lee cuántas tarjetas (.card) hay en la página
   y cuenta desde 0 hasta ese número, actualizando
   el elemento #juegos-count en cada paso.
================================================== */
function initContador() {
  let el = document.getElementById('juegos-count');
  if (!el) return;

  let total = document.querySelectorAll('.card').length; // cuántas tarjetas hay
  let count = 0;

  // setInterval va incrementando el contador cada 80ms
  let interval = setInterval(function () {
    count++;
    el.textContent = count;
    if (count >= total) clearInterval(interval); // paramos cuando llegamos al total
  }, 80);
}


/* ==================================================
   ARRANQUE: se ejecuta cuando el DOM está listo
   DOMContentLoaded se dispara cuando el navegador
   ha leído todo el HTML (sin esperar imágenes, etc.)
================================================== */
document.addEventListener('DOMContentLoaded', function () {
  initMenu();       // activa el menú hamburguesa
  marcarActivo();   // resalta el enlace de la página actual
  actualizarNav();  // muestra login o logout según sesión
  initLogin();      // activa el formulario de login (si existe)
  initLogout();     // activa el botón de logout (si existe)
  initContacto();   // activa el formulario de contacto (si existe)
  initParpadeo();   // activa el cursor parpadeante (si existe)
  initContador();   // activa el contador de juegos (si existe)
});
