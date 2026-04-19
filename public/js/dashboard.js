document.addEventListener('DOMContentLoaded', () => {

    // --- CONTROL DE SESIÓN EN DASHBOARD ---
    const datosGuardados = localStorage.getItem('usuarioBancario');

    // Si no hay nada, es porque no se logueó o cerró sesión. Lo mandamos al inicio.
    if (!datosGuardados) {
        window.location.href = '/index.html';
        return;
    }

    // Convertimos el texto guardado en objeto
    const usuario = JSON.parse(datosGuardados);

    // Pintamos el nombre del cliente
    const etiquetaNombre = document.getElementById('nombre-usuario');
    if (etiquetaNombre) {
        etiquetaNombre.innerText = `${usuario.nombre} ${usuario.apellido}`;
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
        
// --- LÓGICA DE EXTRACCIÓN ---
    const formExtraccion = document.getElementById('form-extraccion');
    
    if (formExtraccion) {
        formExtraccion.addEventListener('submit', async (e) => {
            e.preventDefault();

            // 1. Extraemos los datos del monto que ingresa el cliente y los datos del cliente logueado y su saldo actual
            const montoAExtraer = document.getElementById('monto').value;
            const usuarioGuardado = JSON.parse(localStorage.getItem('usuarioBancario'));
            const saldoActual = parseFloat(usuarioGuardado.saldo);

            // 2. Validaciones locales (solo funcionan si fallan las validaciones del HTML)
            // Monto múltiplo de 10.000 y mayor a 10.000
            if (montoAExtraer < 10000 || montoAExtraer % 10000 !== 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Monto inválido',
                    text: 'Por favor, ingresá un monto mínimo de $10.000 y en billetes de $10.000.',
                    confirmButtonColor: '#0b5ed7'
                });
                return;
            }
            // Monto a extraer debe ser menor o igual al saldo actual
            if (montoAExtraer > saldoActual) {
                // Usamos toLocaleString para que el mensaje muestre el punto de los miles
                Swal.fire({
                    icon: 'error',
                    title: 'Fondos insuficientes',
                    text: `El monto supera tu saldo disponible de $${saldoActual.toLocaleString('es-AR')}.`,
                    confirmButtonColor: '#0b5ed7'
                });
                return; // El return hace que el código corte acá y no avance hacia el fetch
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
                // =======================================================
                // ACÁ TERMINA EL SIMULADOR
                // =======================================================

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
                    Swal.fire({
                        icon: 'error',
                        title: 'Error en la operación',
                        text: datos.mensaje,
                        confirmButtonColor: '#0b5ed7'
                    });
                }

            } catch (error) {
                console.error("Error al procesar:", error);
                Swal.fire({
                    icon: 'warning',
                    title: 'Problema de conexión',
                    text: 'No se pudo procesar la solicitud en este momento. Intentá de nuevo más tarde.',
                    confirmButtonColor: '#0b5ed7'
                });
            } finally {
                // Devolvemos el botón a la normalidad
                btnSubmit.innerText = textoOriginal;
                btnSubmit.disabled = false;
            }
        });
    }

// --- LÓGICA DEL PDF ---
    const btnDescargarPdf = document.getElementById('btn-descargar-pdf');
    
    if (btnDescargarPdf) {
        btnDescargarPdf.addEventListener('click', () => {
            // 1. Agarramos el elemento HTML que queremos convertir a PDF
            const elementoComprobante = document.getElementById('comprobante-imprimir');

            // 2. Configuramos cómo queremos que salga el PDF
            const opciones = {
                margin:       1,
                filename:     'comprobante_extraccion.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2 },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            // 3. Le decimos a la librería que haga el trabajo
            html2pdf().set(opciones).from(elementoComprobante).save();
        });
    }

});