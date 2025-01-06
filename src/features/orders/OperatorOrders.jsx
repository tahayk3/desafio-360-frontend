import { useEffect, useState } from "react";
import { getPedidosPendientes, updateOrderStatus } from "../../api/ordenes";
import { useAuth } from "../../contexts/AuthContext";
import Modal from "react-modal";
import "./OperatorOrders.css";

Modal.setAppElement("#root");

const OperatorOrders = () => {
  const { token, id_usuario } = useAuth();
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [unassignedOrders, setUnassignedOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // Orden seleccionada
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal abierto/cerrado
  const [orderState, setOrderState] = useState(null); // Estado seleccionado

  const fetchPedidosPendientes = async () => {
    try {
      const response = await getPedidosPendientes(token);
      const { data } = response;
      console.log("Data:", data); 
      const assigned = data.filter(
        (pedido) => pedido.id_operador === Number(id_usuario) && pedido.id_estado == 3
      );
      const unassigned = data.filter(
        (pedido) => pedido.id_operador === null && pedido.id_estado == 1
      );

      const assignedOrdersParsed = assigned.map((order) => ({
        ...order,
        productos_detalle: JSON.parse("[" + order.productos_detalle + "]"),
      }));

      const unassignedOrdersParsed = unassigned.map((order) => ({
        ...order,
        productos_detalle: JSON.parse("[" + order.productos_detalle + "]"),
      }));

      setAssignedOrders(assignedOrdersParsed);
      setUnassignedOrders(unassignedOrdersParsed);
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
      await updateOrderStatus(
        3,
        cancelar,
        id_operador,
        token,
        id_pedido
      );
      alert("Estado actualizado correctamente");
      fetchPedidosPendientes(); // Refrescar lista de pedidos
      setIsModalOpen(false); // Cierra el modal después de actualizar
    } catch (error) {
      console.error("Error al actualizar el estado de la orden:", error);
      alert("Hubo un error al actualizar el estado");
    }
  };


  const openOrderModal = (order) => {
    setSelectedOrder(order); // Actualiza selectedOrder
    setOrderState(order.id_estado); // Establece el estado de la orden
    setIsModalOpen(true); // Abre el modal solo si la orden está correctamente seleccionada
  };

  return (
    <div>
      {/* Pedidos entregados/aprobados */}
      <div className="order-section">
      <h2>Pedidos entregados/aprobados por operador ID# {id_usuario}</h2>
        {assignedOrders.map((order) => (
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
              <p>Estado: Aprobado</p>
            </div>
            <button onClick={() => openOrderModal(order)}>Ver Detalle</button>
          </div>
        ))}
      </div>

      {/* Pedidos no asignados */}
      <h2>Pedidos No Asignados / confirmados por el cliente</h2>
      <div className="order-section">
        {unassignedOrders.map((order) => (
          <div className="order-card" key={order.orden_id}>
            <div className="order-card-details">
              <h3>Orden #{order.orden_id}</h3>
              <p>Total: {order.total_orden} USD</p>
              <p>Creación: {new Date(order.fecha_creacion).toLocaleString()}</p>
              <p>Estado: Confirmado</p>
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
            <p>Total: Q {selectedOrder.total_orden}</p>

            {/* Tabla de productos */}
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
                {selectedOrder.productos_detalle.map((producto, index) => (
                  <tr key={index}>
                    <td>{producto.producto}</td>
                    <td>{producto.cantidad}</td>
                    <td>Q {producto.precio}</td>
                    <td>Q {producto.subtotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Cambiar estado */}
            {selectedOrder.id_estado === 1 && (
              <>
                <p>Cambiar estado:</p>
                <select
                  value={orderState}
                  onChange={(e) => setOrderState(Number(e.target.value))}
                >
                  <option value={3}>Entregar/finalizar</option>
                </select>
                <button
                  onClick={() => {
                    if (selectedOrder && selectedOrder.orden_id) {
                      handleStatusChange(
                        orderState,
                        0,
                        id_usuario,
                        token,
                        selectedOrder.orden_id
                      );
                    } else {
                      alert("No se ha seleccionado una orden válida");
                    }
                  }}
                >
                  Confirmar entrega de orden
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
