"use client";
import ChatLateral from "../../components/ChatLateral";
import { useLayoutEffect, useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import {
  buscarMedicosPorEspecialidade,
  agendarConsulta,
  listarConsultasPaciente,
  atualizarStatusConsulta,
} from "../../utils/api";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import {
  FaSearch,
  FaBan,
  FaHistory,
  FaUserCircle,
  FaCalendarAlt,
  FaComments,
  FaCog,
} from "react-icons/fa";

export default function HubPaciente() {
  const router = useRouter();

  // ===== Estados principais =====
  const [query, setQuery] = useState("");
  const [filtroEspecialidade, setFiltroEspecialidade] = useState("");
  const [ordenacao, setOrdenacao] = useState("nome_asc");
  const [medicos, setMedicos] = useState([]);
  const [carregandoBusca, setCarregandoBusca] = useState(false);
  const [consultas, setConsultas] = useState([]);
  const [menuAtivo, setMenuAtivo] = useState("Consultas"); // Consultas | Chat | Configurações
  const [carregandoAgendamento, setCarregandoAgendamento] = useState(false);
  const [paciente, setPaciente] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [consultaSelecionada, setConsultaSelecionada] = useState(null);
  const [aba, setAba] = useState("pendente");
  const [modalAberto, setModalAberto] = useState(false);
  const [medicoSelecionado, setMedicoSelecionado] = useState(null);
  const [dataConsulta, setDataConsulta] = useState("");

  // ===== Estados de configurações (alterar senha) =====
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [salvandoConfig, setSalvandoConfig] = useState(false);

  // ===== Dias indisponíveis do médico =====
  const [diasIndisponiveisMedico, setDiasIndisponiveisMedico] = useState([]); // ['2025-11-20', ...]
  const [carregandoDiasIndisponiveis, setCarregandoDiasIndisponiveis] =
    useState(false);

  // ===== Verificação de login segura =====
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const auth = localStorage.getItem("authPaciente");

    if (auth) {
      try {
        const user = JSON.parse(auth);
        if (user && user.token) {
          setPaciente(user);
        } else {
          localStorage.removeItem("authPaciente");
          router.replace("/paciente/login");
        }
      } catch (e) {
        console.error("Erro lendo authPaciente:", e);
        localStorage.removeItem("authPaciente");
        router.replace("/paciente/login");
      }
    } else {
      router.replace("/paciente/login");
    }

    setIsLoading(false);
  }, [router]);

  // ===== Consultas do paciente =====
  const fetchConsultas = async () => {
    const id = paciente?._id || paciente?.id;
    if (!id) return;
    try {
      const data = await listarConsultasPaciente(id);
      setConsultas(data || []);
    } catch (e) {
      console.error("Erro ao listar consultas:", e);
    }
  };

  // ===== Chama fetchConsultas depois que o paciente é carregado =====
  useEffect(() => {
    if (paciente) fetchConsultas();
  }, [paciente]);

  // 🔄 ATUALIZA CONSULTAS EM INTERVALO (ex: a cada 5s)
  useEffect(() => {
    if (!paciente) return;

    const intervalo = setInterval(() => {
      fetchConsultas();
    }, 5000); // 5 segundos

    return () => clearInterval(intervalo);
  }, [paciente]);

  // ===== Buscar médicos =====
  const buscar = async () => {
    if (!filtroEspecialidade) {
      setMedicos([]);
      return alert("Selecione uma especialidade primeiro.");
    }

    try {
      setCarregandoBusca(true);

      const data = await buscarMedicosPorEspecialidade({
        nome: query, // filtro opcional
        especialidade: filtroEspecialidade,
      });

      if (Array.isArray(data) && data.length > 0) {
        const ordenados = [...data].sort((a, b) =>
          ordenacao === "nome_asc"
            ? a.nome.localeCompare(b.nome)
            : b.nome.localeCompare(a.nome)
        );
        setMedicos(ordenados);
      } else {
        setMedicos([]);
        alert("Nenhum médico encontrado.");
      }
    } catch (err) {
      console.error("Erro na busca de médicos:", err);
      alert("Erro ao buscar médicos. Verifique o console.");
    } finally {
      setCarregandoBusca(false);
    }
  };

  // 🔄 Buscar automaticamente ao mudar especialidade ou ordenação
  useEffect(() => {
    if (!filtroEspecialidade) {
      setMedicos([]);
      return;
    }
    const buscarSilencioso = async () => {
      try {
        setCarregandoBusca(true);
        const data = await buscarMedicosPorEspecialidade({
          nome: query,
          especialidade: filtroEspecialidade,
        });

        if (Array.isArray(data) && data.length > 0) {
          const ordenados = [...data].sort((a, b) =>
            ordenacao === "nome_asc"
              ? a.nome.localeCompare(b.nome)
              : b.nome.localeCompare(a.nome)
          );
          setMedicos(ordenados);
        } else {
          setMedicos([]);
        }
      } catch (err) {
        console.error("Erro na busca automática de médicos:", err);
      } finally {
        setCarregandoBusca(false);
      }
    };

    buscarSilencioso();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroEspecialidade, ordenacao]);

  // ===== Cancelar consulta =====
  const cancelarConsulta = async (id) => {
    if (!window.confirm("Tem certeza que deseja cancelar esta consulta?")) return;
    const res = await atualizarStatusConsulta(id, "cancelada");
    if (res?.error) alert(res.error);
    else {
      alert("Consulta cancelada com sucesso!");
      fetchConsultas();
    }
  };

  // ===== Carregar dias indisponíveis de um médico =====
  const carregarDiasIndisponiveisMedico = async (idMedico) => {
    if (!idMedico) return;
    try {
      setCarregandoDiasIndisponiveis(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/medicos/${idMedico}/indisponibilidade`
      );
      if (!res.ok) {
        console.warn("Não foi possível carregar dias indisponíveis do médico");
        setDiasIndisponiveisMedico([]);
        return;
      }
      const data = await res.json();
      if (data && Array.isArray(data.dias)) {
        setDiasIndisponiveisMedico(data.dias);
      } else {
        setDiasIndisponiveisMedico([]);
      }
    } catch (err) {
      console.error("Erro ao carregar dias indisponíveis do médico:", err);
      setDiasIndisponiveisMedico([]);
    } finally {
      setCarregandoDiasIndisponiveis(false);
    }
  };

  const diasIndisponiveisOrdenados = useMemo(
    () => [...diasIndisponiveisMedico].sort(),
    [diasIndisponiveisMedico]
  );

  // Dia escolhido é indisponível?
  const diaSelecionadoIndisponivel = useMemo(() => {
    if (!dataConsulta) return false;
    const dia = dataConsulta.split("T")[0]; // "YYYY-MM-DD"
    return diasIndisponiveisMedico.includes(dia);
  }, [dataConsulta, diasIndisponiveisMedico]);

  // ===== Modal de Agendamento =====
  const abrirModalAgendamento = (medico) => {
    setMedicoSelecionado(medico);
    setDataConsulta("");
    setModalAberto(true);
    carregarDiasIndisponiveisMedico(medico._id);
  };

  const fecharModalAgendamento = () => {
    setModalAberto(false);
    setMedicoSelecionado(null);
    setDiasIndisponiveisMedico([]);
    setDataConsulta("");
  };

  const confirmarAgendamento = async () => {
    if (!paciente) return alert("Faça login novamente!");
    if (!dataConsulta) return alert("Escolha uma data e hora!");

    // valida dia indisponível (front)
    const diaEscolhido = dataConsulta.split("T")[0];
    if (diasIndisponiveisMedico.includes(diaEscolhido)) {
      return alert(
        "Esse médico não está disponível nesse dia. Escolha outra data."
      );
    }

    try {
      setCarregandoAgendamento(true);
      const res = await agendarConsulta({
        idPaciente: paciente._id || paciente.id,
        idMedico: medicoSelecionado._id,
        horario: dataConsulta,
      });
      if (res?.error) alert(res.error);
      else alert("Consulta solicitada com sucesso!");
      fecharModalAgendamento();
      fetchConsultas();
    } catch (e) {
      console.error(e);
      alert("Erro ao agendar consulta!");
    } finally {
      setCarregandoAgendamento(false);
    }
  };

  // ===== Filtros de abas =====
  const consultasFiltradas = useMemo(() => {
    const map = {
      pendente: ["pendente"],
      aprovada: ["aprovada"],
      rejeitada: ["rejeitada"],
      historico: ["concluida", "cancelada"],
    };
    return consultas.filter((c) => map[aba].includes(c.status));
  }, [consultas, aba]);

  const fecharChat = () => {
    setMenuAtivo("Consultas");
    setConsultaSelecionada(null);
  };

  // ===== Chat somente leitura no histórico =====
  const chatSomenteLeitura = useMemo(() => {
    const selecionada = consultas.find((c) => c._id === consultaSelecionada);
    return selecionada
      ? ["concluida", "cancelada"].includes(selecionada.status)
      : false;
  }, [consultaSelecionada, consultas]);

  // ===== Alterar senha (Configurações) =====
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

    const id = paciente?._id || paciente?.id;
    if (!id) {
      alert("Paciente não identificado. Faça login novamente.");
      return;
    }

    try {
      setSalvandoConfig(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pacientes/${id}/alterar-senha`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ senhaAtual, novaSenha }),
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
      console.error("Erro ao alterar senha do paciente:", err);
      alert("Erro ao alterar senha. Verifique o console.");
    } finally {
      setSalvandoConfig(false);
    }
  };

  // ===== Evita renderizar antes da checagem =====
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
        Carregando...
      </div>
    );
  }

  if (!paciente) return null;

  const opcoesMenu = [
    { id: "Consultas", label: "Consultas", icon: <FaCalendarAlt /> },
    { id: "Chat", label: "Chat", icon: <FaComments /> },
    { id: "Configurações", label: "Configurações", icon: <FaCog /> },
  ];

  // ===== Renderização principal =====
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#020617] text-white pt-24 relative">
      <Navbar />

      {/* ===== MENU LATERAL ===== */}
      <aside className="fixed top-20 left-0 md:w-64 w-56 md:h-screen bg-[#0f172a]/95 border-r border-gray-800 p-6 shadow-lg backdrop-blur-md overflow-y-auto z-40">
        <h2 className="text-xl font-bold text-blue-400 mb-4">Menu</h2>
        <ul className="space-y-3">
          {opcoesMenu.map((item) => (
            <li
              key={item.id}
              className={`cursor-pointer flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                menuAtivo === item.id
                  ? "bg-blue-600 text-white shadow-md scale-[1.02]"
                  : "bg-transparent hover:bg-blue-600/20 hover:text-blue-300"
              }`}
              onClick={() => setMenuAtivo(item.id)}
            >
              <span
                className={`p-2 rounded-full ${
                  menuAtivo === item.id
                    ? "bg-white/10"
                    : "bg-gray-800/70 group-hover:bg-blue-600/40"
                }`}
              >
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* ===== CONTEÚDO PRINCIPAL ===== */}
      <main className="flex-1 md:ml-64 p-8 overflow-y-auto">
        {/* Cabeçalho do paciente (aparece em todas as seções) */}
        {paciente && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-700 pb-4">
            <div className="flex items-center gap-3">
              <FaUserCircle className="text-blue-400 text-4xl" />
              <div>
                <h1 className="text-2xl font-bold text-blue-400">
                  {paciente?.nome || "Paciente"}
                </h1>
                <p className="text-gray-400">{paciente?.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* ================== SEÇÃO CONSULTAS ================== */}
        {menuAtivo === "Consultas" && (
          <>
            <motion.h1
              className="text-3xl font-bold mb-6 text-blue-400"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Painel do Paciente
            </motion.h1>

            {/* ===== BARRA DE BUSCA ===== */}
            <div className="mb-8">
              <div className="w-full max-w-4xl bg-gray-900/70 border border-gray-800 rounded-xl px-4 py-4 flex flex-wrap items-center gap-3">
                {/* filtro por nome */}
                <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-3 flex-1 min-w-[200px]">
                  <FaSearch className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Filtrar por nome do médico (opcional)"
                    className="bg-transparent py-2 outline-none text-gray-200 w-full"
                  />
                </div>

                {/* especialidade */}
                <select
                  value={filtroEspecialidade}
                  onChange={(e) => setFiltroEspecialidade(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 w-56"
                >
                  <option value="">Selecione a especialidade</option>
                  <option value="Geral">Geral</option>
                  <option value="Cardiologia">Cardiologia</option>
                  <option value="Dermatologia">Dermatologia</option>
                  <option value="Ortopedia">Ortopedia</option>
                  {/* adicione aqui todas as especialidades que você cadastra no médico */}
                </select>

                {/* ordenação */}
                <select
                  value={ordenacao}
                  onChange={(e) => setOrdenacao(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 w-40"
                >
                  <option value="nome_asc">Nome ↑</option>
                  <option value="nome_desc">Nome ↓</option>
                </select>

                {/* botão buscar */}
                <button
                  onClick={buscar}
                  disabled={carregandoBusca}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold min-w-[110px]"
                >
                  {carregandoBusca ? "Buscando..." : "Buscar"}
                </button>
              </div>
            </div>

            {/* ===== RESULTADOS (MÉDICOS) ===== */}
            {!carregandoBusca && medicos.length > 0 && (
              <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 mb-12">
                {medicos.map((m) => (
                  <motion.div
                    key={m._id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-800/60 p-5 rounded-lg border border-gray-700"
                  >
                    <h3 className="text-xl font-semibold text-blue-400">
                      {m.nome}
                    </h3>
                    <p className="text-gray-300">
                      <b>Especialidade:</b> {m.especialidade}
                    </p>
                    <p className="text-gray-400 text-sm">
                      <b>Email:</b> {m.email}
                    </p>
                    <p className="text-gray-400 text-sm">
                      <b>CRM:</b> {m.crm}
                    </p>
                    <button
                      onClick={() => abrirModalAgendamento(m)}
                      disabled={carregandoAgendamento}
                      className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
                    >
                      📅 Agendar consulta
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            {/* ===== ABAS ===== */}
            <div className="flex gap-3 mb-8">
              {[
                { id: "pendente", label: "Pendentes" },
                { id: "aprovada", label: "Aprovadas" },
                { id: "rejeitada", label: "Rejeitadas" },
                { id: "historico", label: "Histórico", icon: <FaHistory /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setAba(tab.id)}
                  className={`px-5 py-2 rounded-lg font-semibold border flex items-center gap-2 ${
                    aba === tab.id
                      ? "bg-blue-600 border-blue-500"
                      : "bg-gray-800 border-gray-700 hover:bg-gray-700"
                  } transition`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* ===== CONSULTAS ===== */}
            <div className="grid md:grid-cols-3 gap-6">
              {consultasFiltradas.length === 0 ? (
                <p className="text-gray-400 text-center col-span-3 mt-10">
                  Nenhuma consulta nesta aba.
                </p>
              ) : (
                consultasFiltradas.map((c) => (
                  <motion.div
                    key={c._id}
                    whileHover={{ scale: 1.01 }}
                    className="bg-gray-800/60 p-5 rounded-lg border border-gray-700"
                  >
                    <p>
                      <b>Médico:</b> {c.medico?.nome || "—"}
                    </p>
                    <p>
                      <b>Horário:</b>{" "}
                      {new Date(c.horario).toLocaleString("pt-BR")}
                    </p>
                    <p>
                      <b>Especialidade:</b> {c.especialidade || "—"}
                    </p>
                    <p className="mt-2 text-gray-300">
                      <b>Status:</b> {c.status}
                    </p>

                    {/* 🔵 Chat disponível em aprovadas + histórico (concluída / cancelada) */}
                    {["aprovada", "concluida", "cancelada"].includes(
                      c.status
                    ) && (
                      <button
                        onClick={() => {
                          setConsultaSelecionada(c._id);
                          setMenuAtivo("Chat");
                        }}
                        className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
                      >
                        💬 Abrir Chat
                      </button>
                    )}

                    {c.laudoUrl && (
                      <a
                        href={c.laudoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 w-full inline-block text-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg"
                      >
                        📄 Ver Laudo
                      </a>
                    )}

                    {["pendente", "aprovada"].includes(c.status) && (
                      <button
                        onClick={() => cancelarConsulta(c._id)}
                        className="mt-3 w-full bg-red-700 hover:bg-red-800 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2"
                      >
                        <FaBan /> Cancelar
                      </button>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </>
        )}

        {/* ================== SEÇÃO CONFIGURAÇÕES ================== */}
        {menuAtivo === "Configurações" && (
          <div className="max-w-3xl mx-auto mt-4 bg-gray-900/70 border border-gray-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">
              Configurações da Conta
            </h2>

            {/* Dados básicos */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-200 mb-2">
                Dados do Paciente
              </h3>
              <p className="text-gray-300">
                <span className="font-semibold">Nome:</span> {paciente?.nome}
              </p>
              <p className="text-gray-300">
                <span className="font-semibold">Email:</span> {paciente?.email}
              </p>
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

        {/* ================== SEÇÃO CHAT ================== */}
        {menuAtivo === "Chat" && (
          <div className="mt-4">
            {!consultaSelecionada && (
              <p className="text-gray-400 mb-4">
                Selecione uma consulta nas abas de{" "}
                <b>Aprovadas</b> ou <b>Histórico</b> para abrir o chat com o
                médico.
              </p>
            )}
          </div>
        )}
      </main>

      {/* ===== CHAT LATERAL ===== */}
      {menuAtivo === "Chat" && consultaSelecionada && (
        <ChatLateral
          consultaId={consultaSelecionada}
          aberto={true}
          onFechar={fecharChat}
          somenteLeitura={chatSomenteLeitura}
        />
      )}

      {/* ===== MODAL ===== */}
      {modalAberto && medicoSelecionado && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-[90%] md:w-[400px] shadow-xl">
            <h2 className="text-xl font-bold text-blue-400 mb-4 text-center">
              Agendar Consulta
            </h2>

            <p className="text-gray-300 mb-2">
              <b>Médico:</b> {medicoSelecionado.nome}
            </p>
            <p className="text-gray-400 mb-4">
              <b>Especialidade:</b> {medicoSelecionado.especialidade}
            </p>

            <label className="block text-gray-300 mb-2">
              Escolha data e hora:
            </label>
            <input
              type="datetime-local"
              value={dataConsulta}
              onChange={(e) => setDataConsulta(e.target.value)}
              className={
                "w-full bg-gray-800 border text-gray-200 rounded-lg px-3 py-2 mb-2 " +
                (diaSelecionadoIndisponivel
                  ? "border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  : "border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500")
              }
            />

            {/* mensagem de erro se o dia escolhido for indisponível */}
            {dataConsulta && diaSelecionadoIndisponivel && (
              <p className="text-xs text-red-400 mb-3">
                Este médico não atende na data selecionada. Por favor, escolha
                outro dia.
              </p>
            )}

            {/* aviso de dias indisponíveis */}
            <div className="mb-4">
              {carregandoDiasIndisponiveis && (
                <p className="text-xs text-gray-400">
                  Carregando dias indisponíveis do médico...
                </p>
              )}

              {!carregandoDiasIndisponiveis &&
                diasIndisponiveisOrdenados.length > 0 && (
                  <>
                    <p className="text-xs text-gray-400 mb-1">
                      Dias em que este médico <b>não atende</b>:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {diasIndisponiveisOrdenados.map((dia) => {
                        const dataFormatada = new Date(
                          `${dia}T00:00:00`
                        ).toLocaleDateString("pt-BR");
                        return (
                          <span
                            key={dia}
                            className="text-xs bg-red-900/50 border border-red-700 rounded-full px-3 py-1 text-red-200"
                          >
                            {dataFormatada}
                          </span>
                        );
                      })}
                    </div>
                  </>
                )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={fecharModalAgendamento}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarAgendamento}
                disabled={carregandoAgendamento || diaSelecionadoIndisponivel}
                className={`px-4 py-2 rounded-lg font-semibold text-white ${
                  carregandoAgendamento || diaSelecionadoIndisponivel
                    ? "bg-blue-600/50 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {carregandoAgendamento ? "Agendando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
