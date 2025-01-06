const BASE_URL = "http://localhost:3000/api/v1";

/**
 * Registra un nuevo usuario en la aplicación.
 * 
 * @param {Object} data - Datos del usuario para registrarse.
 * @param {string} data.nombre - Nombre del usuario.
 * @param {string} data.correo - Correo electrónico del usuario.
 * @param {string} data.password - Contraseña del usuario.
 * @returns {Object} - Datos de la respuesta del servidor si el registro es exitoso.
 * @throws {Error} - Error si la solicitud falla o la API responde con un error.
 */
export const registerUser = async (data) => {

    const response = await fetch(`${BASE_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al registrar usuario");
    }

    return await response.json();
};