"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion } from "framer-motion";
import { cadastrarPaciente } from "../../utils/api";
import {
  FaUserPlus,
  FaUser,
  FaIdCard,
  FaPhone,
  FaLock,
  FaEnvelope,
} from "react-icons/fa";

export default function CadastroPaciente() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const data = await cadastrarPaciente({
        nome,
        email,
        cpf,
        telefone,
        senha,
      });

      if (data?.error) {
        setErro(data.error || "Erro ao cadastrar paciente.");
      } else {
        alert("Cadastro realizado com sucesso!");
        router.push("/paciente/login");
      }
    } catch (err) {
      console.error("Erro ao cadastrar paciente:", err);
      setErro("Erro ao conectar com o servidor. Tente novamente em instantes.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#020617] text-white pt-24">
      {/* Header (mesmo do login) */}
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
            className="text-blue-400 hover:text-blue-300 font-semibold"
          >
            Entrar
          </Link>
        </nav>
      </header>

      {/* Conteúdo */}
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <form
            onSubmit={handleSubmit}
            className="bg-gray-900/80 px-8 pt-8 pb-7 rounded-2xl shadow-2xl border border-gray-800 space-y-6"
          >
            <div className="flex flex-col items-center gap-2 mb-2">
              <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mb-1">
                <FaUserPlus className="text-3xl text-blue-400" />
              </div>
              <h1 className="text-2xl font-semibold text-blue-400">
                Cadastro do Paciente
              </h1>
              <p className="text-gray-400 text-xs text-center">
                Crie sua conta para agendar consultas e acompanhar seus
                atendimentos.
              </p>
            </div>

            {/* Erro */}
            {erro && (
              <div className="bg-red-900/40 border border-red-600 text-red-200 text-sm px-3 py-2 rounded-lg text-left">
                {erro}
              </div>
            )}

            {/* Nome */}
            <div className="text-left space-y-1">
              <label className="text-sm text-gray-300">Nome completo</label>
              <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3">
                <FaUser className="text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Seu nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full py-2.5 bg-transparent text-gray-100 placeholder-gray-500 outline-none text-sm"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="text-left space-y-1">
              <label className="text-sm text-gray-300">E-mail</label>
              <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3">
                <FaEnvelope className="text-gray-400 text-sm" />
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

            {/* CPF */}
            <div className="text-left space-y-1">
              <label className="text-sm text-gray-300">CPF</label>
              <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3">
                <FaIdCard className="text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  className="w-full py-2.5 bg-transparent text-gray-100 placeholder-gray-500 outline-none text-sm"
                  required
                />
              </div>
            </div>

            {/* Telefone */}
            <div className="text-left space-y-1">
              <label className="text-sm text-gray-300">Telefone</label>
              <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3">
                <FaPhone className="text-gray-400 text-sm" />
                <input
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
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
                  placeholder="Crie uma senha segura"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full py-2.5 bg-transparent text-gray-100 placeholder-gray-500 outline-none text-sm"
                  required
                />
              </div>
              <span className="text-[11px] text-gray-500 italic">
                Use pelo menos 6 caracteres.
              </span>
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
              {carregando ? "Cadastrando..." : "Cadastrar"}
            </button>

            {/* Link para login */}
            <p className="text-gray-400 text-sm text-center mt-1">
              Já tem uma conta?{" "}
              <Link
                href="/paciente/login"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Faça login
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
