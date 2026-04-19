document.addEventListener('DOMContentLoaded', () => {

// --- LÓGICA DEL LOGIN ---    
    
    // Capturamos el formulario del login por su ID (form-login)
    const formLogin = document.getElementById('form-login');

    // Si estamos en la página del login, activamos esta lógica
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            
            // 1. Evitamos que la página parpadee o se recargue al hacer clic
            e.preventDefault(); 

            // 2. Extraemos lo que escribió el usuario
            const emailUsuario = document.getElementById('email').value;
            const passUsuario = document.getElementById('password').value;

            try {
                // 3. Hacemos el pedido al Backend para validar las credenciales
                const respuesta = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' // Le avisamos que mandamos JSON
                    },
                    // Empaquetamos los datos
                    body: JSON.stringify({ email: emailUsuario, password: passUsuario }) 
                });

                // 4. Desempaquetamos lo que nos responde el servidor
                const datos = await respuesta.json();

                // 5. Tomamos decisiones según el resultado
                if (respuesta.ok) {
                    // Caso de éxito
                    alert('¡Ingreso exitoso!');

                    // Guardamos el usuario en el Local Storage para usarlo en otras páginas
                    localStorage.setItem('usuarioBancario', JSON.stringify(datos.usuario));

                    // Mostramos el mensaje de bienvenida que configuró Marian en el backend
                    alert(datos.mensaje);
                    
                    // Acá lo mandamos a la siguiente pantalla
                    window.location.href = '/dashboard.html'; 
                } else {
                    // Caso de error: mostramos el mensaje de error que configuró Marian en el backend
                    alert('Error: ' + (datos.mensaje || 'Credenciales inválidas')); 
                }

            } catch (error) {
                // Si el servidor está apagado o hay un problema de red
                console.error('Problema de conexión:', error);
                alert('No se pudo conectar con el servidor en este momento.');
            }
        });
    }

// --- LÓGICA DEL MENÚ LATERAL DEL DASHBOARD ---

    // Elementos de la interfaz
    const linkExtracciones = document.getElementById('link-extracciones');
    const pantallaInicio = document.getElementById('pantalla-inicio');
    const pantallaExtraccion = document.getElementById('pantalla-extraccion');

    // Paso 1: El cliente selecciona generar orden de extracción
    if (linkExtracciones) {
        linkExtracciones.addEventListener('click', (e) => {
            e.preventDefault(); // Evita que la página salte hacia arriba
            
            // Le damos el estilo de "activo" al botón del menú
            document.querySelectorAll('.menu-link').forEach(link => link.classList.remove('activo'));
            linkExtracciones.classList.add('activo');

            // Ocultamos el mensaje de bienvenida
            pantallaInicio.classList.add('d-none');
            
            // Paso 2: El sistema muestra el formulario
            pantallaExtraccion.classList.remove('d-none');
        });
    }

// --- USAMOS EL LOCAL STORAGE DEL USUARIO LOGUEADO EN LA LÓGICA DEL LOGIN PARA LUEGO APLICAR EL NOMBRE DEL CLIENTE A LA PÁGINA ---

    const datosGuardados = localStorage.getItem('usuarioBancario');

        // Si no hay nada, es porque no se logueó, así que lo mandamos de vuelta al inicio
        if (!datosGuardados) {
            window.location.href = '/index.html';
            return;
        }

        // Convertimos el texto guardado de nuevo en un objeto de JS
        const usuario = JSON.parse(datosGuardados);

        // Buscamos el ID que puesto en el HTML y le ponemos el nombre que trajo el Back
        const etiquetaNombre = document.getElementById('nombre-usuario');
        if (etiquetaNombre) {
            // Usamos el campo nombre y apellido de la tabla cliente (ver el modelo Usuario.js donde se hace el join correspondiente)
            etiquetaNombre.innerText = `${usuario.nombre} ${usuario.apellido}`;
        }
    });