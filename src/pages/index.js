import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Bem-vindo ao AgendAi</h1>
      <p>Escolha uma opção:</p>
      <ul>
        <li><Link href="/cadastro">Cadastro de Pacientes</Link></li>
        <li><Link href="/login">Login de Pacientes</Link></li>
        <li><Link href="/dashboard">Dashboard / Agendamento</Link></li>
      </ul>
    </div>
  );
}
