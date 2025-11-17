export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0f172a] to-[#020617] text-white">
      <main className="flex-1 flex items-center justify-center p-6">
        {children}
      </main>
      <footer className="text-center py-4 border-t border-gray-800 text-gray-500 text-sm">
        © 2025 <span className="text-blue-500 font-semibold">Agendai+</span>. Todos os direitos reservados.
      </footer>
    </div>
  );
}
