import "../styles/globals.css";   // Tailwind 4
import "../styles/home.css";      // seu CSS custom (chat etc., se quiser manter)
import { AuthProvider } from "../context/AuthContext";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
