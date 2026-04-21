// ui.js - Manejo de la interfaz

const formatearMoneda = (valor) =>
{
    return new Intl.NumberFormat('es-AR', 
        {
            style: 'currency',
            currency: 'ARS',
        }).format(valor);
};


export function actualizarSaldoVisual(monto) {
    const etiquetaSaldo = document.getElementById('saldo-disponible');
    if (etiquetaSaldo) {
        etiquetaSaldo.innerText = formatearMoneda(monto);
    }
}

export function mostrarResultadoExtraccion(token) {
    document.getElementById('form-extraccion').classList.add('d-none');
    document.getElementById('resultado-extraccion').classList.remove('d-none');
    document.getElementById('token-mostrado').innerText = token;
}

export function renderizarTablaOrdenes(ordenes) {
    const cuerpo = document.getElementById('tabla-ordenes-cuerpo');
    if (!cuerpo) return;

    cuerpo.innerHTML = '';

    // --- DICCIONARIO DE COLORES SEGÚN ESTADO ---
    const coloresEstado = {
        'Pendiente': 'bg-warning',    // Amarillo
        'Completada': 'bg-success',   // Verde
        'Vencida': 'bg-secondary',    // Gris
        'Cancelada': 'bg-danger'      // Rojo
    };

    ordenes.forEach(orden => {
        const fecha = new Date(orden.fecha_generacion).toLocaleDateString('es-AR');
        
        // Buscamos el color en el diccionario. Si el estado no existe ahí, coloca un gris oscuro
        const claseColor = coloresEstado[orden.estado] || 'bg-dark';
        
        cuerpo.innerHTML += `
            <tr>
                <td>${fecha}</td>
                <td class="fw-bold">${formatearMoneda(orden.monto)}</td>
                <td><code class="fs-6">${orden.token}</code></td>
                <td>
                    <span class="badge ${claseColor}">
                        ${orden.estado}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-danger" onclick="cancelarOrden(${orden.id_orden})">
                        Cancelar
                    </button>
                </td>
            </tr>
        `;
    });
}