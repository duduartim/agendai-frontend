import Link from "next/link";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <Layout>
      <section className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl mx-auto px-6 md:px-8 py-16 md:py-20 gap-10">
        {/* === LADO ESQUERDO – TEXTO === */}
        <motion.div
          className="flex-1 text-center md:text-left space-y-6"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs text-blue-300 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Plataforma inteligente de agendamento médico
          </div>

          {/* Título */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            Bem-vindo ao{" "}
            <span className="text-blue-500 drop-shadow-[0_0_18px_#3b82f6]">
              Agendai+
            </span>
          </h1>

          {/* Subtítulo */}
          <p className="text-gray-400 text-base md:text-lg max-w-md mx-auto md:mx-0">
            Agende e acompanhe consultas com rapidez. Médicos e pacientes
            conectados em um só lugar, sem complicação.
          </p>

          {/* Benefícios rápidos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300 max-w-lg mx-auto md:mx-0">
            <div className="flex items-start gap-2">
              <span className="mt-1 text-blue-400">✓</span>
              <p>Agenda organizada com status de consultas em tempo real.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-1 text-blue-400">✓</span>
              <p>Chat integrado entre médico e paciente.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-1 text-blue-400">✓</span>
              <p>Controle de indisponibilidade do médico.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-1 text-blue-400">✓</span>
              <p>Acesso simples, interface moderna e intuitiva.</p>
            </div>
          </div>

          {/* Botões principais */}
          <div className="flex justify-center md:justify-start gap-4 pt-4">
            <Link
              href="/medico/login"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-semibold transition-all shadow-lg hover:scale-105"
            >
              Sou Médico
            </Link>
            <Link
              href="/paciente/login"
              className="border border-blue-500/70 text-blue-100 hover:bg-blue-500 hover:text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:scale-105"
            >
              Sou Paciente
            </Link>
          </div>

          <p className="text-xs text-gray-500 mt-1 md:mt-0">
            Pacientes usam o Agendai+ gratuitamente • Sem burocracia para
            começar a usar.
          </p>
        </motion.div>

        {/* === LADO DIREITO – IMAGEM / CARD === */}
        <motion.div
          className="flex-1 flex justify-center md:justify-end"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        >
          <div className="relative group">
            {/* Glow de fundo */}
            <div className="absolute -inset-3 bg-blue-600/20 blur-2xl rounded-3xl group-hover:blur-[26px] transition-all duration-500" />

            {/* Imagem principal */}
            <img
              src="/doctor.jpg"
              alt="Médicos conversando"
              className="relative rounded-3xl shadow-2xl w-[380px] md:w-[460px] lg:w-[520px] h-auto transform group-hover:scale-[1.03] group-hover:translate-y-1 transition-transform duration-500"
            />

            {/* Card superior */}
            <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6 bg-gray-900/95 border border-blue-500/40 rounded-2xl px-4 py-3 shadow-xl text-xs md:text-sm text-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600/80 flex items-center justify-center text-white text-lg">
              
              </div>
              <div>
                <p className="font-semibold text-blue-300">+ Agilidade</p>
                <p className="text-gray-400 text-[11px] md:text-xs">
                  Menos tempo em filas, mais tempo com o paciente.
                </p>
              </div>
            </div>

            {/* Card inferior */}
            <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-gray-900/95 border border-emerald-500/40 rounded-2xl px-4 py-3 shadow-xl text-xs md:text-sm text-gray-100 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-300 font-semibold">
                  Consultas em tempo real
                </span>
              </div>
              <p className="text-gray-400 text-[11px] md:text-xs">
                Atualização automática de status e histórico de atendimentos.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
}
