import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
// Agrega la función `registrarCompra`
import { registrarCompra } from "../api/crearCompra";
import { GiShoppingCart } from "react-icons/gi";
import "./Cart.css";

const Cart = ({ cart, setCart }) => {
  const { token } = useAuth();
  const [deliveryDate, setDeliveryDate] = useState("");
  const [isCartVisible, setIsCartVisible] = useState(false);

  // Función para eliminar un producto del carrito
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id_producto !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Actualiza localStorage
  };

  const updateQuantity = (productId, quantity) => {
    const validQuantity = isNaN(quantity) || quantity < 1 ? 1 : Math.floor(quantity);
  
    const updatedCart = cart.map((item) =>
      item.id_producto === productId
        ? { ...item, quantity: validQuantity }
        : item
    );
    
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Actualiza localStorage
  };

  

  // Calcular el total del carrito
  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + item.precio * item.quantity, 0);
  };

  // Manejar la compra
  const handlePurchase = async () => {
    const data = {
      fecha_entrega: deliveryDate, 
      id_cliente: localStorage.getItem("userId"),
      detalles: cart.map((item) => ({
        id_producto: item.id_producto,
        cantidad: item.quantity,
      })),
    };

    try {
      const response = await registrarCompra(data, token);
      alert(response.message);
      setCart([]); // Limpia el carrito tras finalizar la compra.
      localStorage.removeItem("cart"); // Limpia el carrito del localStorage.
    } catch (error) {
      alert("Error al procesar la compra: " + error.message);
    }
  };
  const toggleCartVisibility = () => {
    setIsCartVisible(!isCartVisible);
  };

  // Función para cancelar la compra y borrar el carrito
  const cancelPurchase = () => {
    setCart([]); // Limpia el carrito en el estado
    localStorage.removeItem("cart"); // Limpia el carrito en el localStorage
  };


  return (
    <div className="cart-container">
      <button className="toggle-cart-button" onClick={toggleCartVisibility}>
        {isCartVisible ? "Cerrar Carrito " : "Ver Carrito"}
        <GiShoppingCart />
      </button>

      {isCartVisible && (
        <div className="cart-popup">
          <h2 className="cart-title">Carrito de Compras</h2>
          {cart.length === 0 ? (
            <p className="cart-empty">Tu carrito está vacío.</p>
          ) : (
            <ul className="cart-list">
              {cart.map((product) => (
                <li key={product.id_producto} className="cart-item">
                  <div>
                    <span className="product-name">{product.nombre}</span> -
                    <span className="product-price">Q {product.precio}</span> x
                    <span className="product-quantity">{product.quantity}</span>
                  </div>
                  <input
                    type="number"
                    className="quantity-input"
                    min="1"
                    value={product.quantity}
                    onChange={(e) =>
                      updateQuantity(
                        product.id_producto,
                        parseInt(e.target.value)
                      )
                    }
                  />
                  <button
                    className="remove-button"
                    onClick={() => removeFromCart(product.id_producto)}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          )}
          <h3 className="cart-total">Total: Q {calculateTotal()}</h3>
          <div className="delivery-info">
            <label>
              Fecha y Hora de Entrega:
              <input
                type="date"
                className="delivery-input"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
              />
            </label>
          </div>
          <button
            className="purchase-button"
            onClick={handlePurchase}
            disabled={cart.length === 0}
          >
            Confirmar Compra
          </button>

          <button
            className="cancel-button"
            onClick={cancelPurchase}
            disabled={cart.length === 0}
          >
            Rechazar
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
