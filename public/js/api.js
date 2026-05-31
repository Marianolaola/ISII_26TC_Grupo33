// api.js - Capa de comunicación con el backend

export async function obtenerSaldo(idCliente) 
{
    const respuesta = await fetch(`/api/saldo/${idCliente}`);
    
    //Chequeo de fetch si es incompleto
    if(!respuesta.ok)
    {
        throw new Error("Error al obtener el saldo del servidor");

    }
    return await respuesta.json();
}


export async function solicitarExtraccion(idCliente, monto) {
    const respuesta = await fetch('/api/generar-extraccion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_cliente: idCliente, monto: monto })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudo generar la orden de extracción.");
    }

    return datos;
}

export async function obtenerHistorialOrdenes(idCliente) {
    const respuesta = await fetch(`/api/ordenes/${idCliente}`);

    if (!respuesta.ok) {
        throw new Error("Error al obtener el historial");
    }

    return await respuesta.json();
}

export async function cancelarOrdenApi(idOrden) {
    const respuesta = await fetch('/api/cancelar-orden', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_orden: idOrden })
    });

    if (!respuesta.ok) {
        throw new Error("Error al cancelar la orden");
    }
        
    return await respuesta.json();
}


// FUNCIONALIDAD 2 - TRANSFERENCIAS ------------------------------------------------------------------

export async function verificarDestinoTransferencia(cbuAliasDestino) {
    const respuesta = await fetch(`/api/transferencia/destino/${encodeURIComponent(cbuAliasDestino)}`);

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudo verificar la cuenta destino.");
    }

    return datos;
}


export async function realizarTransferencia(idCliente, cbuAliasDestino, monto, idConceptoMovimiento) {
    
    const respuesta = await fetch('/api/transferencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            id_cliente: idCliente,
            cbuAliasDestino,
            monto,
            id_concepto_movimiento: idConceptoMovimiento
        })
    });

    const datos = await respuesta.json();

    if(!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudo realizar la transferencia.");   
    }

    return datos;

}

export async function obtenerConceptosTransferencia() {
    const respuesta = await fetch('/api/conceptos'); 
    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || "Error al cargar los conceptos");
    }

    return datos.conceptos;
}

// CONTACTOS -------------------------------------------------------------------------------------------

export async function agendarContacto(idCliente, cbuDestinatario, nombreContacto) {
    const respuesta = await fetch('/api/contactos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id_cliente: idCliente,
            cbu_destinatario: cbuDestinatario,
            nombre_contacto: nombreContacto
        })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudo agendar el contacto.");
    }

    return datos;
}

export async function obtenerContactos(idCliente) {
    const respuesta = await fetch(`/api/clientes/${idCliente}/contactos`);

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudieron obtener los contactos.");
    }

    return datos;
}

//MOVIMIENTOS--------------------------------------------------------------------------------------------

export async function obtenerHistorialMovimientos(idCliente) {
    const respuesta = await fetch(`/api/clientes/${idCliente}/movimientos`);
    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || "Error al cargar los movimientos");
    }

    return datos;
}

