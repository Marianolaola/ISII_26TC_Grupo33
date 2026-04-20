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