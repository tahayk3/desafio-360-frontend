import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../validations/loginSchema";
import { login } from "../api/auth";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Login.css";

import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const { login: loginUser } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const userData = await login(data);
      await loginUser(userData); // Guarda los datos del usuario en el contexto de autenticación
      toast.success("¡Inicio de sesión exitoso! 🎉", {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      setTimeout(() => {
        navigate("/home"); // Redirigir a productos después de 3 segundos
      }, 3000);
    } catch (error) {
      toast.error("Credenciales incorrectas", {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      console.error("Error al iniciar sesión:", error.message);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="login-wrapper">
        <div className="login-container">
          <div className="login-image">
            <img src="logo.png" width={"30%"} alt="Login visual" />
          </div>
          <h1>Inicio de Sesión</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label>Correo:</label>
              <input
                className="login-input"
                type="email"
                {...register("correo")}
              />
              {errors.correo && (
                <p style={{ color: "red" }}>{errors.correo.message}</p>
              )}
            </div>
            <div>
              <label>Contraseña:</label>
              <input
                className="login-input"
                type="password"
                {...register("password")}
              />
              {errors.password && (
                <p style={{ color: "red" }}>{errors.password.message}</p>
              )}
            </div>
            <button type="submit" className="login-button">
              Iniciar sesión
            </button>
          </form>
          <Link to="/register" className="register-link">
            Registrarse
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;
