import Link from "next/link";
import "../styles/home.css"; // usa o mesmo estilo base da home

// Versão simples da tela do médico (mantida, mas sem export default)
function MedicosSimples() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "100px",
        color: "#fff",
        backgroundColor: "#0d1b2a",
        height: "100vh",
      }}
    >
      <h1>Área do Médico</h1>
      <p>Em breve: cadastre, edite e gerencie seus horários de atendimento.</p>
    </div>
  );
}

// Versão principal da página (esta será a rota /medicos)
export default function Medicos() {
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
            Área do <span>Médico</span>
          </h1>
          <p>
            Cadastre-se, gerencie seus horários e acompanhe suas consultas de
            forma prática e moderna.
          </p>
          <div className="buttons">
            <Link href="/cadastroMedico" className="btn btn-primary">
              Cadastrar Médico
            </Link>
            <Link href="/loginMedico" className="btn btn-secondary">
              Já tenho conta
            </Link>
          </div>
        </div>

        <div className="image-section">
          <img src="/doctor.png" alt="Médico atendendo paciente" />
        </div>
      </main>

      <footer className="footer">
        <p>© 2025 Agendai+. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
