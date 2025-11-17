"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { loginMedico } from "../../utils/api";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaUserMd, FaLock, FaSignInAlt } from "react-icons/fa";

export default function LoginMedico() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  // se já estiver logado como médico, redireciona pro hub
  // e garante que não há sessão de paciente
  useEffect(() => {
    if (typeof window === "undefined") return;

    // limpa sessão de paciente
    localStorage.removeItem("authPaciente");

    const raw = localStorage.getItem("authMedico");
    if (raw) {
      try {
        const medico = JSON.parse(raw);
        if (medico?.token) {
          router.replace("/medico/hub");
        }
      } catch {
        localStorage.removeItem("authMedico");
      }
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const response = await loginMedico({ email, senha });
      console.log("Resposta loginMedico:", response);

      if (!response || response.error || !response.token || !response.medico) {
        const msg =
          response?.error ||
          response?.message ||
          "Não foi possível entrar. Verifique suas credenciais.";
        setErro(msg);
        setCarregando(false);
        return;
      }

      // remove qualquer login de paciente
      localStorage.removeItem("authPaciente");

      // salva sessão do médico
      localStorage.setItem(
        "authMedico",
        JSON.stringify({
          id: response.medico?._id || response.medico?.id,
          nome: response.medico?.nome,
          email: response.medico?.email,
          especialidade: response.medico?.especialidade,
          token: response.token,
        })
      );

      router.push("/medico/hub");
    } catch (err) {
      console.error("Erro ao logar médico:", err);
      setErro("Erro no login! Tente novamente em instantes.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#020617] text-white pt-24">
      {/* HEADER */}
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
          <Link
            href="/paciente/login"
            className="text-gray-300 hover:text-emerald-400"
          >
            Sou paciente
          </Link>
        </nav>
      </header>

      {/* CONTEÚDO */}
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4">
        <motion.form
          onSubmit={handleLogin}
          className="bg-gray-900/80 border border-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="text-center mb-2">
            <motion.div
              className="mx-auto mb-3 flex items-center justify-center w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <FaUserMd className="text-blue-400 text-xl" />
            </motion.div>
            <h1 className="text-2xl font-bold text-blue-400">
              Login do Médico
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Acesse seu painel para gerenciar consultas e pacientes.
            </p>
          </div>

          {/* E-MAIL */}
          <div className="text-left">
            <label className="block text-xs text-gray-300 mb-1">E-mail</label>
            <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-3">
              <FaUserMd className="text-gray-400 mr-2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu.email@exemplo.com"
                className="bg-transparent w-full py-2.5 outline-none text-gray-200 text-sm"
              />
            </div>
          </div>

          {/* SENHA */}
          <div className="text-left">
            <label className="block text-xs text-gray-300 mb-1">Senha</label>
            <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-3">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                placeholder="Digite sua senha"
                className="bg-transparent w-full py-2.5 outline-none text-gray-200 text-sm"
              />
            </div>
          </div>

          {/* ERRO */}
          {erro && (
            <p className="text-red-400 text-xs text-left bg-red-900/30 border border-red-700 rounded-lg px-3 py-2">
              {erro}
            </p>
          )}

          {/* BOTÃO */}
          <motion.button
            type="submit"
            disabled={carregando}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/60 disabled:cursor-not-allowed py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 shadow-md"
            whileHover={!carregando ? { scale: 1.02 } : {}}
            whileTap={!carregando ? { scale: 0.97 } : {}}
            transition={{ type: "spring", stiffness: 260 }}
          >
            {carregando ? (
              "Entrando..."
            ) : (
              <>
                <FaSignInAlt /> Entrar
              </>
            )}
          </motion.button>

          {/* LINK CADASTRO */}
          <p className="text-gray-400 text-xs text-center">
            Ainda não tem cadastro como médico?{" "}
            <Link
              href="/medico/cadastro"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Crie sua conta
            </Link>
          </p>
        </motion.form>
      </div>

      {/* FOOTER */}
      <footer className="text-center py-6 border-t border-gray-800 text-gray-500 text-sm">
        © 2025 <span className="text-blue-500 font-semibold">Agendai+</span>.{" "}
        Todos os direitos reservados.
      </footer>
    </div>
  );
}
