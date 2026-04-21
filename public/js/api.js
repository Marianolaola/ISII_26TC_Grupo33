// api.js - Capa de comunicación con el backend

export async function obtenerSaldo(idUsuario) 
{
    const respuesta = await fetch(`/api/saldo/${idUsuario}`);
    
    //Chequeo de fetch si es incompleto
    if(!respuesta.ok)
    {
        throw new Error("Error al obtener el saldo del servidor");

    }
    return await respuesta.json();
}


export async function solicitarExtraccion(idUsuario, monto) {
    const respuesta = await fetch('/api/generar-extraccion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario: idUsuario, monto: monto })
    });

    if (!respuesta.ok) {
        throw new Error("Error en la solicitud de extracción");
    }
    return await respuesta.json();
}

export async function obtenerHistorialOrdenes(idUsuario) {
    const respuesta = await fetch(`/api/ordenes/${idUsuario}`);
    if (!respuesta.ok) throw new Error("Error al obtener el historial");
    return await respuesta.json();
}
