import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getProducts, deleteProduct } from "../../api/products";
import CreateProduct from "./ProductCreate";
import { useNavigate } from "react-router-dom";
import ProductFilters from "../../components/ProductFilters";
import "./ProductListA.css";

const ProductListA = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [filters, setFilters] = useState({}); // Estado para filtros

  const { role } = useAuth();
  const navigate = useNavigate();

  // Redirigir si el rol no es 1
  useEffect(() => {
    if (role !== null && role !== undefined && role !== "1") {
      navigate("/"); // Redirigir solo si el rol es conocido pero no permitido
    }
  }, [role, navigate]);

  // Cargar productos de la API
  const fetchProducts = async (page, currentFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts(token, page, currentFilters);
      console.log(data);
      setProducts(data.data || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || 1);
    } catch (error) {
      setError("Error al cargar los productos.");
      console.error("Fetch Error:", error.response || error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilters = (appliedFilters) => {
    setFilters(appliedFilters);
    fetchProducts(1, appliedFilters); // Reiniciar a la página 1 con los nuevos filtros
  };

  useEffect(() => {
    fetchProducts(currentPage, filters);
  }, [currentPage, token, filters]);

  // Manejar desactivación de producto
  const handleDelete = async (product) => {
    if (
      !window.confirm(
        `¿Seguro que quieres desactivar el producto "${product.nombre}"?`
      )
    ) {
      return;
    }

    try {
      await deleteProduct(token, product.id_producto);
      alert("Producto desactivado con éxito.");
      fetchProducts(currentPage);
    } catch (error) {
      console.error("Error al desactivar producto:", error);
      alert("Error al desactivar el producto.");
    }
  };

  // Manejar inicio de edición
  const handleEdit = (product) => {
    setIsEditing(true);
    setCurrentProduct(product);
  };

  // Volver a estado de creación
  const handleResetEditing = () => {
    setIsEditing(false);
    setCurrentProduct(null);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, filters);
  }, [currentPage, token, filters]);

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container-category">
      <div className="container-logo-category">
        <h2>Lista de Productos</h2>
        <div className="container-filters">
          <ProductFilters
            onFilter={handleFilters}
            visibleFilters={{
              name: true,
              priceMin: true,
              priceMax: true,
              active: true,
              category: true,
            }}
          />
        </div>
        <ul>
          {error ? (
            <p>{error}</p>
          ) : loading ? (
            <p>Cargando productos...</p>
          ) : products.length > 0 ? (
            products.map((product) => (
              <li key={product.id_producto}>
                <div className="item-content">
                  <span className="product-name">
                    {product.nombre} - ${product.precio.toFixed(2)}
                  </span>
                  <img className="product-img" src={product.foto} alt="" />
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
            <p>No hay productos disponibles.</p>
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
      <div className="container-form-category">
        <CreateProduct
          onProductSaved={() => {
            fetchProducts(currentPage);
            handleResetEditing();
          }}
          defaultValues={isEditing ? currentProduct : undefined}
          isEditing={isEditing}
        />
      </div>
    </div>
  );
};

export default ProductListA;
