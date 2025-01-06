import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getPedidosPendientes } from "../../api/ordenes";
import Modal from "react-modal";

const OrderManager = ({ id_usuario, token }) => {
  const [ordenesPendientes, setOrdenesPendientes] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statusMap = {
    1: 'Pendiente',
    2: 'Cancelado',
    3: 'Completada',
  };

  const fetchPedidosPendientes = async () => {
    try {
      const response = await getPedidosPendientes(token);
      const { data } = response;

      console.log("Data:", data);

      const ordenesPendientes = data.filter(
        (pedido) => pedido.id_cliente === Number(id_usuario)
      );

      const parseDetalles = (ordenes) =>
        ordenes.map((order) => ({
          ...order,
          productos_detalle: JSON.parse("[" + order.productos_detalle + "]"),
        }));

      setOrdenesPendientes(parseDetalles(ordenesPendientes));
    } catch (error) {
      console.error("Error al obtener pedidos pendientes:", error);
    }
  };

  useEffect(() => {
    fetchPedidosPendientes();
  }, [token, id_usuario]);

  const renderProductoDetalle = (productos) => (
    <div>
      <h3>Productos en la Orden</h3>
      <table className="products-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto, index) => (
            <tr key={index}>
              <td>{producto.producto}</td>
              <td>{producto.cantidad}</td>
              <td>Q {producto.precio}</td>
              <td>Q {producto.subtotal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <div className="orders-container">
      <div className="order-section">
        <h2>Pedidos</h2>
        {ordenesPendientes.map((order) => (
          <div className="order-card" key={order.orden_id}>
            <div className="order-card-details">
              <h3>Orden #{order.orden_id}</h3>
              <p>Total: {order.total_orden} Q </p>
              <p>Creación: {new Date(order.fecha_creacion).toLocaleString()}</p>
              <p>
                Entrega:{" "}
                {order.fecha_entrega
                  ? new Date(order.fecha_entrega).toLocaleDateString()
                  : "Sin especificar"}
              </p>
              <p>Estado: {statusMap[order.id_estado] || 'Desconocido'}</p>
            </div>
            <button onClick={() => openOrderModal(order)}>Ver Detalle</button>
          </div>
        ))}
      </div>
      {/* Similar sections for canceladas and finalizadas... */}

      <Modal
        isOpen={isModalOpen && selectedOrder != null}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Detalles del Pedido"
        className="modal"
        overlayClassName="overlay"
      >
        {selectedOrder && (
          <div>
            <h2>Detalle de la Orden #{selectedOrder.orden_id}</h2>
            <p>
              Creación:{" "}
              {new Date(selectedOrder.fecha_creacion).toLocaleString()}
            </p>
            <p>Entrega: {selectedOrder.fecha_entrega || "Sin especificar"}</p>
            <p>Total: Q{selectedOrder.total_orden}</p>

            <div>{renderProductoDetalle(selectedOrder.productos_detalle)}</div>

            <button onClick={() => setIsModalOpen(false)}>Cerrar</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

OrderManager.propTypes = {
  id_usuario: PropTypes.number.isRequired,
  token: PropTypes.string.isRequired,
};

export default OrderManager;
