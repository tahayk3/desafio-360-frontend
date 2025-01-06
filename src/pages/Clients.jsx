import { useAuth } from "../contexts/AuthContext";
import { getUsers, disableUser, updateUser } from "../api/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import { userSchemas } from "../validations/RegisterSchema";
import OrderManager from "../features/orders/OrderManager";
import "./Clients.css";

const Clients = () => {
  const navigate = useNavigate();
  const { token, role } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUsuario, setCurrentUsuario] = useState(null);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Redirigir si el rol no es 1
  useEffect(() => {
    if (role !== null && role !== undefined && role !== "1") {
      navigate("/"); // Redirigir solo si el rol es conocido pero no permitido
    }
  }, [role, navigate]);

  const schema = userSchemas["clienteOperador"];

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      if (isEditing && currentUsuario) {
        const formattedDate = data.fecha_nacimiento
          ? new Date(data.fecha_nacimiento).toISOString().split("T")[0]
          : null;

        const preparedData = {
          correo: data.correo,
          nombre_completo: data.name,
          telefono: data.telefono,
          fecha_nacimiento: formattedDate,
          razon_social: data.razon_social || null,
          nombre_comercial: data.nombre_comercial || null,
          direccion_entrega: data.direccion_entrega || null,
        };

        await updateUser(token, currentUsuario.id_usuario, preparedData);
        alert("Usuario actualizado con éxito.");
        fetchUsuarios(currentPage); // Recargar lista de usuarios
        clearForm(); // Limpiar estado del formulario
      }
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const fetchUsuarios = async (page) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsers(token, page);
      setUsuarios(data.data || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || 1);
    } catch (error) {
      setError("Error al cargar los usuarios.");
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (usuario) => {
    if (
      !window.confirm(
        `¿Seguro que quieres desactivar al usuario con el correo: "${usuario.correo}" y nombre: ${usuario.nombre_completo}?`
      )
    ) {
      return;
    }

    try {
      await disableUser(token, usuario.id_usuario);
      alert("Usuario desactivado con éxito.");
      fetchUsuarios(currentPage);
    } catch (error) {
      console.error("Error al desactivar el usuario:", error);
      alert("Error al desactivar el usuario.");
    }
  };

  const handleEdit = (usuario) => {
    setIsEditing(true);
    setCurrentUsuario(usuario);

    // Prellenar el formulario con los datos actuales del usuario
    const defaults = {
      name: usuario.nombre_completo || "",
      correo: usuario.correo || "",
      telefono: usuario.telefono || "",
      fecha_nacimiento: usuario.fecha_nacimiento || "",
      razon_social: usuario.razon_social || "",
      nombre_comercial: usuario.nombre_comercial || "",
      direccion_entrega: usuario.direccion_entrega || "",
    };
    Object.keys(defaults).forEach((key) => {
      setValue(key, defaults[key]);
    });
  };

  const clearForm = () => {
    reset();
    setIsEditing(false);
    setCurrentUsuario(null);
  };

  useEffect(() => {
    fetchUsuarios(currentPage);
  }, [currentPage, token]);

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>{error}</p>;

  const openOrderModal = (userId) => {
    setSelectedUserId(userId);
    setIsOrderModalOpen(true);
  };

  const closeOrderModal = () => {
    setSelectedUserId(null);
    setIsOrderModalOpen(false);
  };

  return (
    <div className="container">
      <div className="container-logo">
        <h2>Lista de Clientes</h2>

        <ul className="user-list">
          {usuarios.length > 0 ? (
            usuarios
              .filter((usuario) => usuario.id_rol === 2)
              .map((usuario) => (
                <li key={usuario.id_usuario}>
                  <div className="user-item">
                    <h3>{usuario.nombre_completo || "Sin Nombre"}</h3>
                    <p>Correo: {usuario.correo}</p>
                    <p>Teléfono: {usuario.telefono || "No disponible"}</p>
                    <p>
                      Rol: {usuario.id_rol === 1 ? "Operador" : "Cliente"} |
                      Estado: {usuario.id_estado === 3 ? "Activo" : "Inactivo"}
                    </p>
                    <div className="actions">
                      <button onClick={() => handleEdit(usuario)}>
                        Editar
                      </button>
                      <button onClick={() => handleDelete(usuario)}>
                        Desactivar
                      </button>
                      <button
                        onClick={() => openOrderModal(usuario.id_usuario)}
                      >
                        Ver Pedidos
                      </button>
                    </div>
                  </div>
                </li>
              ))
          ) : (
            <p>No hay usuarios disponibles.</p>
          )}
        </ul>

        {isOrderModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="modal-close" onClick={closeOrderModal}>
                Cerrar
              </button>
              <div className="modal-body">
                <OrderManager id_usuario={selectedUserId} token={token} />
              </div>
            </div>
          </div>
        )}

        <div className="pagination">
          <button
            onClick={() => fetchUsuarios(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => fetchUsuarios(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>
      </div>

      <div className="container-form">
        <h2 className="title">Editar Usuario</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">Nombre completo:</label>
            <input className="form-input" {...register("name")} />
            {errors.name && <p>{errors.name.message}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Correo electrónico:</label>
            <input className="form-input" {...register("correo")} />
            {errors.correo && <p>{errors.correo.message}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Teléfono:</label>
            <input
              className="form-input"
              type="number"
              {...register("telefono")}
            />
            {errors.telefono && <p>{errors.telefono.message}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Fecha de nacimiento:</label>
            <input
              className="form-input"
              type="date"
              {...register("fecha_nacimiento")}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Razón social:</label>
            <input className="form-input" {...register("razon_social")} />
            {errors.razon_social && (
              <p className="error-message">{errors.razon_social.message}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Nombre comercial:</label>
            <input className="form-input" {...register("nombre_comercial")} />
            {errors.nombre_comercial && (
              <p className="error-message">{errors.nombre_comercial.message}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Dirección de entrega:</label>
            <input className="form-input" {...register("direccion_entrega")} />
            {errors.direccion_entrega && (
              <p className="error-message">
                {errors.direccion_entrega.message}
              </p>
            )}
          </div>

          {/* Agregar más campos según necesidad */}
          {isEditing && (
            <button type="button" onClick={clearForm}>
              Cancelar
            </button>
          )}
          <button type="submit">{isEditing ? "Actualizar" : "Guardar"}</button>
        </form>
      </div>
    </div>
  );
};

export default Clients;
