const BASE_URL = "http://localhost:3000/api/v1";

//inicio de sesion y obtener jwt
export const login = async (credentials) => {
  const response = await fetch(`${BASE_URL}/usuarios/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Credenciales incorrectas");
  }

  const data = await response.json();
  return data.token;
};

//obtener datos del usuario por medio del id del jwt
export const getUserById = async (id, token) => {
  const response = await fetch(`${BASE_URL}/usuarios/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener los datos del usuario");
  }

  return response.json();
};



//desactivar usuario
export const disableUser = async (token, id) => {
  const response = await fetch(`${BASE_URL}/usuarios/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al desactivar el usuario");
  }

  return response.json();
};

//obtener todos los usuarios
export const getUsers = async (token) => {
  const response = await fetch(`${BASE_URL}/usuarios`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener los usuarios");
  }

  return response.json();
};

//editar usuario
export const updateUser = async (token, id, data) => {
  const response = await fetch(`${BASE_URL}/usuarios/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al editar el usuario");
  }

  return response.json();
};


