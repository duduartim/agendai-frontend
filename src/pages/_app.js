import "../styles/style.css";
import { AuthProvider } from "../context/AuthContext"; // ✅ importa o contexto

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} /> {/* ✅ envolve toda a aplicação */}
    </AuthProvider>
  );
}
