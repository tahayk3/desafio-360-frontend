import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getProducts } from "../../api/products";
import ProductFilters from "../../components/ProductFilters";
import Cart from "../../components/Cart";
import { GiClick } from "react-icons/gi";
import { HiCursorClick } from "react-icons/hi";
import { MdFactory } from "react-icons/md";
import { PiMoneyWavy } from "react-icons/pi";
import "./ProductList.css";
import { GiShoppingCart } from "react-icons/gi";

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
        setProducts([]);
      }
    } catch (error) {
      setError("Error al cargar los productos.", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilters = (appliedFilters) => {
    setFilters(appliedFilters);
    fetchProducts(1, appliedFilters);
  };

  useEffect(() => {
    fetchProducts(currentPage, filters);
  }, [currentPage, token, filters]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Solo sincroniza el carrito desde localStorage cuando el componente se monta.
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCart(parsedCart);
    } else {
      setCart([]);
    }
  }, []);

  useEffect(() => {
    // Al cambiar el carrito, actualiza localStorage en ProductList
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]); // Cada vez que el carrito cambia, sincroniza con localStorage

  const addToCart = (product) => {
    const existingProductIndex = cart.findIndex(
      (item) => item.id_producto === product.id_producto
    );

    let updatedCart;

    if (existingProductIndex >= 0) {
      updatedCart = cart.map((item, index) =>
        index === existingProductIndex
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      // Producto nuevo al carrito
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Actualiza localStorage
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Cart cart={cart} setCart={setCart} />
      <h2 className="title">Lista de Productos</h2>

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
            <div className="card" key={product.id}>
              {product.stock > 0 && (
                <button
                  className="add-to-cart-button"
                  onClick={() => addToCart(product)}
                >
                  Agregar <GiShoppingCart/>
                </button>
              )}
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
              <button
                className="card-view-more"
                onClick={() => navigate(`/product/${product.id_producto}`)}
              >
                <p>
                  Ver más
                  <GiClick />
                </p>
              </button>
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
