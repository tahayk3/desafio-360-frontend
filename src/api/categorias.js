const BASE_URL = "http://localhost:3000/api/v1";

import axios from "axios";

export const getCategorias = async (token, page) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/categoriaproductos/?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener las categorias:", error);
      throw error;
    }
  };

export const updateCategoria = async (categoria, token) =>{
  const response = await fetch(`http://localhost:3000/api/v1/categoriaproductos/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, },
    body: JSON.stringify(categoria),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al editar categoria");
  }
  return await response.json();
}

export const createCategoria = async (data, token) => {
    const response = await fetch(`${BASE_URL}/categoriaproductos/`, {
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

export const deleteCategoria = async (token, id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/v1/categoriaproductos/${id}`, {
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
  

    

