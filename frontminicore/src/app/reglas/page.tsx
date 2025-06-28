"use client";
import { useState, useEffect } from "react";
import styles from "./reglas.module.css";

const API_URL = "https://minicoreapiservice20250623191317.azurewebsites.net/api/reglas";

interface Regla {
  id: number;
  porcentaje: number;
  fechaInicio: string;
  fechaFin: string;
}

export default function ReglasPage() {
  const [reglas, setReglas] = useState<Regla[]>([]);
  const [porcentaje, setPorcentaje] = useState<string>("");
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchReglas = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Error al obtener reglas");
      const data: Regla[] = await res.json();
      setReglas(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReglas();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!porcentaje || !fechaInicio || !fechaFin) {
      setError("Todos los campos son obligatorios");
      return;
    }
    if (fechaInicio > fechaFin) {
      setError("La fecha de inicio debe ser anterior a la fecha de fin");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ porcentaje: parseFloat(porcentaje), fechaInicio, fechaFin }),
      });
      if (!res.ok) throw new Error("Error al crear regla");
      setPorcentaje("");
      setFechaInicio("");
      setFechaFin("");
      fetchReglas();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["reglas-container"]}>
      <h1>Reglas de Comisión</h1>
      <form onSubmit={handleSubmit} className={styles["reglas-form"]}>
        <div>
          <label htmlFor="porcentaje" className={styles["reglas-label"]}>Porcentaje (%):</label>
          <input
            id="porcentaje"
            className={styles["reglas-input"]}
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={porcentaje}
            onChange={e => setPorcentaje(e.target.value)}
            required
            title="Porcentaje de comisión"
            placeholder="Porcentaje de comisión"
          />
        </div>
        <div>
          <label htmlFor="fechaInicio" className={styles["reglas-label"]}>Fecha Inicio:</label>
          <input
            id="fechaInicio"
            className={styles["reglas-input"]}
            type="date"
            value={fechaInicio}
            onChange={e => setFechaInicio(e.target.value)}
            required
            title="Fecha de inicio"
            placeholder="Seleccione la fecha de inicio"
          />
        </div>
        <div>
          <label htmlFor="fechaFin" className={styles["reglas-label"]}>Fecha Fin:</label>
          <input
            id="fechaFin"
            className={styles["reglas-input"]}
            type="date"
            value={fechaFin}
            onChange={e => setFechaFin(e.target.value)}
            required
            title="Fecha de fin"
            placeholder="Seleccione la fecha de fin"
          />
        </div>
        <button type="submit" className={styles["reglas-button"]} disabled={loading}>Agregar</button>
      </form>
      {error && <div className={styles["reglas-error"]}>{error}</div>}
      <h2>Lista de Reglas</h2>
      {loading ? <p>Cargando...</p> : (
        <ul>
          {reglas.map(r => (
            <li key={r.id}>% {r.porcentaje} | {r.fechaInicio} - {r.fechaFin}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
