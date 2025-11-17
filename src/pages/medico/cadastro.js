"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import { cadastrarMedico } from "../../utils/api";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaUserMd, FaIdBadge, FaEnvelope, FaLock, FaStethoscope } from "react-icons/fa";

export default function CadastroMedico() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [crm, setCrm] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const data = await cadastrarMedico({
        nome,
        email,
        crm,
        especialidade,
        senha,
      });

      if (!data || data.error) {
        const msg =
          data?.error ||
          data?.message ||
          "Não foi possível concluir o cadastro. Tente novamente.";
        setErro(msg);
        setCarregando(false);
        return;
      }

      // cadastro OK → manda pro login de médico
      router.push("/medico/login");
    } catch (err) {
      console.error("Erro ao cadastrar médico:", err);
      setErro("Erro no cadastro. Tente novamente mais tarde.");
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
            href="/paciente/cadastro"
            className="text-gray-300 hover:text-emerald-400"
          >
            Sou paciente
          </Link>
        </nav>
      </header>

      {/* CONTEÚDO */}
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4">
        <motion.form
          onSubmit={handleSubmit}
          className="bg-gray-900/80 border border-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl space-y-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* TÍTULO + ICONE */}
          <div className="text-center mb-2">
            <motion.div
              className="mx-auto mb-3 flex items-center justify-center w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <FaUserMd className="text-blue-400 text-xl" />
            </motion.div>
            <h1 className="text-2xl font-bold text-blue-400">
              Cadastro do Médico
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Crie sua conta para gerenciar seus atendimentos no{" "}
              <span className="font-semibold text-blue-300">Agendai+</span>.
            </p>
          </div>

          {/* NOME */}
          <div className="text-left">
            <label className="block text-xs text-gray-300 mb-1">
              Nome completo
            </label>
            <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-3">
              <FaUserMd className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Seu nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full py-2.5 bg-transparent text-gray-200 text-sm outline-none"
                required
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className="text-left">
            <label className="block text-xs text-gray-300 mb-1">E-mail</label>
            <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-3">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="email"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-2.5 bg-transparent text-gray-200 text-sm outline-none"
                required
              />
            </div>
          </div>

          {/* CRM */}
          <div className="text-left">
            <label className="block text-xs text-gray-300 mb-1">
              CRM / Registro profissional
            </label>
            <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-3">
              <FaIdBadge className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="CRM 000000-UF"
                value={crm}
                onChange={(e) => setCrm(e.target.value)}
                className="w-full py-2.5 bg-transparent text-gray-200 text-sm outline-none"
                required
              />
            </div>
          </div>

          {/* ESPECIALIDADE */}
          <div className="text-left">
            <label className="block text-xs text-gray-300 mb-1">
              Especialidade
            </label>
            <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-3">
              <FaStethoscope className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Cardiologia, Clínica Geral..."
                value={especialidade}
                onChange={(e) => setEspecialidade(e.target.value)}
                className="w-full py-2.5 bg-transparent text-gray-200 text-sm outline-none"
                required
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
                placeholder="Crie uma senha segura"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full py-2.5 bg-transparent text-gray-200 text-sm outline-none"
                required
              />
            </div>
            <p className="text-[10px] text-gray-500 mt-1">
              Use pelo menos 6 caracteres.
            </p>
          </div>

          {/* ERRO */}
          {erro && (
            <p className="text-red-400 text-xs bg-red-900/30 border border-red-700 rounded-lg px-3 py-2">
              {erro}
            </p>
          )}

          {/* BOTÃO */}
          <motion.button
            type="submit"
            disabled={carregando}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg shadow-md"
            whileHover={!carregando ? { scale: 1.02 } : {}}
            whileTap={!carregando ? { scale: 0.97 } : {}}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {carregando ? "Cadastrando..." : "Cadastrar"}
          </motion.button>

          {/* LINK LOGIN */}
          <motion.p
            className="text-gray-400 text-xs mt-2 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Já tem uma conta como médico?{" "}
            <Link
              href="/medico/login"
              className="text-blue-400 hover:text-blue-300 underline font-medium"
            >
              Faça login
            </Link>
          </motion.p>
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
