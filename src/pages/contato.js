"use client";

import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

const EMAIL_CONTATO = "agendai@gmail.com";

export default function Contato() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#020617] text-white">
      <Navbar />

      <main className="pt-28 pb-16 px-6 md:px-12 lg:px-24 max-w-4xl mx-auto">
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-blue-400 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Contato
        </motion.h1>

        <motion.section
          className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-4 text-sm md:text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-gray-300 leading-relaxed">
            Caso queira entrar em contato sobre o{" "}
            <span className="text-blue-400 font-semibold">Agendai+</span>,
            enviar sugestões, relatar problemas ou apenas dar um feedback,
            utilize o e-mail abaixo:
          </p>

          <div className="bg-blue-600/10 border border-blue-700 rounded-xl p-4">
            <p className="text-gray-400 text-xs mb-1">E-mail de contato</p>
            <p className="text-blue-400 font-semibold break-all text-sm md:text-base">
              {EMAIL_CONTATO}
            </p>
          </div>

          <p className="text-gray-300 leading-relaxed">
            Você também pode descrever brevemente o que aconteceu (no caso de um
            erro) ou qual melhoria gostaria de ver no sistema. Assim fica mais
            fácil evoluir o projeto.
          </p>

          <p className="text-gray-500 text-xs mt-4">
    
          </p>
        </motion.section>
      </main>
    </div>
  );
}
