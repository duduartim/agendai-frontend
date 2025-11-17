"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Navbar() {
  const [usuario, setUsuario] = useState(null);
  const router = useRouter();

  const carregarUsuario = () => {
    const paciente =
      typeof window !== "undefined" && localStorage.getItem("authPaciente");
    const medico =
      typeof window !== "undefined" && localStorage.getItem("authMedico");

    if (paciente) {
      setUsuario(JSON.parse(paciente));
    } else if (medico) {
      setUsuario(JSON.parse(medico));
    } else {
      setUsuario(null);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    carregarUsuario();

    // Escuta mudanças no localStorage (logout em outra aba, etc.)
    const syncLogout = () => carregarUsuario();
    window.addEventListener("storage", syncLogout);

    return () => {
      window.removeEventListener("storage", syncLogout);
    };
  }, []);

  const handleLogout = () => {
    if (typeof window === "undefined") return;

    localStorage.removeItem("authPaciente");
    localStorage.removeItem("authMedico");

    setUsuario(null);
    window.location.href = "/"; // redireciona para Home
  };

  // Se estiver na Home ("/") e não estiver logado, não mostra o botão "Entrar"
  const isHome = router.pathname === "/";
  const mostrarBotaoEntrar = !usuario && !isHome;

  const linkClasses = (path) => {
    const ativo = router.pathname === path;
    return `
      relative px-1 pb-0.5
      text-[0.9rem] md:text-sm lg:text-base
      font-medium tracking-wide
      transition
      border-b-2
      ${ativo ? "text-blue-400 border-blue-500" : "text-gray-200 border-transparent"}
      hover:text-blue-400 hover:border-blue-400
    `;
  };

  return (
    <nav className="bg-[#0f172a]/95 text-white px-6 md:px-10 h-20 flex justify-between items-center fixed top-0 left-0 right-0 z-50 shadow-md backdrop-blur-md border-b border-gray-800">
      {/* Logo */}
      <Link
        href="/"
        className="text-2xl md:text-2xl font-extrabold text-blue-400 flex items-center gap-1 tracking-tight"
      >
        Agendai<span className="text-white">+</span>
      </Link>

      {/* Links + usuário */}
      <div className="flex items-center gap-6 md:gap-8">
        <Link href="/" className={linkClasses("/")}>
          Início
        </Link>
        <Link href="/sobre" className={linkClasses("/sobre")}>
          Sobre
        </Link>
        <Link href="/contato" className={linkClasses("/contato")}>
          Contato
        </Link>

        {usuario ? (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 text-gray-300 text-sm md:text-base">
              <span>Olá,</span>
              <span className="font-semibold text-white">
                {usuario.nome?.trim()}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold text-sm md:text-base transition shadow-sm"
            >
              Sair
            </button>
          </div>
        ) : (
          mostrarBotaoEntrar && (
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold text-sm md:text-base transition shadow-sm"
            >
              Entrar
            </Link>
          )
        )}
      </div>
    </nav>
  );
}
