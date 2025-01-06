import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import CategoryCreate from "./CategoryCreate";
import { getCategorias, deleteCategoria } from "../../api/categorias";
import { useNavigate } from "react-router-dom";
import "./CategoryList.css";

const CategoryList = () => {
  const { token } = useAuth();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategoria, setCurrentCategoria] = useState(null);

  const { role } = useAuth();
  const navigate = useNavigate();

  // Redirigir si el rol no es 1
  useEffect(() => {
    if (role !== null && role !== undefined && role !== "1") {
      navigate("/"); // Redirigir solo si el rol es conocido pero no permitido
    }
  }, [role, navigate]);

  // Cargar productos de la API
  const fetchCategorias = async (page) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCategorias(token, page);
      setCategorias(data.data || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || 1);
    } catch (error) {
      setError("Error al cargar las categorias.");
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Manejar desactivación de producto
  const handleDelete = async (categoria) => {
    if (
      !window.confirm(
        `¿Seguro que quieres desactivar la categoria "${categoria.nombre_categoria}"?`
      )
    ) {
      return;
    }

    try {
      await deleteCategoria(token, categoria.id_categoria_producto);
      alert("Categoria desactivado con éxito.");
      fetchCategorias(currentPage);
    } catch (error) {
      console.error("Error al desactivar categoria:", error);
      alert("Error al desactivar la categoria.");
    }
  };

  // Manejar inicio de edición
  const handleEdit = (categoria) => {
    setIsEditing(true);
    setCurrentCategoria(categoria);
  };

  // Volver a estado de creación
  const handleResetEditing = () => {
    setIsEditing(false);
    setCurrentCategoria(null);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    fetchCategorias(currentPage);
  }, [currentPage, token]);

  if (loading) return <p>Cargando categorias...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <div className="container-logo">
        <h2>Lista de Categorias</h2>
        <ul>
          {categorias.length > 0 ? (
            categorias.map((product) => (
              <li key={product.nombre_categoria}>
                <div className="item-content">
                  <span className="category-name">
                    {product.nombre_categoria}
                  </span>
                  <div className="actions">
                    <button onClick={() => handleEdit(product)}>Editar</button>
                    <button onClick={() => handleDelete(product)}>
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
        <CategoryCreate
          onProductSaved={() => {
            fetchCategorias(currentPage);
            handleResetEditing();
          }}
          defaultValues={isEditing ? currentCategoria : undefined}
          isEditing={isEditing}
        />
      </div>
    </div>
  );
};

export default CategoryList;
