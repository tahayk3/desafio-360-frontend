import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout(); // Llamar a la función logout del contexto
    navigate("/"); // Redirigir al login
  };

  return (
    <>
      <button className="menu-toggle" onClick={toggleMenu}>
        {isOpen ? "✖" : "☰"}
      </button>
      <div className={`navbar ${isOpen ? "open" : ""}`}>
        <img src="/logo.png" alt="Logo" />
        <a className="elemet-navbar" href="/home">Ordenes</a>
        <a className="elemet-navbar" href="/productos">Productos</a>
        <a className="elemet-navbar" href="/categorias">Categorias</a>
        <a className="elemet-navbar" href="/historialorden">Historial de ordenes</a>
        <a className="elemet-navbar" href="/usuarios">Usuarios</a>
        <a className="elemet-navbar" href="/clientes">Clientes</a>
        {/* Botón de cerrar sesión */}
        <button className="close-session-navbar" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </>
  );
};

export default Navbar;