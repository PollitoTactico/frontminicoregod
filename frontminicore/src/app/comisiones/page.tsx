"use client";
import { useState, useEffect } from "react";
import styles from "./comisiones.module.css";

const API_COMISION = "https://minicoreapiservice20250623191317.azurewebsites.net/api/comisiones/calcular";
const API_VENDEDORES = "https://minicoreapiservice20250623191317.azurewebsites.net/api/vendedores";

// Tipos explícitos para vendedor y resultado
interface Vendedor {
  id: number;
  nombre: string;
  email: string;
}

export default function ComisionesPage() {
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [vendedorId, setVendedorId] = useState<string>("");
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [resultado, setResultado] = useState<number | null>(null);
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

  useEffect(() => {
    fetchVendedores();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setResultado(null);
    if (!vendedorId || !fechaInicio || !fechaFin) {
      setError("Todos los campos son obligatorios");
      return;
    }
    if (fechaInicio > fechaFin) {
      setError("La fecha de inicio debe ser anterior a la fecha de fin");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(API_COMISION, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendedorId: parseInt(vendedorId), fechaInicio, fechaFin }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Error al calcular comisión");
      }
      const data = await res.json();
      setResultado(data.comision);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["comisiones-container"]}>
      <h1>Calcular Comisión</h1>
      <form onSubmit={handleSubmit} className={styles["comisiones-form"]}>
        <div>
          <label htmlFor="vendedor" className={styles["comisiones-label"]}>Vendedor:</label>
          <select
            id="vendedor"
            className={styles["comisiones-select"]}
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
          <label htmlFor="fechaInicio" className={styles["comisiones-label"]}>Fecha Inicio:</label>
          <input
            id="fechaInicio"
            className={styles["comisiones-input"]}
            type="date"
            value={fechaInicio}
            onChange={e => setFechaInicio(e.target.value)}
            required
            title="Fecha de inicio"
            placeholder="Seleccione la fecha de inicio"
          />
        </div>
        <div>
          <label htmlFor="fechaFin" className={styles["comisiones-label"]}>Fecha Fin:</label>
          <input
            id="fechaFin"
            className={styles["comisiones-input"]}
            type="date"
            value={fechaFin}
            onChange={e => setFechaFin(e.target.value)}
            required
            title="Fecha de fin"
            placeholder="Seleccione la fecha de fin"
          />
        </div>
        <button type="submit" className={styles["comisiones-button"]} disabled={loading}>Calcular</button>
      </form>
      {error && <div className={styles["comisiones-error"]}>{error}</div>}
      {resultado !== null && (
        <div className={styles["comisiones-resultado"]}>
          <strong>Comisión calculada:</strong> ${resultado}
        </div>
      )}
    </div>
  );
}
