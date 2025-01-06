const BASE_URL = "http://localhost:3000/api/v1";

export const getPedidosPendientes = async (token) => {
    const response = await fetch(`${BASE_URL}/ordenes`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al obtener pedidos pendientes");
    }

    return await response.json();
}

export const updateOrderStatus = async (nuevo_estado, cancelar, id_operador, token, id_pedido) => {
    console.log(nuevo_estado, cancelar, id_operador, token, id_pedido);
    const response = await fetch(`${BASE_URL}/ordenes/${id_pedido}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nuevo_estado, cancelar, id_operador }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar pedido");
    }

    return await response.json();
}

export const updatePedidosPendientes = async (token, id) => {
    try {
        console.log('URL:', `${BASE_URL}/ordenes/cancelar/${id}`);
        console.log('Headers:', { Authorization: `Bearer ${token}` });

        const response = await fetch(`${BASE_URL}/ordenes/cancelar/${id}`, {
            method: "PATCH", // Cambia a "GET" si el backend solo acepta GET
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Estado:', response.status);
        console.log('Respuesta:', await response.clone().json()); // Duplica la respuesta para debugging

        if (!response.ok) {
            throw new Error('Error al actualizar el pedido');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en updatePedidosPendientes:', error);
        throw error;
    }
};
