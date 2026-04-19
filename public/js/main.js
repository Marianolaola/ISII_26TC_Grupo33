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

// LÓGICA PARA MOSTRAR EL SALDO DEL CLIENTE EN EL DASHBOARD

    const etiquetaSaldo = document.getElementById('saldo-disponible');
    if (etiquetaSaldo && usuario.saldo !== undefined) {
        // Usamos Intl.NumberFormat para que ponga los puntos y comas de Argentina
        const saldoFormateado = new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(usuario.saldo);

        etiquetaSaldo.innerText = saldoFormateado;
    }
        
// --- LÓGICA DE EXTRACCIÓN (SIMULADA) ---
    const formExtraccion = document.getElementById('form-extraccion');
    
    if (formExtraccion) {
        formExtraccion.addEventListener('submit', async (e) => {
            e.preventDefault();

            // 1. Extraemos los datos
            const montoAExtraer = document.getElementById('monto').value;
            const usuarioGuardado = JSON.parse(localStorage.getItem('usuarioBancario'));

            // 2. Validaciones locales (solo funcionan si fallan las validaciones del HTML)
            if (montoAExtraer < 10000 || montoAExtraer % 10000 !== 0) {
                alert("Por favor, ingresá un monto múltiplo de $10.000");
                return;
            }

            // Cambiamos el texto del botón para que el usuario sepa que está pensando
            const btnSubmit = formExtraccion.querySelector('button[type="submit"]');
            const textoOriginal = btnSubmit.innerText;
            btnSubmit.innerText = "Generando código...";
            btnSubmit.disabled = true;

            try {
                /* =======================================================
                CUANDO EL BACK ESTE TERMINADO ESTE CÓDIGO ES EL QUE SE USARÁ PARA CONSUMIR LOS DATOS REALES
                =======================================================
                const respuesta = await fetch('/api/generar-extraccion', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        id_usuario: usuarioGuardado.id_cliente, 
                        monto: montoAExtraer 
                    })
                });
                const datos = await respuesta.json();
                */

                // =======================================================
                // MIENTRAS TANTO, USAMOS ESTE SIMULADOR:
                // =======================================================
                const datos = await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({
                            ok: true,
                            mensaje: "Orden generada",
                            token: Math.floor(100000 + Math.random() * 900000) // Genera un número de 6 cifras al azar
                        });
                    }, 1500); // Tarda 1.5 segundos simulando internet
                });

                // 3. Mostramos el resultado en la pantalla
                if (datos.ok) { // ACA SE CAMBIA POR: if (respuesta.ok)
                    
                    // Ocultamos el formulario
                    formExtraccion.classList.add('d-none');
                    
                    // Mostramos la caja del resultado
                    const divResultado = document.getElementById('resultado-extraccion');
                    const spanToken = document.getElementById('token-mostrado');
                    
                    spanToken.innerText = datos.token;
                    divResultado.classList.remove('d-none');
                    
                } else {
                    alert("Error: " + datos.mensaje);
                }

            } catch (error) {
                console.error("Error al procesar:", error);
                alert("Hubo un problema de conexión.");
            } finally {
                // Devolvemos el botón a la normalidad
                btnSubmit.innerText = textoOriginal;
                btnSubmit.disabled = false;
            }
        });
    }

});