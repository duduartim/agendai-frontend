import { useState } from 'react';
import { useRouter } from 'next/router';
import { loginPaciente } from '../utils/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Aqui chamamos a função do utils/api
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
    <div>
      <h1>Login de Paciente</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          placeholder="Senha"
          type="password"
          value={senha}
          onChange={e => setSenha(e.target.value)}
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
