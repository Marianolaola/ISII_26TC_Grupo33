
import * as api from './api.js';
import * as ui from './ui.js';
import { descargarComprobantePDF } from './pdf.js';





document.addEventListener('DOMContentLoaded', () => {
    // CONTROL DE SESIÓN
    //Busca en el navegador si existe algun usuario guardado (usuarioBancario)
    const datosRaw = localStorage.getItem('usuarioBancario');
    if (!datosRaw) {
        //Si no existe, lo dirige al index
        window.location.href = '/index.html';
        return;
    }//Si existe lo convierte a objeto Java
    const usuario = JSON.parse(datosRaw);


    // RENDERIZADO INICIAL
    //Busca el elemento de HTML con id nombre-usuario

    const etiquetaNombre = document.getElementById('nombre-usuario');
    //Si existe, especializa nombre y apellido del user
    if (etiquetaNombre) etiquetaNombre.innerText = `${usuario.nombre} ${usuario.apellido}`;
    
    // Sincronización inicial de saldo
    sincronizarSaldoReal(usuario.id_cliente);
    // Carga del historial de órdenes generadas
    cargarHistorial(usuario.id_cliente);

    // --- LÓGICA DEL MENÚ LATERAL
    //Basicamente guarda referencias a elementos HTML
    const linkExtracciones = document.getElementById('link-extracciones');
    const linkTransferencias = document.getElementById('link-transferencias');


    const pantallaInicio = document.getElementById('pantalla-inicio');
    const pantallaExtraccion = document.getElementById('pantalla-extraccion');
    const pantallaTransferencia = document.getElementById('pantalla-transferencia');



    if (linkExtracciones) {
        linkExtracciones.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            // Le damos el estilo de "activo" al botón del menú
            document.querySelectorAll('.menu-link').forEach(link => link.classList.remove('activo'));
            linkExtracciones.classList.add('activo');

            // Ocultamos el mensaje de bienvenida y mostramos el formulario
            if (pantallaInicio) pantallaInicio.classList.add('d-none');
            if (pantallaExtraccion) pantallaExtraccion.classList.remove('d-none');
            if (pantallaTransferencia) pantallaTransferencia.classList.add('d-none');
        });
    }

    if (linkTransferencias) {
        linkTransferencias.addEventListener('click', (e) => {
            e.preventDefault();

            document.querySelectorAll('.menu-link').forEach(link => link.classList.remove('activo'));
            linkTransferencias.classList.add('activo');

            if(pantallaInicio) pantallaInicio.classList.add('d-none');
            if(pantallaExtraccion) pantallaExtraccion.classList.add('d-none');
            if(pantallaTransferencia) pantallaTransferencia.classList.remove('d-none');
        })
    }

    // LÓGICA DE EXTRACCIÓN
    //Busca formulario HTML
    const formExtraccion = document.getElementById('form-extraccion');
    //Ejecuta si existe el formulario
    if (formExtraccion) {
        formExtraccion.addEventListener('submit', async (e) => {
            e.preventDefault(); //evita que la pagina se recargue

            // CORRECCIÓN: parseFloat del input, sería texto sin parseFloat
            const montoAExtraer = parseFloat(document.getElementById('monto').value);
            // CORRECCIÓN: Chequeo de seguridad en localStorage, 
            // Recuerda los datos del usuario logueado
            const storage = JSON.parse(localStorage.getItem('usuarioBancario'));

            // Si no hay usuario, es dirigido al login
            if (!storage) return window.location.href = '/index.html';
            

            // Validaciones locales básicas

            // 1. Solo billetes de 10.000
            if (montoAExtraer < 10000 || montoAExtraer % 10000 !== 0) {
                return Swal.fire({ 
                    icon: 'warning', 
                    title: 'Monto inválido', 
                    text: 'Por favor, ingresá un monto mínimo de $10.000 y en billetes de $10.000.',
                    confirmButtonColor: '#0b5ed7'
                });
            }


            // --- CARTEL DE CONFIRMACIÓN ---
            const confirmacion = await Swal.fire({
                title: 'Generar Órden de Extracción',
                text: `¿Confirma generar una órden de extracción por $${montoAExtraer.toLocaleString('es-AR')}?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#0b5ed7',
                cancelButtonColor: '#dc3545',
                confirmButtonText: 'Sí',
                cancelButtonText: 'No'
            });

            // Si el cliente hace clic en "No" o cierra el cartel, cortamos la ejecución acá
            if (!confirmacion.isConfirmed) {
                return; 
            }
            // --- FIN DEL CARTEL DE CONFIRMACIÓN ---

            try {
                const resultado = await api.solicitarExtraccion(storage.id_cliente, montoAExtraer);
                
                if (resultado.ok) {
                    ui.mostrarResultadoExtraccion(resultado.datos.token, montoAExtraer);
                    
                    // REUTILIZACIÓN: Actualizamos el saldo pidiendo la verdad al servidor
                    await sincronizarSaldoReal(storage.id_cliente);
                    await cargarHistorial(storage.id_cliente);
                }
            } catch (error) {
                console.error("Motivo del error en extracción:", error);
                Swal.fire({ 
                    icon: 'warning', 
                    title: 'No se pudo generar la orden', 
                    text: error.message || 'Revisá los datos ingresados e intentá nuevamente',
                    confirmButtonColor: '#0b5ed7' });
            }
        });
    }

    // LOGICA DE TRANSFERENCIA

    const formTransferencia = document.getElementById('form-transferencia');

    if (formTransferencia) {
        formTransferencia.addEventListener('submit', async (e) => {
            e.preventDefault();

            const storage = JSON.parse(localStorage.getItem('usuarioBancario'));

            if (!storage) {
                return window.location.href = '/index.html';
            }

            const cbuAliasDestino = document.getElementById('destino-transferencia').value.trim();
            const montoTransferencia = parseFloat(document.getElementById('monto-transferencia').value);
            const idConceptoMovimiento = parseInt(document.getElementById('concepto-transferencia').value);

            if (!cbuAliasDestino || !montoTransferencia || !idConceptoMovimiento) {
                return Swal.fire({
                    icon: 'warning',
                    title: 'Datos incompletos',
                    text: 'Por favor, completá todos los campos para realizar la transferencia.',
                    confirmButtonColor: '#0b5ed7'
                });
            }

            if(montoTransferencia <= 0) {
                return Swal.fire({
                    icon: 'warning',
                    title: 'Monto inválido',
                    text: 'El monto debe ser mayor a cero.',
                    confirmButtonColor: '#0b5ed7'
                });
            }

            const confirmacion = await Swal.fire({
                title: 'Confirmar Transferencia',
                text: `¿Confirmás transferir $${montoTransferencia.toLocaleString('es-AR')} a ${cbuAliasDestino}?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#0b5ed7',
                cancelButtonColor: '#dc3545',
                confirmButtonText: 'Sí',
                cancelButtonText: 'No'
            });


            if(!confirmacion.isConfirmed) {
                return;
            }

            try{
                const resultado = await api.realizarTransferencia(
                    storage.id_cliente,
                    cbuAliasDestino,
                    montoTransferencia,
                    idConceptoMovimiento
                );

                if(resultado.ok) {
                    mostrarResultadoTransferencia(resultado.datos);

                    await sincronizarSaldoReal(storage.id_cliente);
                    
                    await Swal.fire({
                        icon: 'success',
                        title: 'Transferencia realizada con éxito',
                        text: resultado.mensaje,
                        confirmButtonColor: '#0b5ed7'
                    });
                }

            }catch (error) {
                console.error("Error en la transferencia:", error);

                Swal.fire({
                    icon: 'error',
                    title: 'No se pudo realizar la transferencia',
                    text: error.message || 'Revisá los datos ingresados e intentá nuevamente.',
                    confirmButtonColor: '#0b5ed7'
                })
            }
        });
    }

    // Función auxiliar
    async function cargarHistorial(id) {
        try {
            const res = await api.obtenerHistorialOrdenes(id);
            if (res.ok) ui.renderizarTablaOrdenes(res.ordenes);
        } catch (err) {
            console.error("Error al cargar historial:", err);
        }
    }

    function mostrarResultadoTransferencia(datos){
        const formTransferencia = document.getElementById('form-transferencia');
        const resultadoTransferencia = document.getElementById('resultado-transferencia');

        if (formTransferencia) formTransferencia.classList.add('d-none');
        if (resultadoTransferencia) resultadoTransferencia.classList.remove('d-none');

        const destino = datos.alias_destino || datos.cbu_destino || '---';

        document.getElementById('transferencia-destino').innerText = destino;
        doucment.getElementById('transferencia-monto').innerText = new Intl.NumberFormat('es-AR', {
            syle: 'currency',
            currency: 'ARS'
        }).format(datos.monto);

        document.getElementById('transferencia-concepto').innerText = datos.concepto || '---';
        
        document.getElementById('transferencia-fecha').innerText = new Date().toLocaleDateString('es-AR', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
    }

    const btnDescargarPdf = document.getElementById('btn-descargar-pdf');
    if (btnDescargarPdf) {
        btnDescargarPdf.addEventListener('click', () => {
            // Solo llamamos a la función indicando qué queremos imprimir
            descargarComprobantePDF('comprobante-imprimir');
        });
    }

    const btnDescargarTransferencia = document.getElementById('btn-descargar-transferencia-pdf');
    if(btnDescargarTransferencia) {
        btnDescargarTransferencia.addEventListener('click', () => {
            descargarComprobantePDF('comprobante-transferencia-imprimir');
        });
    }

    // --- LÓGICA DE CANCELACIÓN DE ORDEN (BAJA LÓGICA) ---
    window.cancelarOrden = async (idOrden) => {
        const confirmacion = await Swal.fire({
            title: '¿Cancelar orden?',
            text: "Esta orden quedará sin efecto.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí',
            cancelButtonText: 'No'
        });

        if (confirmacion.isConfirmed) {
            try {
                const res = await api.cancelarOrdenApi(idOrden);
                if (res.ok) {
                    await Swal.fire('Cancelada', 'La orden fue anulada con éxito.', 'success');
                    
                    // Recargamos el historial para ver el estado "Cancelada"
                    const storage = JSON.parse(localStorage.getItem('usuarioBancario'));
                    await cargarHistorial(storage.id_cliente);
                    await sincronizarSaldoReal(storage.id_cliente);
                }
            } catch (error) {
                Swal.fire('Error', 'No se pudo cancelar la orden.', 'error');
            }
        }
    };

});


// Función para evitar duplicación de lógica de saldo
async function sincronizarSaldoReal(id) {
    try {
        const datos = await api.obtenerSaldo(id);
        if (datos.ok) {
            const saldo = parseFloat(datos.saldo_real);
            ui.actualizarSaldoVisual(saldo);
        }
    } catch (err) {
        console.error("Fallo al sincronizar saldo:", err);
    }
}