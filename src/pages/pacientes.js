import Link from "next/link";

export default function Pacientes() {
  return (
    <div className="home-container">
      <header className="navbar">
        <div className="logo">
          Agendai<span>+</span>
        </div>
        <nav>
          <Link href="/">Início</Link>
          <Link href="#">Ajuda</Link>
          <Link href="#">Contato</Link>
        </nav>
      </header>

      <main className="main-content">
        <div className="text-section">
          <h1>
            Área do <span>Paciente</span>
          </h1>
          <p>
            Encontre médicos, agende consultas e acompanhe seus horários de forma
            simples e rápida.
          </p>
          <div className="buttons">
            <Link href="/cadastroPaciente" className="btn btn-primary">
              Cadastrar Paciente
            </Link>
            <Link href="/loginPaciente" className="btn btn-secondary">
              Já tenho conta
            </Link>
          </div>
        </div>

        <div className="image-section">
          <img src="/patient.png" alt="Paciente em consulta" />
        </div>
      </main>

      <footer className="footer">
        <p>© 2025 Agendai+. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
