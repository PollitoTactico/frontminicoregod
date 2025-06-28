"use client";
import { useState, useEffect } from "react";
import styles from "./ventas.module.css";

interface Vendedor {
  id: number;
  nombre: string;
  email: string;
}
interface Venta {
  id: number;
  vendedorId: number;
  fecha: string;
  monto: number;
}

const API_VENTAS = "https://minicoreapiservice20250623191317.azurewebsites.net/api/ventas";
const API_VENDEDORES = "https://minicoreapiservice20250623191317.azurewebsites.net/api/vendedores";

export default function VentasPage() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [vendedorId, setVendedorId] = useState<string>("");
  const [fecha, setFecha] = useState<string>("");
  const [monto, setMonto] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchVendedores = async () => {
    try {
      const res = await fetch(API_VENDEDORES);
      if (!res.ok) throw new Error("Error al obtener vendedores");
      const data: Vendedor[] = await res.json();
      setVendedores(data);
    } catch {
      setError("No se pudieron cargar los vendedores");
    }
  };

  // No hay endpoint GET para ventas, así que solo mostramos las ventas creadas en esta sesión
  useEffect(() => {
    fetchVendedores();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!vendedorId || !fecha || !monto) {
      setError("Todos los campos son obligatorios");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(API_VENTAS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendedorId: parseInt(vendedorId), fecha, monto: parseFloat(monto) }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Error al registrar venta");
      }
      const nuevaVenta: Venta = await res.json();
      setVentas([...ventas, nuevaVenta]);
      setVendedorId("");
      setFecha("");
      setMonto("");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["ventas-container"]}>
      <h1>Registrar Venta</h1>
      <form onSubmit={handleSubmit} className={styles["ventas-form"]}>
        <div>
          <label htmlFor="vendedor" className={styles["ventas-label"]}>Vendedor:</label>
          <select
            id="vendedor"
            className={styles["ventas-select"]}
            value={vendedorId}
            onChange={e => setVendedorId(e.target.value)}
            required
            title="Seleccione un vendedor"
          >
            <option value="">Seleccione un vendedor</option>
            {vendedores.map(v => (
              <option key={v.id} value={v.id}>{v.nombre} ({v.email})</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="fecha" className={styles["ventas-label"]}>Fecha:</label>
          <input
            id="fecha"
            className={styles["ventas-input"]}
            type="date"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
            required
            title="Fecha de la venta"
            placeholder="Seleccione la fecha"
          />
        </div>
        <div>
          <label htmlFor="monto" className={styles["ventas-label"]}>Monto:</label>
          <input
            id="monto"
            className={styles["ventas-input"]}
            type="number"
            min="0"
            step="0.01"
            value={monto}
            onChange={e => setMonto(e.target.value)}
            required
            title="Monto de la venta"
            placeholder="Monto de la venta"
          />
        </div>
        <button type="submit" className={styles["ventas-button"]} disabled={loading}>Registrar</button>
      </form>
      {error && <div className={styles["ventas-error"]}>{error}</div>}
      <h2>Ventas Registradas</h2>
      {ventas.length === 0 ? <p>No hay ventas registradas en esta sesión.</p> : (
        <ul>
          {ventas.map(v => (
            <li key={v.id}>Vendedor: {v.vendedorId} | Fecha: {v.fecha} | Monto: ${v.monto}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
