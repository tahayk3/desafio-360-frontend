import { useEffect, useState } from "react";
import {
  getPedidosPendientes,
  updateOrderStatus,
  updatePedidosPendientes,
} from "../../api/ordenes";
import { useAuth } from "../../contexts/AuthContext";
import Modal from "react-modal";
import "./ClientsOrders.css";

const OperatorOrders = () => {
  const { token, id_usuario } = useAuth();
  const [ordenesPendientes, setOrdenesPendientes] = useState([]);
  const [ordenesCanceladas, setOrdenesCanceladas] = useState([]);
  const [ordenesFinalizadas, setOrdenesFinalizadas] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderState, setOrderState] = useState(null);

  const fetchPedidosPendientes = async () => {
    try {
      const response = await getPedidosPendientes(token);
      const { data } = response;

      console.log("Data:", data);

      const ordenesDeUsuario = data.filter(
        (pedido) => pedido.id_cliente === Number(id_usuario)
      );

      const ordenesPendientes = ordenesDeUsuario.filter(
        (pedido) =>
          pedido.id_operador === null &&
          pedido.activo == true &&
          pedido.id_estado === 1
      );
      const ordenesCanceladas = ordenesDeUsuario.filter(
        (pedido) => pedido.id_estado === 2 && pedido.activo == false
      );
      const ordenesFinalizadas = ordenesDeUsuario.filter(
        (pedido) => pedido.id_estado === 3
      );

      const parseDetalles = (ordenes) =>
        ordenes.map((order) => ({
          ...order,
          productos_detalle: JSON.parse("[" + order.productos_detalle + "]"),
        }));

      setOrdenesPendientes(parseDetalles(ordenesPendientes));
      setOrdenesCanceladas(parseDetalles(ordenesCanceladas));
      setOrdenesFinalizadas(parseDetalles(ordenesFinalizadas));
    } catch (error) {
      console.error("Error al obtener pedidos pendientes:", error);
    }
  };

  useEffect(() => {
    fetchPedidosPendientes();
  }, [token]);

  const handleStatusChange = async (
    nuevo_estado,
    cancelar,
    id_operador,
    token,
    id_pedido
  ) => {
    try {
      console.log("El token es:", token);
      id_operador = null;

      // Llamar a updatePedidosPendientes
      await updatePedidosPendientes(token, id_pedido);

      await updateOrderStatus(
        parseInt(nuevo_estado),
        cancelar,
        id_operador,
        token,
        id_pedido
      );

      alert("Estado actualizado correctamente");
      fetchPedidosPendientes();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al actualizar el estado de la orden:", error);
      alert("Hubo un error al actualizar el estado");
    }
  };

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
    setOrderState(order.id_estado);
    setIsModalOpen(true);
  };

  return (
    <div className="orders-container">
      {/* Órdenes pendientes / confirmado */}
      <div className="order-section">
        <h2>Órdenes pendientes / confirmadas</h2>
        {ordenesPendientes.map((order) => (
          <div className="order-card" key={order.orden_id}>
            <div className="order-card-details">
              <h3>Orden #{order.orden_id}</h3>
              <p>Total: {order.total_orden} USD</p>
              <p>Creación: {new Date(order.fecha_creacion).toLocaleString()}</p>
              <p>
                Entrega:{" "}
                {order.fecha_entrega
                  ? new Date(order.fecha_entrega).toLocaleDateString()
                  : "Sin especificar"}
              </p>
              <p>Estado: Pendiente</p>
            </div>
            <button onClick={() => openOrderModal(order)}>Ver Detalle</button>
          </div>
        ))}
      </div>

      {/* Órdenes canceladas */}
      <div className="order-section">
        <h2>Órdenes canceladas</h2>
        {ordenesCanceladas.map((order) => (
          <div className="order-card" key={order.orden_id}>
            <div className="order-card-details">
              <h3>Orden #{order.orden_id}</h3>
              <p>Total: {order.total_orden} USD</p>
              <p>Creación: {new Date(order.fecha_creacion).toLocaleString()}</p>
              <p>Estado: Cancelada</p>
            </div>
            <button onClick={() => openOrderModal(order)}>Ver Detalle</button>
          </div>
        ))}
      </div>

      {/* Órdenes finalizadas / entregadas */}
      <div className="order-section">
        <h2>Órdenes finalizadas / entregadas</h2>
        {ordenesFinalizadas.map((order) => (
          <div className="order-card" key={order.orden_id}>
            <div className="order-card-details">
              <h3>Orden #{order.orden_id}</h3>
              <p>Total: {order.total_orden} USD</p>
              <p>Creación: {new Date(order.fecha_creacion).toLocaleString()}</p>
              <p>
                Entrega:{" "}
                {order.fecha_entrega
                  ? new Date(order.fecha_entrega).toLocaleDateString()
                  : "Sin especificar"}
              </p>
              <p>Estado: Finalizada</p>
            </div>
            <button onClick={() => openOrderModal(order)}>Ver Detalle</button>
          </div>
        ))}
      </div>

      {/* Modal para ver detalles */}
      <Modal
        isOpen={isModalOpen && selectedOrder != null}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Detalles del Pedido"
        className="modal"
        overlayClassName="overlay"
      >
        {selectedOrder ? (
          <div>
            <h2>Detalle de la Orden #{selectedOrder.orden_id}</h2>
            <p>
              Creación:{" "}
              {new Date(selectedOrder.fecha_creacion).toLocaleString()}
            </p>
            <p>Entrega: {selectedOrder.fecha_entrega || "Sin especificar"}</p>
            <p>Total: Q{selectedOrder.total_orden}</p>

            <div>{renderProductoDetalle(selectedOrder.productos_detalle)}</div>

            {selectedOrder.id_estado === 1 && (
              <>
                <p>Cambiar estado:</p>
                <select
                  value={orderState}
                  onChange={(e) => setOrderState(Number(e.target.value))}
                >
                  <option value={2}>Cancelar</option>
                </select>

                <button
                  onClick={() =>
                    handleStatusChange(
                      orderState,
                      1,
                      id_usuario,
                      token,
                      selectedOrder.orden_id
                    )
                  }
                >
                  Cancelar Orden
                </button>
              </>
            )}

            <button onClick={() => setIsModalOpen(false)}>Cerrar</button>
          </div>
        ) : (
          <p>Cargando detalles...</p>
        )}
      </Modal>
    </div>
  );
};

export default OperatorOrders;
