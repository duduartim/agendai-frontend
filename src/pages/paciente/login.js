"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion } from "framer-motion";
import { loginPaciente } from "../../utils/api";
import { FaUserCircle, FaLock } from "react-icons/fa";

export default function LoginPaciente() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const router = useRouter();

  // Se já estiver logado, redireciona. Também limpa login de médico.
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Garante que não há sessão de médico
    localStorage.removeItem("authMedico");

    // Se já há sessão de paciente válida, manda pro hub
    const raw = localStorage.getItem("authPaciente");
    if (raw) {
      try {
        const user = JSON.parse(raw);
        if (user?.token) router.replace("/paciente/hub");
      } catch {
        localStorage.removeItem("authPaciente");
      }
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const data = await loginPaciente({ email, senha });

      if (data?.token && data?.paciente) {
        // Limpa qualquer sessão de médico
        localStorage.removeItem("authMedico");

        // Salva sessão do paciente
        localStorage.setItem(
          "authPaciente",
          JSON.stringify({
            _id: data.paciente?._id,
            nome: data.paciente?.nome,
            email: data.paciente?.email,
            token: data.token,
          })
        );

        router.push("/paciente/hub");
      } else {
        const msg =
          data?.error ||
          data?.message ||
          "Erro no login! Verifique suas credenciais.";
        setErro(msg);
      }
    } catch (err) {
      console.error("Erro no login do paciente:", err);
      setErro("Erro ao conectar com o servidor. Tente novamente em instantes.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#020617] text-white pt-24">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-4 bg-[#0f172a]/90 backdrop-blur border-b border-gray-800">
        <div className="text-2xl font-bold text-blue-500">
          Agendai<span className="text-white">+</span>
        </div>
        <nav className="flex gap-6 text-sm">
          <Link href="/" className="text-gray-200 hover:text-blue-400">
            Início
          </Link>
          <Link href="/sobre" className="text-gray-200 hover:text-blue-400">
            Sobre
          </Link>
          <Link href="/contato" className="text-gray-200 hover:text-blue-400">
            Contato
          </Link>
        </nav>
      </header>

      {/* Conteúdo */}
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <form
            onSubmit={handleSubmit}
            className="bg-gray-900/80 px-8 pt-8 pb-7 rounded-2xl shadow-2xl border border-gray-800 space-y-6"
          >
            <div className="flex flex-col items-center gap-2 mb-2">
              <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mb-1">
                <FaUserCircle className="text-4xl text-blue-400" />
              </div>
              <h1 className="text-2xl font-semibold text-blue-400">
                Login do Paciente
              </h1>
              <p className="text-gray-400 text-xs">
                Acesse seu painel para acompanhar consultas e laudos.
              </p>
            </div>

            {/* Erro */}
            {erro && (
              <div className="bg-red-900/40 border border-red-600 text-red-200 text-sm px-3 py-2 rounded-lg text-left">
                {erro}
              </div>
            )}

            {/* Email */}
            <div className="text-left space-y-1">
              <label className="text-sm text-gray-300">E-mail</label>
              <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3">
                <FaUserCircle className="text-gray-400 text-sm" />
                <input
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-2.5 bg-transparent text-gray-100 placeholder-gray-500 outline-none text-sm"
                  required
                />
              </div>
            </div>

            {/* Senha */}
            <div className="text-left space-y-1">
              <label className="text-sm text-gray-300">Senha</label>
              <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3">
                <FaLock className="text-gray-400 text-sm" />
                <input
                  type="password"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full py-2.5 bg-transparent text-gray-100 placeholder-gray-500 outline-none text-sm"
                  required
                />
              </div>
              <div className="flex justify-end mt-1">
                <span className="text-[11px] text-gray-500 italic">
                  Não compartilhe sua senha com ninguém.
                </span>
              </div>
            </div>

            {/* Botão */}
            <button
              type="submit"
              disabled={carregando}
              className={`w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                carregando
                  ? "bg-blue-600/60 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>

            {/* Link cadastro */}
            <p className="text-gray-400 text-sm text-center">
              Ainda não tem uma conta?{" "}
              <Link
                href="/paciente/cadastro"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Cadastre-se
              </Link>
            </p>

            {/* Link médico */}
            <p className="text-gray-500 text-[11px] text-center mt-1">
              É médico?{" "}
              <Link
                href="/medico/login"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Acesse o painel do médico
              </Link>
            </p>
          </form>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 border-t border-gray-800 text-gray-500 text-sm">
        © 2025{" "}
        <span className="text-blue-500 font-semibold">Agendai+</span>. Todos os
        direitos reservados.
      </footer>
    </div>
  );
}
