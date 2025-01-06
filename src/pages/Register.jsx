import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { userSchemas } from "../validations/RegisterSchema";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/register";
import "./Register.css";

import { useAuth } from "../contexts/AuthContext";

const Register = () => {
  const navigate = useNavigate();

  const { role } = useAuth();

  // Redirigir si el rol no es 1
  useEffect(() => {
    if (role !== null && role !== undefined && role !== "1") {
      navigate("/"); // Redirigir solo si el rol es conocido pero no permitido
    }
  }, [role, navigate]);

  const [userType, setUserType] = useState("cliente");

  const schema = userSchemas[userType];
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const prepareData = (data) => {
    const formattedDate = data.fecha_nacimiento
      ? new Date(data.fecha_nacimiento).toISOString().split("T")[0] // Convertir a 'YYYY-MM-DD'
      : null;

    const idRol = userType === "cliente" ? 2 : 1;

    return {
      correo: data.correo,
      password: data.password,
      nombre_completo: data.name,
      razon_social: data.razon_social || null,
      nombre_comercial: data.nombre_comercial || null,
      direccion_entrega: data.direccion_entrega || null,
      fecha_nacimiento: formattedDate,
      telefono: data.telefono,
      id_estado: 3,
      id_rol: idRol,
    };
  };

  const onSubmit = async (data) => {
    const preparedData = prepareData(data);
    console.log("Datos procesados:", preparedData); // Confirmar formato
    try {
      const response = await registerUser(preparedData);
      alert("Usuario creado con éxito. Espere su activación.", response);
      navigate("/");
    } catch (error) {
      console.error("Error al crear el usuario:", error.message);
      alert(`Error al crear el usuario: ${error.message}`);
    }
  };

  return (
    <div className="container">
      <div className="container-form">
        <h2 className="title">Registro de Usuario</h2>
        
        <div className="radio-group">
          <label className={`radio-label ${userType === "cliente" ? "selected" : ""}`}>
            <input
              className="radio-input"
              type="radio"
              value="cliente"
              checked={userType === "cliente"}
              onChange={(e) => setUserType(e.target.value)}
            />
            Cliente
          </label>
          <label className={`radio-label ${userType === "operador" ? "selected" : ""}`}>
            <input
              className="radio-input"
              type="radio"
              value="operador"
              checked={userType === "operador"}
              onChange={(e) => setUserType(e.target.value)}
            />
            Operador
          </label>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">Nombre completo:</label>
            <input className="form-input" {...register("name")} />
            {errors.name && (
              <p className="error-message">{errors.name.message}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Correo electrónico:</label>
            <input className="form-input" {...register("correo")} />
            {errors.correo && (
              <p className="error-message">{errors.correo.message}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña:</label>
            <input
              className="form-input"
              type="password"
              {...register("password")}
            />
            {errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Teléfono:</label>
            <input
              className="form-input"
              type="number"
              {...register("telefono")}
            />
            {errors.telefono && (
              <p className="error-message">{errors.telefono.message}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Fecha de nacimiento:</label>
            <input
              className="form-input"
              type="date"
              {...register("fecha_nacimiento")}
            />
            {errors.fecha_nacimiento && (
              <p className="error-message">{errors.fecha_nacimiento.message}</p>
            )}
          </div>

          {/* Campos específicos del cliente */}
          {userType === "cliente" && (
            <>
              <div className="form-group">
                <label className="form-label">Razón social:</label>
                <input className="form-input" {...register("razon_social")} />
                {errors.razon_social && (
                  <p className="error-message">{errors.razon_social.message}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Nombre comercial:</label>
                <input
                  className="form-input"
                  {...register("nombre_comercial")}
                />
                {errors.nombre_comercial && (
                  <p className="error-message">
                    {errors.nombre_comercial.message}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Dirección de entrega:</label>
                <input
                  className="form-input"
                  {...register("direccion_entrega")}
                />
                {errors.direccion_entrega && (
                  <p className="error-message">
                    {errors.direccion_entrega.message}
                  </p>
                )}
              </div>
            </>
          )}

          <button type="submit" className="submit-button">
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
