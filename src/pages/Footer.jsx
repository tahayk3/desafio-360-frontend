import React from "react";
import { FaTiktok, FaFacebook, FaWhatsapp } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";
import { BsInstagram } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© 2025 Desafio360 Mi Tiendita. Todos los derechos reservados</p>
        <div className="social-icons">
          <a href="#">
            <MdEmail />
          </a>
          <a href="#">
            <BsInstagram />
          </a>
          <a href="#">
            <FaFacebook />
          </a>
          <a href="#">
            <FaTiktok />
          </a>
          <a href="#">
            <FaWhatsapp />
          </a>
          <a href="#">
            <TbWorld />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
