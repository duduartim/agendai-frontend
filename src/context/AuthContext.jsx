"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregado, setCarregado] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const pacienteAuth = localStorage.getItem("authPaciente");
      const medicoAuth = localStorage.getItem("authMedico");

      if (pacienteAuth) {
        const paciente = JSON.parse(pacienteAuth);
        setUsuario({
          tipo: "paciente",
          nome: paciente.nome,
          email: paciente.email,
        });
      } else if (medicoAuth) {
        const medico = JSON.parse(medicoAuth);
        setUsuario({
          tipo: "medico",
          nome: medico.nome,
          email: medico.email,
        });
      } else {
        setUsuario(null);
      }
    } catch (e) {
      console.error("Erro ao carregar login:", e);
      setUsuario(null);
    } finally {
      setCarregado(true);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("authPaciente");
    localStorage.removeItem("authMedico");
    setUsuario(null);
    router.push("/");
  };

  const login = (tipo, dados) => {
    if (tipo === "paciente") {
      localStorage.setItem("authPaciente", JSON.stringify(dados));
    } else if (tipo === "medico") {
      localStorage.setItem("authMedico", JSON.stringify(dados));
    }
    setUsuario({ tipo, ...dados });
  };

  return (
    <AuthContext.Provider value={{ usuario, carregado, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
