"use client";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { motion } from "framer-motion";

let socket = null;

export default function ChatLateral({
  consultaId,
  aberto,
  onFechar,
  somenteLeitura = false,
}) {
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [conectado, setConectado] = useState(false);
  const mensagensRef = useRef(null);

  // ==============================
  //  URLs base
  // ==============================
  const apiRoot =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // base do backend (SEM /api no final)
  const fileBaseURL =
    process.env.NEXT_PUBLIC_FILES_URL ||
    apiRoot.replace(/\/api\/?$/, ""); // ex: http://localhost:5000

  const socketURL =
    process.env.NEXT_PUBLIC_SOCKET_URL || fileBaseURL;

  // ==============================
  //  Detecta usuário logado
  // ==============================
  useEffect(() => {
    if (typeof window === "undefined") return;

    const pacienteRaw = localStorage.getItem("authPaciente");
    const medicoRaw = localStorage.getItem("authMedico");

    if (medicoRaw) {
      const m = JSON.parse(medicoRaw);
      setUsuario({ _id: m.id || m._id, nome: m.nome });
      setTipoUsuario("medico");
    } else if (pacienteRaw) {
      const p = JSON.parse(pacienteRaw);
      setUsuario({ _id: p.id || p._id, nome: p.nome });
      setTipoUsuario("paciente");
    }
  }, []);

  // ==============================
  //  Conecta ao socket
  // ==============================
  useEffect(() => {
    if (!consultaId || !aberto) return;

    if (socket) {
      socket.disconnect();
      socket = null;
    }

    socket = io(socketURL, {
      transports: ["websocket"],
      path: "/socket.io",
    });

    socket.on("connect", () => {
      setConectado(true);
      socket.emit("entrarConsulta", consultaId);
    });

    socket.on("disconnect", () => setConectado(false));

    socket.on("historicoMensagens", (msgs) => {
      setMensagens(Array.isArray(msgs) ? msgs : []);
    });

    socket.on("novaMensagem", (msg) => {
      setMensagens((prev) => [...prev, msg]);
    });

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [consultaId, aberto, socketURL]);

  // Scroll automático
  useEffect(() => {
    if (mensagensRef.current) {
      mensagensRef.current.scrollTop = mensagensRef.current.scrollHeight;
    }
  }, [mensagens]);

  const isMinha = (msg) =>
    String(msg.autorId) === String(usuario?._id || usuario?.id);

  // ==============================
  //  Enviar mensagem texto
  // ==============================
  const enviarMensagem = () => {
    if (!novaMensagem.trim() || !usuario || !socket) return;

    socket.emit("enviarMensagem", {
      consultaId,
      texto: novaMensagem.trim(),
      tipo: tipoUsuario,
      autorId: usuario._id,
      autorNome: usuario.nome,
      horario: new Date(),
    });

    setNovaMensagem("");
  };

  // ==============================
  //  Enviar arquivo
  // ==============================
  const enviarArquivo = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !usuario) return;

    const formData = new FormData();
    formData.append("arquivo", file);

    try {
      const res = await fetch(`${apiRoot}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!data.url && !data.path) {
        alert("Erro ao enviar arquivo");
        return;
      }

      // garante que vamos usar sempre o caminho relativo tipo "/uploads/xxx"
      const arquivoPath = data.path || data.url;

      socket.emit("enviarMensagem", {
        consultaId,
        autorId: usuario._id,
        autorNome: usuario.nome,
        tipo: tipoUsuario,
        arquivo: true,
        arquivoUrl: arquivoPath,
        arquivoTipo: file.type,
        horario: new Date(),
      });
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar arquivo");
    }

    e.target.value = "";
  };

  if (!aberto) return null;

  // ======================================================
  //   Monta URL final do arquivo (sempre http://backend/uploads/...)
  // ======================================================
  const montarURLArquivo = (msg) => {
    if (!msg.arquivo || !msg.arquivoUrl) return null;

    let raw = String(msg.arquivoUrl).trim();

    // Se vier absoluta, tipo "http://algo/uploads/...", pega só o path
    try {
      if (raw.startsWith("http")) {
        const u = new URL(raw);
        raw = u.pathname; // "/uploads/xxx.pdf"
      }
    } catch {
      // ignora erro
    }

    // Garante que começa com "/"
    if (!raw.startsWith("/")) raw = `/${raw}`;

    // Garante que está apontando pra /uploads
    if (!raw.startsWith("/uploads")) {
      const idx = raw.indexOf("/uploads/");
      if (idx !== -1) {
        raw = raw.slice(idx);
      }
    }

    const base = fileBaseURL.replace(/\/$/, ""); // http://localhost:5000
    return `${base}${raw}`;                       // http://localhost:5000/uploads/xxx.pdf
  };

  // ==============================
  //  FRONT FINAL
  // ==============================
  return (
    <motion.div
      initial={{ x: 500, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "tween", duration: 0.25 }}
      className="fixed top-0 right-0 h-full w-full md:w-[640px] lg:w-[720px] bg-[#0b1120] border-l border-gray-800 flex flex-col z-50 shadow-2xl"
    >
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-600 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full ${
              conectado ? "bg-green-400" : "bg-gray-500"
            }`}
          />
          <h2 className="text-white font-semibold">Chat da Consulta</h2>
        </div>

        <button
          onClick={onFechar}
          className="bg-red-600 px-3 py-1 rounded text-white font-bold"
        >
          ✕
        </button>
      </header>

      {/* Lista de Mensagens */}
      <main
        ref={mensagensRef}
        className="flex-1 p-4 overflow-y-auto bg-[#0f172a] space-y-4"
      >
        {mensagens.map((msg, i) => {
          const souEu = isMinha(msg);
          const urlArquivo = montarURLArquivo(msg);

          return (
            <div
              key={msg._id || i}
              className={`flex ${souEu ? "justify-end" : ""}`}
            >
              <div
                className={`p-3 rounded-xl max-w-[75%] ${
                  souEu
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-700 text-gray-100 rounded-bl-none"
                }`}
              >
                <p className="text-xs opacity-70 mb-1">
                  {souEu ? "Você" : msg.autorNome}
                </p>

                {msg.texto && <p>{msg.texto}</p>}

                {msg.arquivo && urlArquivo && (
                  <div className="mt-2">
                    {msg.arquivoTipo?.startsWith("image/") ? (
                      <img
                        src={urlArquivo}
                        className="rounded-lg max-h-60 border border-gray-600"
                      />
                    ) : msg.arquivoTipo === "application/pdf" ? (
                      <a
                        href={urlArquivo}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-200 underline"
                      >
                        📄 Baixar PDF
                      </a>
                    ) : (
                      <a
                        href={urlArquivo}
                        download
                        className="text-blue-200 underline"
                      >
                        📎 Baixar arquivo
                      </a>
                    )}
                  </div>
                )}

                <span className="block text-[10px] mt-1 opacity-50 text-right">
                  {new Date(msg.horario).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}
      </main>

      {/* Campo de Envio */}
      {!somenteLeitura && (
        <footer className="p-4 bg-[#111827] flex gap-2">
          <label className="bg-gray-700 px-4 py-2 rounded cursor-pointer flex items-center gap-2 text-sm text-gray-100 border border-gray-600">
            <span className="font-semibold">Anexar arquivo</span>
            <input type="file" hidden onChange={enviarArquivo} />
          </label>

          <input
            className="flex-1 p-3 rounded bg-[#0b1220] border border-gray-700"
            placeholder="Digite uma mensagem..."
            value={novaMensagem}
            onChange={(e) => setNovaMensagem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && enviarMensagem()}
          />

          <button
            onClick={enviarMensagem}
            className="bg-blue-600 px-4 py-2 rounded text-white"
          >
            Enviar
          </button>
        </footer>
      )}
    </motion.div>
  );
}
