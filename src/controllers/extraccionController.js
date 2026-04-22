const Cuenta = require('../models/Cuenta');

const generarOrden = async (req,res) => {

    const {id_usuario, monto} = req.body;

    if (!id_usuario || !monto){
        return res.status(400).json ({ok: false,
                                      mensaje :  "Datos faltante/Inválidos!!"})
    }
    try {
        console.log(`Llegó un pedido: Cliente ${id_usuario} quiere extraer $${monto}`);
        
        // hablamos con el modelo Cuenta
        const cuenta = await Cuenta.obtenerCuentaPorUsuario(id_usuario);

        if(!cuenta) {
            return res.status(400).json ({

                ok: false,
                mensaje : "Error: El usuario no tiene cuenta bancaria asignada."
            });
        }

        if (cuenta.saldo < monto) {
            return res.status(400).json ({
                ok: false,
                mensaje: `Saldo insuficiente. Tu saldo actual es de $${cuenta.saldo}`
            });
        }

        //Generamos Token Randomizado
        const token = Math.floor(100000 + Math.random() * 900000).toString();

        //Congelamos la plata y guardar la orden
        //Le pasamos el id_cuenta que se saca en la validacion anterior
        await Cuenta.registrarOrdenDeExtracción(cuenta.id_cuenta, monto,token);

        //Enviamos el token para armar el comprobante en pantalla

        res.json({
            ok: true,
            mensaje: "¡Hay fondos suficientes Extraccion generada con Éxito :)",
            datos: {
                token: token,
                monto_solicitado : monto,
                saldo_restante: cuenta.saldo - monto
            }
        });

    }catch (error) {
        console.error("Ups, hubo un problemita (grave) en la basesita de datos", error);
        res.status(500).json({ ok: false, 
                               mensaje: 'Error interno del server :/ ' });

    }

}


const consultarSaldo = async (req,res) => {
    try{
        //Sacamos el ID wue viene en la URL
        const id_usuario = req.params.id;

        if (!id_usuario || isNaN(id_usuario))
        {
            return res.status(400).json ({ok: false, mensaje: "ID de usuario inválido"});
        }
        
        //Llamamos al modelo para buscar la cuenta
        const cuentaUsuario = await Cuenta.obtenerCuentaPorUsuario(id_usuario);

        // Verificamos si la cuenta existe antes de intentar acceder a su saldo
        if (!cuentaUsuario) {
            return res.status(404).json({ ok: false, mensaje: "Cuenta no encontrada" });
        }

        res.json({
            ok: true,
            saldo_real: cuentaUsuario.saldo
        });
    
    }catch (error){
        console.error("Error al consultar saldo:", error);
        res.status(500).json({ ok: false, mensaje: "Error interno al consultar el saldo" });
    }

}

const listarOrdenes = async (req, res) => {
    try {
        const id_usuario = req.params.id;
        // Llamamos al modelo para traer las órdenes
        const ordenes = await Cuenta.obtenerOrdenesPorUsuario(id_usuario);
        
        res.json({
            ok: true,
            ordenes: ordenes
        });
    } catch (error) {
        console.error("Error al listar órdenes:", error);
        res.status(500).json({ ok: false, mensaje: "Error al recuperar el historial" });
    }
};

const cancelarOrden = async (req, res) => {
    try {
        const { id_orden } = req.body;
        
        await Cuenta.cancelarOrdenYDevolverPlata(id_orden);
        
        res.json({ ok: true, mensaje: "Orden cancelada y dinero devuelto al saldo." });
    } catch (error) {
        console.error("Error al cancelar:", error);
        res.status(500).json({ ok: false, mensaje: "No se pudo cancelar la orden." });
    }
};

module.exports = {
    generarOrden,
    consultarSaldo,
    listarOrdenes,
    cancelarOrden
};