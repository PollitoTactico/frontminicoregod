import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-6">Bienvenido a MINICORE</h1>
      <p className="mb-8 text-lg text-center max-w-xl">
        Sistema de gestión de comisiones. Usa el menú para navegar entre las
        secciones principales.
      </p>
      <nav className="flex flex-col gap-4 w-full max-w-xs">
        <Link
          href="/vendedores"
          className="block bg-blue-600 text-white rounded px-4 py-2 text-center hover:bg-blue-700 transition"
        >
          Vendedores
        </Link>
        <Link
          href="/reglas"
          className="block bg-blue-600 text-white rounded px-4 py-2 text-center hover:bg-blue-700 transition"
        >
          Reglas de Comisión
        </Link>
        <Link
          href="/ventas"
          className="block bg-blue-600 text-white rounded px-4 py-2 text-center hover:bg-blue-700 transition"
        >
          Ventas
        </Link>
        <Link
          href="/comisiones"
          className="block bg-blue-600 text-white rounded px-4 py-2 text-center hover:bg-blue-700 transition"
        >
          Calcular Comisión
        </Link>
      </nav>
    </div>
  );
}
