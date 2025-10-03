// pages/cadastro.js
import { useState } from 'react';
import { cadastrarPaciente } from '../utils/api';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await cadastrarPaciente({ nome, email, cpf, telefone });
    console.log(data);
    alert('Cadastro enviado! Veja console para resposta.');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="CPF" value={cpf} onChange={e => setCpf(e.target.value)} />
      <input placeholder="Telefone" value={telefone} onChange={e => setTelefone(e.target.value)} />
      <button type="submit">Cadastrar</button>
    </form>
  );
}
