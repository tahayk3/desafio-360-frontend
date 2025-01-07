import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getProductById } from "../../api/products";

import Slider from "react-slick"; // Importamos el Slider de slick-carousel
// Importar los estilos de Slick Carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "./ProductDetail.css";

// Importar los estilos de Slick Carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductDetail = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProductById(token, id);
        console.log(productData);
        if (Array.isArray(productData) && productData.length > 0) {
          setProduct(productData[0]);
        } else {
          setProduct(productData);
        }
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

  const images = product?.foto ? product.foto.split(",") : []; // Convertir las URL en un array

  // Configuración del carrusel de Slick
  const slickSettings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="product-detail">
            <marquee direction="left" scrollamount="13">
              <h2>
                Te recomendamos verificar la existencia antes de cualquier compra
              </h2>
            </marquee>
      {product && (
        <div className="product-detail-content">
          <div className="product-info">
            <h2 className="product-title">{product.nombre}</h2>
            <p>
              <strong>Marca:</strong> {product.marca}
            </p>
            <p>
              <strong>Código:</strong> {product.codigo}
            </p>
            <p>
              <strong>Stock:</strong> {product.stock} unidades disponibles
            </p>
            <p>
              <strong>Precio:</strong> Q{product.precio}
            </p>
            <p>
              <strong>Fecha de creación:</strong>{" "}
              {new Date(product.fecha_creacion).toLocaleDateString()}
            </p>
            {product.descripcion && (
              <p>
                <strong>Descripción:</strong> {product.descripcion}
              </p>
            )}
          </div>
          <div className="product-image">
            {images.length > 0 && (
              <Slider {...slickSettings}>
                {images.map((image, index) => (
                  <div key={index}>
                    <img src={image} alt={`Producto ${product.nombre}`} />
                  </div>
                ))}
              </Slider>
            )}
          </div>
        </div>
      )}
      <div className="product-rating">
        <span>⭐⭐⭐⭐☆</span>
        <p>Basado en 150 opiniones</p>
      </div>
      <div className="product-additional-info">
        <p>Envío en 24 horas</p>
        <p>Garantía de 12 meses</p>
      </div>
    </div>
  );
};

export default ProductDetail;
