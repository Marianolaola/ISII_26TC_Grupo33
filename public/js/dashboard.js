
import * as api from './api.js';
import * as ui from './ui.js';
import { descargarComprobantePDF } from './pdf.js';





document.addEventListener('DOMContentLoaded', () => {
    // CONTROL DE SESIÓN
    const datosRaw = localStorage.getItem('usuarioBancario');
    if (!datosRaw) {
        window.location.href = '/index.html';
        return;
    }
    const usuario = JSON.parse(datosRaw);

    // RENDERIZADO INICIAL
    const etiquetaNombre = document.getElementById('nombre-usuario');
    if (etiquetaNombre) etiquetaNombre.innerText = `${usuario.nombre} ${usuario.apellido}`;
    
    // Sincronización inicial de saldo
    sincronizarSaldoReal(usuario.id_usuario);

    // --- LÓGICA DEL MENÚ LATERAL
    const linkExtracciones = document.getElementById('link-extracciones');
    const pantallaInicio = document.getElementById('pantalla-inicio');
    const pantallaExtraccion = document.getElementById('pantalla-extraccion');

    if (linkExtracciones) {
        linkExtracciones.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            // Le damos el estilo de "activo" al botón del menú
            document.querySelectorAll('.menu-link').forEach(link => link.classList.remove('activo'));
            linkExtracciones.classList.add('activo');

            // Ocultamos el mensaje de bienvenida y mostramos el formulario
            if (pantallaInicio) pantallaInicio.classList.add('d-none');
            if (pantallaExtraccion) pantallaExtraccion.classList.remove('d-none');
        });
    }

    // LÓGICA DE EXTRACCIÓN
    const formExtraccion = document.getElementById('form-extraccion');
    if (formExtraccion) {
        formExtraccion.addEventListener('submit', async (e) => {
            e.preventDefault();

            // CORRECCIÓN: parseFloat del input
            const montoAExtraer = parseFloat(document.getElementById('monto').value);
            
            // CORRECCIÓN: Chequeo de seguridad en localStorage
            const storage = JSON.parse(localStorage.getItem('usuarioBancario'));
            if (!storage) return window.location.href = '/index.html';
            
            const saldoActual = parseFloat(storage.saldo);

            // Validaciones locales básicas
            if (montoAExtraer > saldoActual) {
            return Swal.fire({ icon: 'error', title: 'Fondos insuficientes :(', text: `Tu saldo actual es de $${saldoActual}`});
}

            try {
                const resultado = await api.solicitarExtraccion(storage.id_usuario, montoAExtraer);
                
                if (resultado.ok) {
                    ui.mostrarResultadoExtraccion(resultado.datos.token);
                    // REUTILIZACIÓN: Actualizamos el saldo pidiendo la verdad al servidor
                    await sincronizarSaldoReal(storage.id_cliente);
                }
            } catch (error) {
                console.error("Motivo del error en extracción:", error);
                Swal.fire({ icon: 'warning', title: 'Error de conexión :/', text: 'Intente de nuevo más tarde' });
            }
        });
    }

    const btnDescargarPdf = document.getElementById('btn-descargar-pdf');
    if (btnDescargarPdf) {
    btnDescargarPdf.addEventListener('click', () => {
        // Solo llamamos a la función indicando qué queremos imprimir
        descargarComprobantePDF('comprobante-imprimir');
    });
}


});


// Función para evitar duplicación de lógica de saldo
async function sincronizarSaldoReal(id) {
    try {
        const datos = await api.obtenerSaldo(id);
        if (datos.ok) {
            const saldo = parseFloat(datos.saldo_real);
            ui.actualizarSaldoVisual(saldo);
            
            // Actualizamos la mochila del LocalStorage de forma segura
            const usuario = JSON.parse(localStorage.getItem('usuarioBancario'));
            if (usuario) {
                usuario.saldo = saldo;
                localStorage.setItem('usuarioBancario', JSON.stringify(usuario));
            }
        }
    } catch (err) {
        console.error("Fallo al sincronizar saldo:", err);
    }
}