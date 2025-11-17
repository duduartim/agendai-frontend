import "../styles/globals.css"; // Tailwind 4
import "../styles/home.css";    // seu CSS do chat
import { AuthProvider } from "../context/AuthContext";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
