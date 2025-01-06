import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getProducts } from "../../api/products";
import ProductFilters from "../../components/ProductFilters";
import Cart from "../../components/Cart";
import { GiClick } from "react-icons/gi";
import { HiCursorClick } from "react-icons/hi";
import { FaRulerHorizontal } from "react-icons/fa";
import { MdFactory } from "react-icons/md";
import { PiMoneyWavy } from "react-icons/pi";
import { RiProductHuntLine } from "react-icons/ri";
import "./ProductList.css";

const ProductList = () => {
  const { token } = useAuth(); // Token del usuario logueado
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]); // Estado del carrito
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({}); // Estado para filtros
  const navigate = useNavigate();

  const fetchProducts = async (page, currentFilters = filters) => {
    try {
      setLoading(true);
      const enforcedFilters = { ...currentFilters, active: 1 };

      const data = await getProducts(token, page, enforcedFilters);

      if (Array.isArray(data.data)) {
        setProducts(data.data); // Los productos están en `data.data`
        setTotalPages(data.totalPages || 1); // Ajuste de totalPages
      } else {
        setProducts([]); // Si no es un array válido, asignamos un array vacío
      }
    } catch (error) {
      setError("Error al cargar los productos.", error);
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

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Cart cart={cart} setCart={setCart} />
      <h2>Lista de Productos</h2>

      <ProductFilters
        onFilter={handleFilters}
        visibleFilters={{
          name: true,
          priceMin: true,
          priceMax: true,
          active: false,
          category: true,
        }}
      />

      <marquee direction="left" scrollamount="13">
        <h2>
          <GiClick /> Clic en la imagen para más información <HiCursorClick />
        </h2>
      </marquee>

      <div className="container-cards">
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => (
            <div
              className="card"
              key={product.id}
              onClick={() => navigate(`/product/${product.id_producto}`)}
            >
              <div className="card-image">
                <img src={product.foto} alt={product.name} />
              </div>
              <div
                className={`card-text ${
                  product.stock === 0 ? "out-of-stock" : ""
                }`}
              >
                <h3 className="card-title">{product.nombre}</h3>
                <p className="card-body">
                  <PiMoneyWavy /> Precio: {product.precio} Q
                </p>
                <p className="card-body">
                  <MdFactory /> Marca: {product.marca}
                </p>
                {product.stock === 0 && (
                  <p className="card-body stock-warning">🚫 Sin stock</p>
                )}
              </div>
              {product.stock > 0 && (
                <div className="card-view-more">
                  <p>
                    Ver más
                    <GiClick />
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No hay productos disponibles.</p>
        )}
      </div>

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
  );
};

export default ProductList;
