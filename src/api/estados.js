
import axios from "axios";

export const getEstados = async (token) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/estados/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener los estados:", error);
      throw error;
    }
  };
  

    
