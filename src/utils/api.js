import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/* =============================
   PACIENTE
============================= */

// 🔹 Cadastrar paciente
export async function cadastrarPaciente(pacienteData) {
  try {
    const response = await axios.post(`${API_URL}/pacientes/cadastro`, pacienteData);
    return response.data;
  } catch (error) {
    console.error("Erro ao cadastrar paciente:", error.response?.data || error.message);
    return { error: error.response?.data?.message || "Erro ao cadastrar paciente" };
  }
}

// 🔹 Login paciente (única versão correta)
export async function loginPaciente(pacienteData) {
  try {
    const body = {
      email: pacienteData.email,
      senha: pacienteData.senha || pacienteData.password,
    };

    console.log("🔍 Enviando login:", body);

    const response = await axios.post(`${API_URL}/pacientes/login`, body);

    console.log("✅ Resposta do backend:", response.data);

    return response.data;
  } catch (error) {
    console.error("❌ Erro no login:", error?.response?.data || error.message);

    return {
      error:
        error?.response?.data?.message ||
        error?.response?.data ||
        error.message ||
        "Erro no login",
    };
  }
}

/* =============================
   MÉDICO
============================= */

// 🔹 Cadastrar médico
export async function cadastrarMedico(medicoData) {
  try {
    const response = await axios.post(`${API_URL}/medicos/cadastro`, medicoData);
    return response.data;
  } catch (error) {
    console.error("Erro ao cadastrar médico:", error.response?.data || error.message);
    return { error: error.response?.data?.message || "Erro ao cadastrar médico" };
  }
}

// 🔹 Login médico
export async function loginMedico(medicoData) {
  try {
    const body = {
      email: medicoData.email,
      senha: medicoData.senha || medicoData.password,
    };

    const response = await axios.post(`${API_URL}/medicos/login`, body);
    return response.data;
  } catch (error) {
    console.error("Erro no login do médico:", error.response?.data || error.message);
    return { error: error.response?.data?.message || "Erro no login do médico" };
  }
}

// 🔹 Buscar médicos por especialidade e, opcionalmente, por nome
export async function buscarMedicosPorEspecialidade(filtros = {}) {
  const { nome = "", especialidade = "" } = filtros;

  // monta a mesma string que o backend espera em req.query.query
  const query = `${nome} ${especialidade}`.trim();
  if (!query) return [];

  try {
    const response = await axios.get(`${API_URL}/medicos/buscar`, {
      params: { query }, // ?query=...
    });

    console.log("👨‍⚕️ Médicos retornados da API:", response.data);
    return response.data; // array de médicos
  } catch (error) {
    console.error(
      "Erro ao buscar médicos:",
      error.response?.data || error.message
    );
    return [];
  }
}


/* =============================
   CONSULTAS
============================= */

// 🔹 Solicitar consulta
export async function agendarConsulta(consultaData) {
  try {
    const body = {
      pacienteId: consultaData.pacienteId || consultaData.idPaciente,
      idMedico: consultaData.idMedico || consultaData.medicoId,
      horario: consultaData.horario || consultaData.data || new Date().toISOString(),
      especialidade: consultaData.especialidade || "",
    };

    if (!body.pacienteId || !body.idMedico || !body.horario) {
      return { error: "Campos obrigatórios ausentes." };
    }

    const response = await axios.post(`${API_URL}/consultas/solicitar`, body);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao solicitar consulta:", error.response?.data || error.message);
    return {
      error: error.response?.data?.message || "Erro ao solicitar consulta",
    };
  }
}

// 🔹 Consultas do paciente
export async function listarConsultasPaciente(idPaciente) {
  try {
    const response = await axios.get(`${API_URL}/consultas/paciente/${idPaciente}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao listar consultas do paciente:", error.response?.data || error.message);
    return [];
  }
}

// 🔹 Consultas do médico
export async function listarConsultasMedico(idMedico) {
  try {
    const response = await axios.get(`${API_URL}/consultas/medico/${idMedico}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao listar consultas do médico:", error.response?.data || error.message);
    return [];
  }
}

// 🔹 Aprovar/Rejeitar
export async function responderConsulta(id, aprovado) {
  const status = aprovado ? "aprovada" : "rejeitada";
  try {
    const response = await axios.put(`${API_URL}/consultas/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar status da consulta:", error.response?.data || error.message);
    return { error: "Erro ao atualizar status da consulta" };
  }
}

// 🔹 Deletar
export async function deletarConsulta(id) {
  try {
    const response = await axios.delete(`${API_URL}/consultas/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar consulta:", error.response?.data || error.message);
    return { error: "Erro ao deletar consulta" };
  }
}

// 🔹 Atualizar status
export async function atualizarStatusConsulta(id, status) {
  try {
    const response = await axios.put(`${API_URL}/consultas/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar status da consulta:", error.response?.data || error.message);
    return { error: "Erro ao atualizar status da consulta" };
  }
}
// 🔹 Listar horários disponíveis de um médico
export async function listarHorarios(idMedico) {
  try {
    // 🔧 AJUSTA ESSA ROTA PARA O QUE TEU BACKEND USA DE VERDADE
    const response = await axios.get(`${API_URL}/medicos/${idMedico}/horarios`);
    return response.data; // por exemplo, um array de horários
  } catch (error) {
    console.error(
      "Erro ao listar horários:",
      error.response?.data || error.message
    );
    return [];
  }
}
