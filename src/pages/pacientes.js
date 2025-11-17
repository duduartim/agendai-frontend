export default function Pacientes() {
  return (
    <div style={{ textAlign: "center", padding: "100px", color: "#fff", backgroundColor: "#0d1b2a", height: "100vh" }}>
      <h1>Área do Paciente</h1>
      <p>Em breve: busque médicos e agende suas consultas com facilidade.</p>
    </div>
  );
}
import Link from "next/link";
import "../styles/home.css"; // reutiliza o mesmo estilo

export default function Pacientes() {
  return (
    <div className="home-container">
      <header className="navbar">
        <div className="logo">Agendai<span>+</span></div>
        <nav>
          <Link href="/">Início</Link>
          <Link href="#">Ajuda</Link>
          <Link href="#">Contato</Link>
        </nav>
      </header>

      <main className="main-content">
        <div className="text-section">
          <h1>Área do <span>Paciente</span></h1>
          <p>
            Encontre médicos, agende consultas e acompanhe seus horários de forma simples e rápida.
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

