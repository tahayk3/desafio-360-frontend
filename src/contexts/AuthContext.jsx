import  { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getUserById } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("jwt") || null);
  const [role, setRole] = useState(localStorage.getItem("userRole" )|| null);
  const [id_usuario, setIdUsuario] = useState(localStorage.getItem("userId") || null);


  // Función para iniciar sesión
  const login = async (jwtToken) => {
    try {
      // Decodificar el token para obtener el ID del usuario
      const decoded = jwtDecode(jwtToken);

      //Datos completos del usuario
      const userData = await getUserById(decoded.id, jwtToken);

      // Actualizar estado y almacenamiento local
      setUser(userData);
      setToken(jwtToken);
      setRole(userData[0]?.id_rol);
      setIdUsuario(userData[0]?.id_usuario);

      //Guardar persistencia
      localStorage.setItem("jwt", jwtToken);
      localStorage.setItem("userRole", userData[0]?.id_rol);
      localStorage.setItem("userId", userData[0]?.id_usuario);

    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("jwt");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
  };

  // Mantener la sesión activa al recargar la página
  useEffect(() => {
    const existingToken = localStorage.getItem("jwt");
    const existingRole = localStorage.getItem("userRole");
    const existingId = localStorage.getItem("userId");
    if (existingToken) {
      // Recuperar sesión con el token existente
      setToken(existingToken);
      setRole(existingRole);
      setIdUsuario(existingId);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, role, id_usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);