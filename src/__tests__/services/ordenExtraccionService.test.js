const ordenExtraccionService = require("../../services/ordenExtraccionService");
const Cuenta = require("../../models/Cuenta");
const OrdenExtraccion = require("../../models/OrdenExtraccion");

describe("Pruebas unitarias - Contrato procesarSolicitudExtraccion(id_cliente, monto)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test("PU-01 - Debe generar una orden de extracción válida cuando el cliente tiene saldo suficiente", async () => {
    vi.spyOn(Cuenta, "verificarSaldoDisponible").mockResolvedValue({
      ok: true,
      cuenta: {
        id_cuenta: 1,
        saldo: 140000
      }
    });

    vi.spyOn(OrdenExtraccion, "generarToken").mockReturnValue("123456");

    vi.spyOn(OrdenExtraccion, "registrarOrdenDeExtraccion").mockResolvedValue(true);

    const resultado = await ordenExtraccionService.procesarSolicitudExtraccion(1, 10000);

    expect(resultado).toEqual({
      token: "123456",
      monto_solicitado: 10000,
      saldo_restante: 130000
    });

    expect(Cuenta.verificarSaldoDisponible).toHaveBeenCalledWith(1, 10000);
    expect(OrdenExtraccion.generarToken).toHaveBeenCalled();
    expect(OrdenExtraccion.registrarOrdenDeExtraccion).toHaveBeenCalledWith(
      1,
      10000,
      "123456"
    );
  });

  test("PU-02 - Debe rechazar una extracción con monto menor al mínimo permitido", async () => {
    const spySaldo = vi.spyOn(Cuenta, "verificarSaldoDisponible");

    await expect(
      ordenExtraccionService.procesarSolicitudExtraccion(1, 5000)
    ).rejects.toThrow("El monto mínimo de extracción es $10.000.");

    expect(spySaldo).not.toHaveBeenCalled();
  });

  test("PU-03 - Debe rechazar una extracción con monto no múltiplo de $10.000", async () => {
    const spySaldo = vi.spyOn(Cuenta, "verificarSaldoDisponible");

    await expect(
      ordenExtraccionService.procesarSolicitudExtraccion(1, 15000)
    ).rejects.toThrow("El monto debe ser múltiplo de $10.000.");

    expect(spySaldo).not.toHaveBeenCalled();
  });

  test("PU-04 - Debe rechazar una extracción con monto no numérico", async () => {
    const spySaldo = vi.spyOn(Cuenta, "verificarSaldoDisponible");

    await expect(
      ordenExtraccionService.procesarSolicitudExtraccion(1, "abc")
    ).rejects.toThrow("El monto ingresado no es válido.");

    expect(spySaldo).not.toHaveBeenCalled();
  });

  test("PU-05 - Debe rechazar una extracción cuando el cliente no tiene saldo suficiente", async () => {
    vi.spyOn(Cuenta, "verificarSaldoDisponible").mockResolvedValue({
      ok: false,
      mensaje: "Saldo insuficiente. Tu saldo actual es de $140000",
      cuenta: {
        id_cuenta: 1,
        saldo: 140000
      }
    });

    const spyRegistrar = vi.spyOn(OrdenExtraccion, "registrarOrdenDeExtraccion");

    await expect(
      ordenExtraccionService.procesarSolicitudExtraccion(1, 10000000000)
    ).rejects.toThrow("Saldo insuficiente. Tu saldo actual es de $140000");

    expect(Cuenta.verificarSaldoDisponible).toHaveBeenCalledWith(1, 10000000000);
    expect(spyRegistrar).not.toHaveBeenCalled();
  });

  test("PU-06 - Debe rechazar una extracción cuando el cliente no tiene cuenta bancaria asignada", async () => {
    vi.spyOn(Cuenta, "verificarSaldoDisponible").mockResolvedValue({
      ok: false,
      mensaje: "El cliente no tiene cuenta bancaria asignada."
    });

    const spyRegistrar = vi.spyOn(OrdenExtraccion, "registrarOrdenDeExtraccion");

    await expect(
      ordenExtraccionService.procesarSolicitudExtraccion(999, 10000)
    ).rejects.toThrow("El cliente no tiene cuenta bancaria asignada.");

    expect(Cuenta.verificarSaldoDisponible).toHaveBeenCalledWith(999, 10000);
    expect(spyRegistrar).not.toHaveBeenCalled();
  });
});