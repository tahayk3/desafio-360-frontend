const BASE_URL = "http://localhost:3000/api/v1";

import axios from "axios";

export const getProducts = async (token, page, filters = {}) => {
  console.log("Los filtros son:", filters);
  try {
    // Construir los parámetros de consulta a partir de los filtros
    const queryParams = new URLSearchParams({
      page, // Página actual
      ...filters, // Añadir filtros dinámicos
    });

    // Hacer la solicitud al backend
    const response = await axios.get(
      `http://localhost:3000/api/v1/productos/?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const url = `http://localhost:3000/api/v1/productos/?${queryParams.toString()}`;
    console.log("URL generada:", url);

    return response.data;
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    throw error;
  }
};

  

export const updateProduct = async (product, token) =>{
  const response = await fetch(`http://localhost:3000/api/v1/productos/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al editar producto");
  }
  return await response.json();
}

export const createProduct = async (data, token) => {
    const response = await fetch(`${BASE_URL}/productos/`, {
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

export const deleteProduct = async (token, id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/v1/productos/${id}`, {
        headers: {    
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    }
    catch (error) {
      console.error("Error al eliminar el producto:", error);
      throw error;
    }
}

export const getProductById = async (token, id) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/productos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },  
      });
      return response.data;
    }
    catch (error) {
      console.error("Error al obtener el producto:", error);
      throw error;
    }
  }
