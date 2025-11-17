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
    if (data.error) {
      alert('Erro ao cadastrar: ' + data.error);
    } else {
      alert('Cadastro realizado com sucesso!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">
          Cadastro de Paciente
        </h2>

        <input
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full mb-3 p-3 rounded bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-3 rounded bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          className="w-full mb-3 p-3 rounded bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          placeholder="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          className="w-full mb-3 p-3 rounded bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          placeholder="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full mb-4 p-3 rounded bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}
