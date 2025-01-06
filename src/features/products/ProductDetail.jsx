import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getProductById } from "../../api/products";

const ProductDetail = ({ cart, setCart }) => {
  const { token } = useAuth(); 
  const { id } = useParams(); // Obtener el ID del producto desde la URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
        try {
          const productData = await getProductById(token, id);
      
          // Si `productData` es un array, asigna el primer elemento
          if (Array.isArray(productData) && productData.length > 0) {
            setProduct(productData[0]);
          } else {
            setProduct(productData);
          }
          console.log(productData);
        } catch (error) {
          setError("Error al cargar el producto.", error);
        } finally {
          setLoading(false);
        }
      };
      

    fetchProduct();
  }, [id]);

  const addToCart = () => {
    const existingProductIndex = cart.findIndex((item) => item.id_producto === product.id_producto);
    let updatedCart;

    if (existingProductIndex >= 0) {
      updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity += 1;
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Guarda en localStorage
    navigate("/home"); // Redirige al carrito después de agregar
  };

  if (loading) return <p>Cargando producto...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Detalles del Producto</h2>
      {product && (
        <div>
          <h3>{product.nombre}</h3>
          <p>Precio: ${product.precio}</p>
          <p>{product.descripcion}</p>
          <button onClick={addToCart}>Agregar al carrito</button>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
