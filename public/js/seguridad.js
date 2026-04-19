document.addEventListener('DOMContentLoaded', () => {

        //--- LÓGICA DEL CIERRE DE SESIÓN ---

    const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');

    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', () => {
            // Vaciamos el local storage del navegador
            localStorage.removeItem('usuarioBancario');

            // Lo mandamos al index
            window.location.href = '/index.html';
        });
    }

});

//--- LÓGICA DE SEGURIDAD POR INACTIVIDAD ---

// Tiempo en milisegundos (ej: 3 minutos = 180000 ms)
let tiempoInactividad;

function reiniciarTiempo() {
    clearTimeout(tiempoInactividad);
    tiempoInactividad = setTimeout(async () => {
        await Swal.fire({
            icon: 'info',
            title: 'Sesión caducada',
            text: 'Por cuestiones de seguridad, tu sesión ha caducado por inactividad.',
            confirmButtonColor: '#0b5ed7',
            allowOutsideClick: false // Obliga a tocar el botón
        });
        localStorage.removeItem('usuarioBancario');
        window.location.href = '/index.html';
    }, 180000); // 3 minutos
}

// Escuchamos si el usuario hace algo en la pantalla
window.onload = reiniciarTiempo;
document.onmousemove = reiniciarTiempo;
document.onkeypress = reiniciarTiempo;