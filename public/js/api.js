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

    if (!respuesta.ok) {
        throw new Error("Error en la solicitud de extracción");
    }

    return await respuesta.json();
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
