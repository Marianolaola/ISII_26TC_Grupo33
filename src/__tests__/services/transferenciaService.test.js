const transferenciaService = require("../../services/transferenciaService");
const Movimiento = require("../../models/Movimiento");
const Cuenta = require("../../models/Cuenta");
const db = require("../../config/db");

describe("Pruebas unitarias - Contrato realizarTransferencia(id_cliente, cbuAliasDestino, monto, id_concepto_movimiento)", () => {
  let conexionMock;

  beforeEach(() => {
    vi.restoreAllMocks();

    conexionMock = {
      beginTransaction: vi.fn().mockResolvedValue(true),
      commit: vi.fn().mockResolvedValue(true),
      rollback: vi.fn().mockResolvedValue(true),
      release: vi.fn()
    };
  });

  test("PU-07 - Debe realizar una transferencia válida cuando todos los datos son correctos", async () => {
    vi.spyOn(Movimiento, "validarConceptoMovimiento").mockResolvedValue({
      ok: true,
      concepto: {
        id_concepto_movimiento: 8,
        nombre: "Varios"
      }
    });

    vi.spyOn(Cuenta, "verificarSaldoDisponible").mockResolvedValue({
      ok: true,
      cuenta: {
        id_cuenta: 1,
        id_cliente: 1,
        saldo: 140000
      }
    });

    vi.spyOn(Cuenta, "verificarCuentaDestino").mockResolvedValue({
      ok: true,
      cuentaDestino: {
        id_cuenta: 2,
        id_cliente: 2,
        cbu: "098765432109876543218",
        alias: "matiasgon",
        saldo: 50000
      }
    });

    vi.spyOn(db, "getConnection").mockResolvedValue(conexionMock);
    vi.spyOn(Cuenta, "debitarSaldo").mockResolvedValue(true);
    vi.spyOn(Cuenta, "acreditarSaldo").mockResolvedValue(true);
    vi.spyOn(Movimiento, "registrarMovimientoTransferencia").mockResolvedValue(true);

    const resultado = await transferenciaService.realizarTransferencia(
      1,
      "matiasgon",
      1000,
      8
    );

    expect(resultado).toEqual({
      id_cuenta_origen: 1,
      id_cuenta_destino: 2,
      cbu_destino: "098765432109876543218",
      alias_destino: "matiasgon",
      monto: 1000,
      concepto: "Varios",
      saldo_restante: 139000
    });

    expect(Movimiento.validarConceptoMovimiento).toHaveBeenCalledWith(8);
    expect(Cuenta.verificarSaldoDisponible).toHaveBeenCalledWith(1, 1000);
    expect(Cuenta.verificarCuentaDestino).toHaveBeenCalledWith("matiasgon");

    expect(conexionMock.beginTransaction).toHaveBeenCalled();
    expect(Cuenta.debitarSaldo).toHaveBeenCalledWith(1, 1000, conexionMock);
    expect(Cuenta.acreditarSaldo).toHaveBeenCalledWith(2, 1000, conexionMock);
    expect(Movimiento.registrarMovimientoTransferencia).toHaveBeenCalledWith(
      1,
      2,
      1000,
      8,
      conexionMock
    );
    expect(conexionMock.commit).toHaveBeenCalled();
    expect(conexionMock.release).toHaveBeenCalled();
  });

  test("PU-08 - Debe rechazar una transferencia con monto negativo", async () => {
    const spyConcepto = vi.spyOn(Movimiento, "validarConceptoMovimiento");

    await expect(
      transferenciaService.realizarTransferencia(1, "matiasgon", -500, 8)
    ).rejects.toThrow("El monto debe ser mayor a cero.");

    expect(spyConcepto).not.toHaveBeenCalled();
  });

  test("PU-09 - Debe rechazar una transferencia con monto no numérico", async () => {
    const spyConcepto = vi.spyOn(Movimiento, "validarConceptoMovimiento");

    await expect(
      transferenciaService.realizarTransferencia(1, "matiasgon", "abc", 8)
    ).rejects.toThrow("El monto ingresado no es válido");

    expect(spyConcepto).not.toHaveBeenCalled();
  });

  test("PU-10 - Debe rechazar una transferencia con concepto inexistente", async () => {
    vi.spyOn(Movimiento, "validarConceptoMovimiento").mockResolvedValue({
      ok: false,
      mensaje: "El concepto seleccionado no es válido."
    });

    const spySaldo = vi.spyOn(Cuenta, "verificarSaldoDisponible");
    const spyDestino = vi.spyOn(Cuenta, "verificarCuentaDestino");

    await expect(
      transferenciaService.realizarTransferencia(1, "matiasgon", 1000, 999)
    ).rejects.toThrow("El concepto seleccionado no es válido.");

    expect(Movimiento.validarConceptoMovimiento).toHaveBeenCalledWith(999);
    expect(spySaldo).not.toHaveBeenCalled();
    expect(spyDestino).not.toHaveBeenCalled();
  });

  test("PU-11 - Debe rechazar una transferencia cuando la cuenta destino no existe", async () => {
    vi.spyOn(Movimiento, "validarConceptoMovimiento").mockResolvedValue({
      ok: true,
      concepto: {
        id_concepto_movimiento: 8,
        nombre: "Varios"
      }
    });

    vi.spyOn(Cuenta, "verificarSaldoDisponible").mockResolvedValue({
      ok: true,
      cuenta: {
        id_cuenta: 1,
        id_cliente: 1,
        saldo: 140000
      }
    });

    vi.spyOn(Cuenta, "verificarCuentaDestino").mockResolvedValue({
      ok: false,
      mensaje: "La cuenta de destino no existe."
    });

    const spyConexion = vi.spyOn(db, "getConnection");

    await expect(
      transferenciaService.realizarTransferencia(1, "alias.inexistente", 1000, 8)
    ).rejects.toThrow("La cuenta de destino no existe.");

    expect(Cuenta.verificarSaldoDisponible).toHaveBeenCalledWith(1, 1000);
    expect(Cuenta.verificarCuentaDestino).toHaveBeenCalledWith("alias.inexistente");
    expect(spyConexion).not.toHaveBeenCalled();
  });

  test("PU-12 - Debe rechazar una transferencia cuando el cliente no tiene saldo suficiente", async () => {
    vi.spyOn(Movimiento, "validarConceptoMovimiento").mockResolvedValue({
      ok: true,
      concepto: {
        id_concepto_movimiento: 8,
        nombre: "Varios"
      }
    });

    vi.spyOn(Cuenta, "verificarSaldoDisponible").mockResolvedValue({
      ok: false,
      mensaje: "Saldo insuficiente. Tu saldo actual es de $140000"
    });

    const spyDestino = vi.spyOn(Cuenta, "verificarCuentaDestino");
    const spyConexion = vi.spyOn(db, "getConnection");

    await expect(
      transferenciaService.realizarTransferencia(1, "matiasgon", 10000000000, 8)
    ).rejects.toThrow("Saldo insuficiente. Tu saldo actual es de $140000");

    expect(Cuenta.verificarSaldoDisponible).toHaveBeenCalledWith(1, 10000000000);
    expect(spyDestino).not.toHaveBeenCalled();
    expect(spyConexion).not.toHaveBeenCalled();
  });

  test("PU-13 - Debe rechazar una transferencia a la propia cuenta del cliente", async () => {
    vi.spyOn(Movimiento, "validarConceptoMovimiento").mockResolvedValue({
      ok: true,
      concepto: {
        id_concepto_movimiento: 8,
        nombre: "Varios"
      }
    });

    vi.spyOn(Cuenta, "verificarSaldoDisponible").mockResolvedValue({
      ok: true,
      cuenta: {
        id_cuenta: 1,
        id_cliente: 1,
        saldo: 140000
      }
    });

    vi.spyOn(Cuenta, "verificarCuentaDestino").mockResolvedValue({
      ok: true,
      cuentaDestino: {
        id_cuenta: 1,
        id_cliente: 1,
        cbu: "1234567890123456789012",
        alias: "marianolaola",
        saldo: 140000
      }
    });

    const spyConexion = vi.spyOn(db, "getConnection");

    await expect(
      transferenciaService.realizarTransferencia(1, "marianolaola", 1000, 8)
    ).rejects.toThrow("No podés transferirte dinero a tu propia cuenta.");

    expect(Cuenta.verificarSaldoDisponible).toHaveBeenCalledWith(1, 1000);
    expect(Cuenta.verificarCuentaDestino).toHaveBeenCalledWith("marianolaola");
    expect(spyConexion).not.toHaveBeenCalled();
  });
});