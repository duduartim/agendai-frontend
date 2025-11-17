"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import io from "socket.io-client";
import { motion } from "framer-motion";

let socket;

export default function ChatConsulta() {
  const router = useRouter();
  const { consultaId } = router.query;
  const [mensagens, setMensagens] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const fimDoChatRef = useRef(null);

  useEffect(() => {
    if (!consultaId) return;

    // 🔹 Recupera o usuário logado (paciente ou médico)
    const authPaciente = localStorage.getItem("authPaciente");
    const authMedico = localStorage.getItem("authMedico");

    let user = null;
    if (authPaciente) {
      const p = JSON.parse(authPaciente);
      user = { tipo: "paciente", nome: p.nome, id: p._id || p.id };
    } else if (authMedico) {
      const m = JSON.parse(authMedico);
      user = { tipo: "medico", nome: m.nome, id: m.id };
    } else {
      alert("Usuário não identificado. Faça login novamente.");
      router.push("/");
      return;
    }

    setUsuario(user);

    // 🔹 Conecta ao Socket.IO backend
    socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000");

    // Entra na sala da consulta
    socket.emit("entrarConsulta", consultaId);

    // Recebe mensagens
    socket.on("novaMensagem", (msg) => {
      setMensagens((prev) => [...prev, msg]);
    });

    // Busca mensagens antigas (opcional, se o backend suportar)
    socket.emit("buscarMensagens", consultaId);

    socket.on("historicoMensagens", (msgs) => {
      setMensagens(msgs || []);
    });

    setCarregando(false);

    return () => {
      socket.disconnect();
    };
  }, [consultaId]);

  // 🔹 Enviar mensagem
  const enviarMensagem = () => {
    if (!mensagem.trim()) return;

    const msg = {
      consultaId,
      remetenteId: usuario.id,
      remetenteNome: usuario.nome,
      tipo: usuario.tipo,
      texto: mensagem,
      horario: new Date(),
    };

    socket.emit("enviarMensagem", msg);
    setMensagem("");
    setMensagens((prev) => [...prev, msg]);
  };

  // 🔹 Scroll automático
  useEffect(() => {
    fimDoChatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  if (carregando) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0d1117] text-white text-lg">
        Carregando chat...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#0d1117] to-[#111827] text-white">
      {/* 🔹 Cabeçalho */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-[#111827]/80 backdrop-blur-sm">
        <h1 className="text-xl font-semibold text-blue-400">💬 Chat da Consulta</h1>
        <button
          onClick={() => router.back()}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold"
        >
          Voltar
        </button>
      </div>

      {/* 🔹 Mensagens */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {mensagens.length === 0 && (
          <p className="text-center text-gray-400 mt-10">
            Nenhuma mensagem ainda. Inicie a conversa!
          </p>
        )}

        {mensagens.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`max-w-[70%] p-3 rounded-2xl ${
              msg.remetenteId === usuario.id
                ? "bg-blue-600 text-white ml-auto"
                : "bg-gray-700 text-gray-100"
            }`}
          >
            <p className="text-sm font-semibold mb-1">{msg.remetenteNome}</p>
            <p>{msg.texto}</p>
            <span className="text-xs text-gray-300 mt-1 block text-right">
              {new Date(msg.horario).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </motion.div>
        ))}

        <div ref={fimDoChatRef}></div>
      </div>

      {/* 🔹 Campo de envio */}
      <div className="p-4 border-t border-gray-700 bg-[#111827]/80 flex gap-3">
        <input
          type="text"
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviarMensagem()}
          placeholder="Digite uma mensagem..."
          className="flex-1 p-3 rounded-lg bg-gray-800 text-white outline-none"
        />
        <button
          onClick={enviarMensagem}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg font-semibold"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
