import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();

  // Si no hay un token, redirigir al login
  if (!token) {
    return <Navigate to="/" />;
  }

  // Si está autenticado, renderizar el contenido
  return children;
};

export default PrivateRoute;
