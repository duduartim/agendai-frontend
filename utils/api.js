// utils/api.js

// URL do backend no Render
const BASE_URL = 'https://agendai-backend-zd4p.onrender.com';

// Cadastro de paciente
export const cadastrarPaciente = async (dados) => {
  try {
    const res = await fetch(`${BASE_URL}/pacientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    return await res.json();
  } catch (error) {
    console.error('Erro ao cadastrar paciente:', error);
    return { error: 'Falha na requisição' };
  }
};

// Login de paciente
export const loginPaciente = async (dados) => {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    return await res.json();
  } catch (error) {
    console.error('Erro no login:', error);
    return { error: 'Falha na requisição' };
  }
};

// Listar horários disponíveis de um médico
export const listarHorarios = async (idMedico) => {
  try {
    const res = await fetch(`${BASE_URL}/medicos/${idMedico}/horarios`);
    return await res.json();
  } catch (error) {
    console.error('Erro ao listar horários:', error);
    return { error: 'Falha na requisição' };
  }
};

// Agendar consulta
export const agendarConsulta = async (dados) => {
  try {
    const res = await fetch(`${BASE_URL}/consultas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    return await res.json();
  } catch (error) {
    console.error('Erro ao agendar consulta:', error);
    return { error: 'Falha na requisição' };
  }
};
// pages/cadastro.js
import { useState } from 'react';
import { cadastrarPaciente } from '../utils/api';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await cadastrarPaciente({ nome, email, cpf, telefone, senha });
    console.log(data);
    if (data.error) {
      alert('Erro ao cadastrar: ' + data.error);
    } else {
      alert('Cadastro enviado com sucesso!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="CPF" value={cpf} onChange={e => setCpf(e.target.value)} />
      <input placeholder="Telefone" value={telefone} onChange={e => setTelefone(e.target.value)} />
      <input placeholder="Senha" type="password" value={senha} onChange={e => setSenha(e.target.value)} />
      <button type="submit">Cadastrar</button>
    </form>
  );
}
// pages/login.js
import { useState } from 'react';
import { loginPaciente } from '../utils/api';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await loginPaciente({ email, senha });

    if (data.token) {
      localStorage.setItem('token', data.token); // salva token localmente
      alert('Login bem-sucedido!');
      router.push('/dashboard'); // redireciona para dashboard
    } else {
      alert('Erro no login! Verifique suas credenciais.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Senha" type="password" value={senha} onChange={e => setSenha(e.target.value)} />
      <button type="submit">Entrar</button>
    </form>
  );
}
