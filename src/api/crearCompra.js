const BASE_URL = "http://localhost:3000/api/v1";

export const registrarCompra = async (data, token) => {
    const response = await fetch(`${BASE_URL}/ordenes`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al registrar usuario");
      }
  
      return await response.json();
};
