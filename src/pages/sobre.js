"use client";

import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

export default function Sobre() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#020617] text-white">
      <Navbar />

      <main className="pt-28 pb-16 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto">
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-blue-400 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Sobre o Agendai+
        </motion.h1>

        <motion.section
          className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-4 text-sm md:text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-gray-300 leading-relaxed">
            O <span className="text-blue-400 font-semibold">Agendai+</span> é
            uma plataforma criada para facilitar o{" "}
            <span className="font-semibold">agendamento de consultas</span>,
            conectando pacientes e médicos em um ambiente simples, moderno e
            organizado.
          </p>

          <p className="text-gray-300 leading-relaxed">
            Com o Agendai+, o paciente consegue:
          </p>

          <ul className="list-disc list-inside text-gray-300 space-y-1 pl-2">
            <li>Pesquisar médicos por especialidade e nome.</li>
            <li>Solicitar consultas de forma rápida.</li>
            <li>Acompanhar o status: pendente, aprovada, rejeitada ou histórico.</li>
            <li>Conversar com o médico através de um chat dedicado.</li>
            <li>Visualizar laudos enviados após a consulta.</li>
          </ul>

          <p className="text-gray-300 leading-relaxed">
            Já o médico conta com um painel próprio para gerenciar consultas,
            aprovar ou rejeitar solicitações, enviar laudos em PDF e se
            comunicar diretamente com o paciente.
          </p>

          <p className="text-gray-400 text-xs mt-4">
          </p>
        </motion.section>
      </main>
    </div>
  );
}
