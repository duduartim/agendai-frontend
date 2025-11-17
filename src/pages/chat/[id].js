"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import io from "socket.io-client";

let socket;

export default function ChatPage() {
  const router = useRouter();
  const { id } = router.query; // ID da consulta
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const paciente = localStorage.getItem("authPaciente");
      const medico = localStorage.getItem("authMedico");
      setUsuario(paciente ? JSON.parse(paciente) : medico ? JSON.parse(medico) : null);
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    socket = io("http://localhost:5000"); // servidor backend
    socket.emit("joinRoom", id);

    socket.on("message", (msg) => {
      setMensagens((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  const enviarMensagem = () => {
    if (!novaMensagem.trim() || !usuario) return;

    const msg = {
      texto: novaMensagem,
      autor: usuario.nome,
      consultaId: id,
      timestamp: new Date(),
    };

    socket.emit("message", msg);
    setMensagens((prev) => [...prev, msg]);
    setNovaMensagem("");
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f172a] text-white">
      <header className="bg-blue-700 p-4 text-center text-xl font-semibold">
        💬 Chat da Consulta #{id}
      </header>

      <main className="flex-1 p-4 overflow-y-auto space-y-3">
        {mensagens.length === 0 ? (
          <p className="text-gray-400 text-center mt-10">Nenhuma mensagem ainda.</p>
        ) : (
          mensagens.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg max-w-xl ${
                msg.autor === usuario?.nome
                  ? "bg-blue-600 ml-auto text-right"
                  : "bg-gray-700 mr-auto text-left"
              }`}
            >
              <p className="font-semibold text-sm text-gray-200">{msg.autor}</p>
              <p>{msg.texto}</p>
              <span className="block text-xs text-gray-400 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString("pt-BR")}
              </span>
            </div>
          ))
        )}
      </main>

      <footer className="p-4 bg-[#1e293b] flex gap-2">
        <input
          type="text"
          value={novaMensagem}
          onChange={(e) => setNovaMensagem(e.target.value)}
          placeholder="Digite uma mensagem..."
          className="flex-1 p-2 rounded-lg bg-gray-100 text-gray-900 outline-none"
        />
        <button
          onClick={enviarMensagem}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold"
        >
          Enviar
        </button>
      </footer>
    </div>
  );
}
