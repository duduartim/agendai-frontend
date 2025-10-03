// pages/agendamento.js
import { useState, useEffect } from 'react';
import { listarHorarios, agendarConsulta } from '../utils/api';

export default function Agendamento() {
  const [medicoId, setMedicoId] = useState(''); // ID do médico selecionado
  const [horarios, setHorarios] = useState([]);  // Horários disponíveis
  const [paciente, setPaciente] = useState('');  // Nome ou ID do paciente
  const [horarioSelecionado, setHorarioSelecionado] = useState('');

  // Função para buscar horários quando um médico é selecionado
  const buscarHorarios = async () => {
    if (!medicoId) return;
    const dados = await listarHorarios(medicoId);
    setHorarios(dados);
  };

  useEffect(() => {
    buscarHorarios();
  }, [medicoId]);

  const handleAgendar = async (e) => {
    e.preventDefault();
    const data = await agendarConsulta({
      paciente,
      medicoId,
      horario: horarioSelecionado
    });
    if (data.error) {
      alert('Erro: ' + data.error);
    } else {
      alert('Consulta agendada com sucesso!');
    }
  };

  return (
    <div>
      <h1>Agendar Consulta</h1>

      <form onSubmit={handleAgendar}>
        <input
          placeholder="Seu nome"
          value={paciente}
          onChange={e => setPaciente(e.target.value)}
        />

        <input
          placeholder="ID do médico"
          value={medicoId}
          onChange={e => setMedicoId(e.target.value)}
        />

        <select
          value={horarioSelecionado}
          onChange={e => setHorarioSelecionado(e.target.value)}
        >
          <option value="">Selecione um horário</option>
          {horarios.map((h, index) => (
            <option key={index} value={h}>
              {h}
            </option>
          ))}
        </select>

        <button type="submit">Agendar</button>
      </form>
    </div>
  );
}