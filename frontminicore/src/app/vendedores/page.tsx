"use client";
import { useState, useEffect } from "react";
import styles from "./vendedores.module.css";

const API_URL = "https://minicoreapiservice20250623191317.azurewebsites.net/api/vendedores";

interface Vendedor {
  id: number;
  nombre: string;
  email: string;
}

export default function VendedoresPage() {
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [nombre, setNombre] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchVendedores = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Error al obtener vendedores");
      const data: Vendedor[] = await res.json();
      setVendedores(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendedores();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!nombre || !email) {
      setError("Nombre y email son obligatorios");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email }),
      });
      if (!res.ok) throw new Error("Error al crear vendedor");
      setNombre("");
      setEmail("");
      fetchVendedores();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["vendedores-container"]}>
      <h1>Vendedores</h1>
      <form onSubmit={handleSubmit} className={styles["vendedores-form"]}>
        <div>
          <label htmlFor="nombre" className={styles["vendedores-label"]}>Nombre:</label>
          <input
            id="nombre"
            className={styles["vendedores-input"]}
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
            title="Nombre del vendedor"
            placeholder="Nombre del vendedor"
          />
        </div>
        <div>
          <label htmlFor="email" className={styles["vendedores-label"]}>Email:</label>
          <input
            id="email"
            className={styles["vendedores-input"]}
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            title="Email del vendedor"
            placeholder="Email del vendedor"
          />
        </div>
        <button type="submit" className={styles["vendedores-button"]} disabled={loading}>Agregar</button>
      </form>
      {error && <div className={styles["vendedores-error"]}>{error}</div>}
      <h2>Lista de Vendedores</h2>
      {loading ? <p>Cargando...</p> : (
        <ul>
          {vendedores.map(v => (
            <li key={v.id}>{v.nombre} ({v.email})</li>
          ))}
        </ul>
      )}
    </div>
  );
}
