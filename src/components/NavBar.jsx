import {useState} from "react";
import './Navbar.css';

const Navbar = () =>{
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () =>{
        setIsOpen(!isOpen);
    }

    return(
        <>
        <button className="menu-toggle" onClick={toggleMenu}>
            {isOpen ? "✖": "☰"}
        </button>
        <div className={`navbar ${isOpen ? "open" : ""}`}>
            <img src="/logo.png" alt="" />
            <a className="elemet-navbar" href="/">Login</a>
            <a className="elemet-navbar" href="/home">Ordenes</a>
            <a className="elemet-navbar" href="/productos">Productos</a>
            <a className="elemet-navbar" href="/categorias">Categorias</a>
            <a className="elemet-navbar" href="/historialorden">Historial de ordenes</a>
            <a className="elemet-navbar" href="/usuarios">Usuarios</a>
            <a className="elemet-navbar" href="/clientes">Clientes</a>
        </div>
        </>
    );
};

export default Navbar;