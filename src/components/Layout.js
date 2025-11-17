import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-black text-white overflow-visible">
      {/* Usa o Navbar real */}
      <Navbar />

      {/* Conteúdo principal */}
      <main className="flex-1 flex items-center justify-center p-8 overflow-visible pt-24">
        {children}
      </main>

      {/* Rodapé */}
      <footer className="text-center py-4 border-t border-gray-800 text-gray-500 text-sm">
        © 2025 <span className="text-blue-500 font-semibold">Agendai+</span>. Todos os direitos reservados.
      </footer>
    </div>
  );
}
