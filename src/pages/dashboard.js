import { useState, useEffect } from 'react';
import { listarHorarios, agendarConsulta } from '../utils/api';

export default function Dashboard() {
  const [medicoId, setMedicoId] = useState('1'); // exemplo de médico
  const [horarios, setHorarios] = useState([]);
  const [horarioSelecionado, setHorarioSelecionado] = useState('');

  useEffect(() => {
    async function fetchHorarios() {
      const data = await listarHorarios(medicoId);
      setHorarios(data);
    }
    fetchHorarios();
  }, [medicoId]);

  const handleAgendar = async (e) => {
    e.preventDefault();
    const data = await agendarConsulta({ medicoId, horario: horarioSelecionado });
    console.log(data);
    alert('Consulta agendada! Veja console para resposta.');
  };

  return (
    <div>
      <h1>Agendamento de Consultas</h1>
      <form onSubmit={handleAgendar}>
        <select onChange={e => setHorarioSelecionado(e.target.value)} value={horarioSelecionado}>
          <option value="">Selecione um horário</option>
          {horarios.map((h, i) => (
            <option key={i} value={h}>{h}</option>
          ))}
        </select>
        <button type="submit">Agendar</button>
      </form>
    </div>
  );
}
