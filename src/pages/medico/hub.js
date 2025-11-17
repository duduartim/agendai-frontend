"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  listarConsultasMedico,
  deletarConsulta,
  atualizarStatusConsulta,
} from "../../utils/api";
import { motion } from "framer-motion";
import {
  FaUserMd,
  FaCalendarAlt,
  FaClock,
  FaSearch,
  FaCommentDots,
  FaCheck,
  FaBan,
  FaHistory,
  FaSignOutAlt,
} from "react-icons/fa";
import ChatLateral from "../../components/ChatLateral";

export default function HubMedico() {
  const router = useRouter();
  const [consultas, setConsultas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [medico, setMedico] = useState(null);

  const [aba, setAba] = useState("pendente");
  const [busca, setBusca] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const [ordenacao, setOrdenacao] = useState("data_asc");
  const [chatAberto, setChatAberto] = useState(false);
  const [consultaSelecionada, setConsultaSelecionada] = useState(null);

  // qual seção interna está ativa (consultas | config)
  const [secaoAtiva, setSecaoAtiva] = useState("consultas");

  // estados da tela de configurações - senha
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [salvandoConfig, setSalvandoConfig] = useState(false);

  // ======= NOVO: indisponibilidade de dias =======
  const [diasIndisponiveis, setDiasIndisponiveis] = useState([]); // ['2025-11-20', ...]
  const [novoDia, setNovoDia] = useState("");
  const [carregandoDias, setCarregandoDias] = useState(false);
  const [salvandoDias, setSalvandoDias] = useState(false);

  // ============================================================
  // UPLOAD DE LAUDO
  // ============================================================
  const enviarLaudo = async (consultaId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("laudo", file);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/consulta/${consultaId}/laudo`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!data.ok) {
        alert(data.error || "Erro ao enviar laudo");
        return;
      }

      alert("Laudo enviado com sucesso!");
      recarregarDepois();
    } catch (err) {
      console.error(err);
      alert("Erro no upload do laudo");
    }

    e.target.value = "";
  };

  const excluirLaudo = async (consultaId) => {
    if (!confirm("Deseja realmente excluir o laudo?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/consulta/${consultaId}/laudo`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (!data.ok) {
        alert("Erro ao excluir laudo");
        return;
      }

      alert("Laudo excluído com sucesso!");
      recarregarDepois();
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir laudo");
    }
  };

  // ============================================================
  // LOGIN E CARREGAMENTO INICIAL
  // ============================================================
  useEffect(() => {
    if (typeof window === "undefined") return;

    const medicoLogado = JSON.parse(localStorage.getItem("authMedico"));
    if (!medicoLogado || !medicoLogado.id) {
      router.push("/medico/login");
      return;
    }

    setMedico(medicoLogado);
    carregarConsultas(medicoLogado.id);
  }, [router]);

  const carregarConsultas = async (id) => {
    try {
      setCarregando(true);
      const data = await listarConsultasMedico(id);
      setConsultas(data || []);
    } catch (err) {
      console.error("Erro ao buscar consultas:", err);
    } finally {
      setCarregando(false);
    }
  };

  const carregarConsultasSilencioso = async (id) => {
    try {
      const data = await listarConsultasMedico(id);
      setConsultas(data || []);
    } catch (err) {
      console.error("Erro ao atualizar consultas (silencioso):", err);
    }
  };

  const recarregarDepois = () => {
    if (!medico?.id) return;
    setTimeout(() => carregarConsultas(medico.id), 350);
  };

  // refresh automático a cada 5s
  useEffect(() => {
    if (!medico?.id) return;
    const intervalo = setInterval(() => {
      carregarConsultasSilencioso(medico.id);
    }, 5000);

    return () => clearInterval(intervalo);
  }, [medico?.id]);

  // ============================================================
  // NOVO: carregar dias indisponíveis do médico
  // ============================================================
  useEffect(() => {
    const fetchDiasIndisponiveis = async () => {
      if (!medico?.id) return;
      try {
        setCarregandoDias(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/medicos/${medico.id}/indisponibilidade`
        );
        if (!res.ok) {
          console.warn("Não foi possível carregar dias indisponíveis");
          return;
        }
        const data = await res.json();
        if (data && Array.isArray(data.dias)) {
          setDiasIndisponiveis(data.dias);
        }
      } catch (err) {
        console.error("Erro ao carregar dias indisponíveis:", err);
      } finally {
        setCarregandoDias(false);
      }
    };

    fetchDiasIndisponiveis();
  }, [medico?.id]);

  const adicionarDiaIndisponivel = () => {
    if (!novoDia) return;
    const normalizado = novoDia; // input date já vem "YYYY-MM-DD"

    if (diasIndisponiveis.includes(normalizado)) {
      alert("Esse dia já está marcado como indisponível.");
      return;
    }

    setDiasIndisponiveis((prev) => [...prev, normalizado].sort());
    setNovoDia("");
  };

  const removerDiaIndisponivel = (dia) => {
    setDiasIndisponiveis((prev) => prev.filter((d) => d !== dia));
  };

  const salvarDiasIndisponiveis = async () => {
    if (!medico?.id) return;
    try {
      setSalvandoDias(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/medicos/${medico.id}/indisponibilidade`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dias: diasIndisponiveis }),
        }
      );

      const data = await res.json();

      if (!res.ok || data.error) {
        alert(
          data.message || data.error || "Erro ao salvar dias indisponíveis."
        );
        return;
      }

      setDiasIndisponiveis(data.dias || []);
      alert("Dias indisponíveis atualizados com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar indisponibilidade:", err);
      alert("Erro ao salvar dias indisponíveis.");
    } finally {
      setSalvandoDias(false);
    }
  };

  const diasIndisponiveisOrdenados = useMemo(
    () => [...diasIndisponiveis].sort(),
    [diasIndisponiveis]
  );

  // ============================================================
  // AÇÕES
  // ============================================================
  const concluir = async (id) => {
    await atualizarStatusConsulta(id, "concluida");
    recarregarDepois();
  };

  const aceitarPendente = async (id) => {
    await atualizarStatusConsulta(id, "aprovada");
    recarregarDepois();
  };

  const cancelarPendente = async (id) => {
    await atualizarStatusConsulta(id, "rejeitada");
    recarregarDepois();
  };

  const cancelarAprovada = async (id) => {
    await atualizarStatusConsulta(id, "cancelada");
    recarregarDepois();
  };

  const excluir = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta consulta?")) return;
    const res = await deletarConsulta(id);

    if (res.error) alert(res.error);
    else {
      alert("Consulta excluída!");
      setConsultas((prev) => prev.filter((c) => c._id !== id));
    }
  };

  // ============================================================
  // ALTERAR SENHA (CONFIGURAÇÕES)
  // ============================================================
  const alterarSenha = async (e) => {
    e.preventDefault();
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      alert("Preencha todos os campos de senha.");
      return;
    }
    if (novaSenha !== confirmarSenha) {
      alert("A confirmação de senha não confere.");
      return;
    }
    if (!medico?.id) {
      alert("Médico não identificado. Faça login novamente.");
      return;
    }

    try {
      setSalvandoConfig(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/medicos/${medico.id}/alterar-senha`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            senhaAtual,
            novaSenha,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || data.error) {
        alert(data.message || data.error || "Erro ao alterar senha.");
        return;
      }

      alert("Senha alterada com sucesso!");
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
    } catch (err) {
      console.error("Erro ao alterar senha:", err);
      alert("Erro ao alterar senha. Verifique o console.");
    } finally {
      setSalvandoConfig(false);
    }
  };

  // ============================================================
  // CHAT SOMENTE LEITURA
  // ============================================================
  const chatSomenteLeitura = useMemo(() => {
    const selecionada = consultas.find((c) => c._id === consultaSelecionada);
    return selecionada
      ? ["concluida", "cancelada"].includes(selecionada.status)
      : false;
  }, [consultaSelecionada, consultas]);

  // ============================================================
  // CONTAGEM POR STATUS
  // ============================================================
  const contagemStatus = useMemo(() => {
    const base = {
      pendente: 0,
      aprovada: 0,
      rejeitada: 0,
      historico: 0,
    };

    for (const c of consultas) {
      if (c.status === "pendente") base.pendente++;
      if (c.status === "aprovada") base.aprovada++;
      if (c.status === "rejeitada") base.rejeitada++;
      if (["concluida", "cancelada"].includes(c.status)) base.historico++;
    }

    return base;
  }, [consultas]);

  // ============================================================
  // FILTROS
  // ============================================================
  const consultasFiltradas = useMemo(() => {
    const statusMap = {
      pendente: "pendente",
      aprovada: "aprovada",
      rejeitada: "rejeitada",
      historico: ["concluida", "cancelada"],
    };

    let lista = [...(consultas || [])];

    if (aba === "historico") {
      lista = lista.filter((c) => statusMap.historico.includes(c.status));
    } else {
      lista = lista.filter((c) => c.status === statusMap[aba]);
    }

    const termo = busca.toLowerCase().trim();
    if (termo) {
      lista = lista.filter((c) => {
        const nome = (c.paciente?.nome || "").toLowerCase();
        const esp = (c.especialidade || "").toLowerCase();
        return nome.includes(termo) || esp.includes(termo);
      });
    }

    if (filtroData) {
      const alvo = new Date(filtroData);
      lista = lista.filter((c) => {
        const dt = new Date(c.horario);
        return (
          dt.getFullYear() === alvo.getFullYear() &&
          dt.getMonth() === alvo.getMonth() &&
          dt.getDate() === alvo.getDate()
        );
      });
    }

    const cmp = {
      data_asc: (a, b) => new Date(a.horario) - new Date(b.horario),
      data_desc: (a, b) => new Date(b.horario) - new Date(a.horario),
      nome_asc: (a, b) =>
        (a.paciente?.nome || "").localeCompare(b.paciente?.nome || ""),
      nome_desc: (a, b) =>
        (b.paciente?.nome || "").localeCompare(a.paciente?.nome || ""),
    };

    lista.sort(cmp[ordenacao] || cmp.data_asc);
    return lista;
  }, [consultas, aba, busca, filtroData, ordenacao]);

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-[#0d1117] to-[#020617] text-white pt-12 px-6 pb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* AGORA USA A LARGURA TODA */}
      <main className="w-full">
        {/* HEADER DO HUB */}
        <div className="flex justify-between items-start mb-6 border-b border-gray-800 pb-5">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-3xl font-bold text-blue-400 flex items-center gap-2">
                <FaUserMd /> Dr. {medico?.nome}
              </h1>
              <p className="text-gray-400 mt-1">
                {medico?.email} • {medico?.especialidade}
              </p>
            </div>

            {/* Abas internas: Consultas / Configurações */}
            <div className="flex flex-col gap-3">
              <div className="inline-flex bg-gray-900/70 border border-gray-800 rounded-2xl p-1 shadow-lg">
                <button
                  onClick={() => setSecaoAtiva("consultas")}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${
                    secaoAtiva === "consultas"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-300 hover:bg-gray-800/70"
                  }`}
                >
                  Consultas
                </button>
                <button
                  onClick={() => setSecaoAtiva("config")}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${
                    secaoAtiva === "config"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-300 hover:bg-gray-800/70"
                  }`}
                >
                  Configurações
                </button>
              </div>

              {/* mini resumo das consultas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs md:text-sm">
                <div className="bg-gray-900/60 border border-blue-900/50 rounded-xl px-3 py-2 flex justify-between items-center">
                  <span className="text-gray-300">Pendentes</span>
                  <span className="text-blue-400 font-bold">
                    {contagemStatus.pendente}
                  </span>
                </div>
                <div className="bg-gray-900/60 border border-emerald-900/50 rounded-xl px-3 py-2 flex justify-between items-center">
                  <span className="text-gray-300">Aprovadas</span>
                  <span className="text-emerald-400 font-bold">
                    {contagemStatus.aprovada}
                  </span>
                </div>
                <div className="bg-gray-900/60 border border-red-900/50 rounded-xl px-3 py-2 flex justify-between items-center">
                  <span className="text-gray-300">Rejeitadas</span>
                  <span className="text-red-400 font-bold">
                    {contagemStatus.rejeitada}
                  </span>
                </div>
                <div className="bg-gray-900/60 border border-gray-700 rounded-xl px-3 py-2 flex justify-between items-center">
                  <span className="text-gray-300">Histórico</span>
                  <span className="text-gray-200 font-bold">
                    {contagemStatus.historico}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("authMedico");
              router.push("/medico/login");
            }}
            className="inline-flex items-center gap-2 border border-red-500/70 text-red-300 hover:bg-red-600 hover:text-white hover:border-red-600 px-4 py-2 rounded-full font-semibold self-start shadow-sm transition"
          >
            <FaSignOutAlt className="text-sm" />
            Sair
          </button>
        </div>

        {/* ================= SEÇÃO CONSULTAS ================= */}
        {secaoAtiva === "consultas" && (
          <>
            {/* CARDZÃO DO PAINEL */}
            <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 shadow-xl mb-8 w-full">
              <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
                <h2 className="text-xl font-semibold text-blue-400">
                  Painel de Consultas
                </h2>
                {carregando && (
                  <span className="text-xs text-gray-400">
                    Atualizando consultas...
                  </span>
                )}
              </div>

              {/* ABAS STATUS */}
              <div className="flex flex-wrap gap-3 mb-5">
                {[
                  { id: "pendente", label: "Pendentes" },
                  { id: "aprovada", label: "Aprovadas" },
                  { id: "rejeitada", label: "Rejeitadas" },
                  { id: "historico", label: "Histórico", icon: <FaHistory /> },
                ].map((tab) => {
                  const qtd =
                    tab.id === "historico"
                      ? contagemStatus.historico
                      : contagemStatus[tab.id] || 0;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setAba(tab.id)}
                      className={`px-5 py-2 rounded-lg font-semibold border flex items-center gap-2 text-sm transition ${
                        aba === tab.id
                          ? "bg-blue-600 border-blue-500 text-white shadow-md"
                          : "bg-gray-800 border-gray-700 hover:bg-gray-700"
                      }`}
                    >
                      {tab.icon} {tab.label}
                      <span
                        className={`ml-1 text-xs px-2 py-0.5 rounded-full ${
                          aba === tab.id
                            ? "bg-white/15 text-white"
                            : "bg-black/30 text-gray-200"
                        }`}
                      >
                        {qtd}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* BUSCA + FILTROS */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-3 flex-1 min-w-[260px]">
                  <FaSearch className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder="Buscar por paciente ou especialidade"
                    className="bg-transparent py-2 outline-none text-gray-200 w-full"
                  />
                </div>

                <input
                  type="date"
                  value={filtroData}
                  onChange={(e) => setFiltroData(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-200"
                />

                <select
                  value={ordenacao}
                  onChange={(e) => setOrdenacao(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-200"
                >
                  <option value="data_asc">Data ↑</option>
                  <option value="data_desc">Data ↓</option>
                  <option value="nome_asc">Paciente (A–Z)</option>
                  <option value="nome_desc">Paciente (Z–A)</option>
                </select>
              </div>
            </div>

            {/* LISTAGEM */}
            <div className="space-y-5 w-full">
              {consultasFiltradas.map((consulta, i) => (
                <motion.div
                  key={consulta._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-gray-900/70 border border-gray-800 rounded-2xl p-5 shadow-lg"
                >
                  <div className="flex justify-between flex-wrap gap-3">
                    <div>
                      <p className="text-lg font-semibold text-blue-400">
                        {consulta.paciente?.nome}
                      </p>

                      <p className="text-gray-300 flex items-center gap-2 mt-1">
                        <FaCalendarAlt className="text-blue-400" />
                        {new Date(consulta.horario).toLocaleDateString(
                          "pt-BR"
                        )}{" "}
                        <FaClock className="ml-2 text-blue-400" />
                        {new Date(consulta.horario).toLocaleTimeString(
                          "pt-BR"
                        )}
                      </p>

                      <p className="text-gray-400 mt-1">
                        Especialidade:{" "}
                        <span className="text-gray-200">
                          {consulta.especialidade}
                        </span>
                      </p>

                      <p
                        className={`mt-1 font-medium ${
                          consulta.status === "pendente"
                            ? "text-yellow-400"
                            : consulta.status === "aprovada"
                            ? "text-green-400"
                            : ["concluida", "cancelada"].includes(
                                consulta.status
                              )
                            ? "text-gray-300"
                            : "text-red-400"
                        }`}
                      >
                        Status: {consulta.status}
                      </p>
                    </div>

                    {/* AÇÕES */}
                    <div className="flex flex-wrap gap-3 self-center">
                      {/* CHAT – só quando não estiver pendente nem rejeitada */}
                      {["aprovada", "concluida", "cancelada"].includes(
                        consulta.status
                      ) && (
                        <motion.button
                          onClick={() => {
                            setConsultaSelecionada(consulta._id);
                            setChatAberto(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 font-semibold text-sm shadow-md"
                          whileHover={{ scale: 1.05 }}
                        >
                          <FaCommentDots /> Chat
                        </motion.button>
                      )}

                      {/* LAUDO */}
                      {["aprovada", "concluida"].includes(consulta.status) && (
                        <>
                          {consulta.laudoUrl ? (
                            <>
                              <motion.a
                                href={consulta.laudoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded-lg flex items-center gap-2 font-semibold text-sm shadow-md"
                                whileHover={{ scale: 1.05 }}
                              >
                                📄 Ver Laudo
                              </motion.a>

                              <motion.button
                                onClick={() => excluirLaudo(consulta._id)}
                                className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded-lg flex items-center gap-2 font-semibold text-sm shadow-md"
                                whileHover={{ scale: 1.05 }}
                              >
                                🗑️ Excluir Laudo
                              </motion.button>
                            </>
                          ) : (
                            <>
                              <motion.button
                                onClick={() =>
                                  document
                                    .getElementById(`fileLaudo_${consulta._id}`)
                                    .click()
                                }
                                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2 font-semibold text-sm shadow-md"
                                whileHover={{ scale: 1.05 }}
                              >
                                📄 Enviar Laudo
                              </motion.button>

                              <input
                                id={`fileLaudo_${consulta._id}`}
                                type="file"
                                accept="application/pdf"
                                className="hidden"
                                onChange={(e) => enviarLaudo(consulta._id, e)}
                              />
                            </>
                          )}
                        </>
                      )}

                      {/* PENDENTES: ACEITAR / CANCELAR */}
                      {consulta.status === "pendente" && (
                        <>
                          <motion.button
                            onClick={() => aceitarPendente(consulta._id)}
                            className="bg-emerald-700 hover:bg-emerald-800 px-4 py-2 rounded-lg flex items-center gap-2 font-semibold text-sm shadow-md"
                            whileHover={{ scale: 1.05 }}
                          >
                            <FaCheck /> Aceitar
                          </motion.button>

                          <motion.button
                            onClick={() => cancelarPendente(consulta._id)}
                            className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded-lg flex items-center gap-2 font-semibold text-sm shadow-md"
                            whileHover={{ scale: 1.05 }}
                          >
                            <FaBan /> Cancelar
                          </motion.button>
                        </>
                      )}

                      {/* APROVADAS: CONCLUIR / CANCELAR */}
                      {consulta.status === "aprovada" && (
                        <>
                          <motion.button
                            onClick={() => concluir(consulta._id)}
                            className="bg-emerald-700 hover:bg-emerald-800 px-4 py-2 rounded-lg flex items-center gap-2 font-semibold text-sm shadow-md"
                            whileHover={{ scale: 1.05 }}
                          >
                            <FaCheck /> Concluir
                          </motion.button>

                          <motion.button
                            onClick={() => cancelarAprovada(consulta._id)}
                            className="bg-amber-700 hover:bg-amber-800 px-4 py-2 rounded-lg flex items-center gap-2 font-semibold text-sm shadow-md"
                            whileHover={{ scale: 1.05 }}
                          >
                            <FaBan /> Cancelar
                          </motion.button>
                        </>
                      )}

                      {/* REJEITADAS / HISTÓRICO podem usar excluir, se você quiser */}
                      {["rejeitada"].includes(consulta.status) && (
                        <motion.button
                          onClick={() => excluir(consulta._id)}
                          className="bg-red-800 hover:bg-red-900 px-4 py-2 rounded-lg flex items-center gap-2 font-semibold text-sm shadow-md"
                          whileHover={{ scale: 1.05 }}
                        >
                          🗑️ Excluir
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {consultasFiltradas.length === 0 && (
                <p className="text-center text-gray-500 mt-6">
                  Nenhuma consulta encontrada com os filtros atuais.
                </p>
              )}
            </div>
          </>
        )}

        {/* ================= SEÇÃO CONFIGURAÇÕES ================= */}
        {secaoAtiva === "config" && (
          <div className="mt-8 bg-gray-900/80 border border-gray-800 rounded-2xl p-6 shadow-2xl w-full">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">
              Configurações da Conta
            </h2>

            {/* Dados básicos */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-200 mb-2">
                Dados do Médico
              </h3>
              <p className="text-gray-300">
                <span className="font-semibold">Nome:</span> {medico?.nome}
              </p>
              <p className="text-gray-300">
                <span className="font-semibold">Email:</span> {medico?.email}
              </p>
              <p className="text-gray-300">
                <span className="font-semibold">Especialidade:</span>{" "}
                {medico?.especialidade}
              </p>
            </div>

            {/* NOVO BLOCO: Dias indisponíveis */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-200 mb-2">
                Dias indisponíveis para atendimento
              </h3>
              <p className="text-sm text-gray-400 mb-3">
                Defina os dias em que você não atenderá consultas. Esses dias
                serão bloqueados no calendário do paciente.
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-3">
                <input
                  type="date"
                  value={novoDia}
                  onChange={(e) => setNovoDia(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-200"
                />
                <button
                  type="button"
                  onClick={adicionarDiaIndisponivel}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-white text-sm"
                >
                  Adicionar dia
                </button>

                {carregandoDias && (
                  <span className="text-xs text-gray-400">
                    Carregando dias...
                  </span>
                )}
              </div>

              {diasIndisponiveisOrdenados.length === 0 && !carregandoDias && (
                <p className="text-sm text-gray-500">
                  Nenhum dia indisponível cadastrado.
                </p>
              )}

              {diasIndisponiveisOrdenados.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {diasIndisponiveisOrdenados.map((dia) => {
                    const dataFormatada = new Date(
                      `${dia}T00:00:00`
                    ).toLocaleDateString("pt-BR");
                    return (
                      <div
                        key={dia}
                        className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-full px-3 py-1 text-xs"
                      >
                        <span className="text-gray-200">{dataFormatada}</span>
                        <button
                          type="button"
                          onClick={() => removerDiaIndisponivel(dia)}
                          className="text-red-400 hover:text-red-300"
                          title="Remover dia"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={salvarDiasIndisponiveis}
                  disabled={salvandoDias}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 font-semibold text-white text-sm disabled:opacity-60"
                >
                  {salvandoDias
                    ? "Salvando indisponibilidade..."
                    : "Salvar dias indisponíveis"}
                </button>
              </div>
            </div>

            {/* Alterar senha */}
            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-3">
                Alterar Senha
              </h3>
              <form
                onSubmit={alterarSenha}
                className="grid gap-3 md:grid-cols-2"
              >
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-300 mb-1">
                    Senha atual
                  </label>
                  <input
                    type="password"
                    value={senhaAtual}
                    onChange={(e) => setSenhaAtual(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Nova senha
                  </label>
                  <input
                    type="password"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Confirmar nova senha
                  </label>
                  <input
                    type="password"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-200"
                  />
                </div>

                <div className="md:col-span-2 flex justify-end mt-2">
                  <button
                    type="submit"
                    disabled={salvandoConfig}
                    className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-white disabled:opacity-60"
                  >
                    {salvandoConfig ? "Salvando..." : "Salvar nova senha"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* CHAT LATERAL */}
      {chatAberto && (
        <ChatLateral
          consultaId={consultaSelecionada}
          aberto={chatAberto}
          onFechar={() => setChatAberto(false)}
          somenteLeitura={chatSomenteLeitura}
        />
      )}
    </motion.div>
  );
}
