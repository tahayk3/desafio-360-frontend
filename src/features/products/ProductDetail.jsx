import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getProductById } from "../../api/products";

const ProductDetail = () => {
  const { token } = useAuth(); 
  const { id } = useParams(); // Obtener el ID del producto desde la URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


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
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
