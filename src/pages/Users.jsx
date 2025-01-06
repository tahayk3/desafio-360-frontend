import { useAuth } from "../contexts/AuthContext";
import Register from "./Register";
import { getUsers, disableUser } from "../api/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const navigate = useNavigate();
  const { token, role } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});


  useEffect(() => {
    if (role !== null && role !== undefined && role !== "1") {
      navigate("/"); 
    }
  }, [role, navigate]);

  const fetchUsuarios = async (page) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsers(token, page);
      setUsuarios(data.data || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || 1);
    } catch (error) {
      setError("Error al cargar las categorias.");
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (usuario) => {
    if (
      !window.confirm(
        `¿Seguro que quieres desactivar al usuario con el correo:  "${usuario.correo} y nombre: ${usuario.nombre_completo} "?`
      )
    ) {
      return;
    }

    try {
      await disableUser(token, usuario.id_usuario);
      alert("Usuario desactivado con éxito.");
      fetchUsuarios(currentPage);
    } catch (error) {
      console.error("Error al desactivar categoria:", error);
      alert("Error al desactivar la categoria.");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleFilters = (appliedFilters) => {
    setFilters(appliedFilters);
    fetchUsuarios(1, appliedFilters); // Reiniciar a la página 1 con los nuevos filtros
  };

  useEffect(() => {
    fetchUsuarios(currentPage, filters);
  }, [currentPage, token, filters]);

  if (loading) return <p>Cargando categorias...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <div className="container-logo">

        <h2>Lista de Categorias</h2>
        <ul>
          {usuarios.length > 0 ? (
            usuarios.map((usuario) => (
              <li key={usuario.id_usuario}>
                <div className="item-content">
                  <span className="category-name">{usuario.correo}</span>
                  <div className="actions">
                    <button onClick={() => handleDelete(usuario)}>
                      Desactivar
                    </button>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p>No hay categorias disponibles.</p>
          )}
        </ul>

        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>
      </div>
      <div className="container-form">
        <Register />
      </div>
    </div>
  );
};

export default Users;
