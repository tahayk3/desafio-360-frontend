import * as yup from "yup";

export const userSchemas = {
  operador: yup.object().shape({
    name: yup.string().required("El nombre es requerido"),
    correo: yup.string().email("Correo inválido").required("El correo es requerido"),
    password: yup.string().min(6, "La contraseña debe tener al menos 6 caracteres").required("La contraseña es requerida"),
    telefono: yup.string().matches(/^[0-9]{8}$/,"El numero de telefono debe tener 8 numeros").required("El numero de telefono es requerido"),
    fecha_nacimiento: yup
        .date()
        .transform((value, originalValue) => {
          // Convertir valores vacíos a null
          return originalValue.trim() === "" ? null : value;
        })
        .required("La fecha de nacimiento es requerida")
        .test(
          "is-18",
          "Debes tener al menos 18 años",
          (value) => {
              if (!value) return false; // Si no hay fecha, falla
              const today = new Date();
              const birthDate = new Date(value);
              const age = today.getFullYear() - birthDate.getFullYear();
              const monthDiff = today.getMonth() - birthDate.getMonth();

              // Restar 1 año si aún no cumplió años este año
              return age > 18 || (age === 18 && monthDiff >= 0);
          }
      ),
  }),
  
  cliente: yup.object().shape({
    name: yup.string().required("El nombre es requerido"),
    correo: yup.string().email("Correo inválido").required("El correo es requerido"),
    password: yup.string().min(6, "La contraseña debe tener al menos 6 caracteres").required("La contraseña es requerida"),
    direccion_entrega: yup.string().required("La dirección es requerida"),
    razon_social: yup.string().required("La razon social es requerida es requerida"),
    nombre_comercial: yup.string().required("El nombre comercial es requerida"),
    telefono: yup.string().matches(/^[0-9]{8}$/,"El numero de telefono debe tener 8 numeros").required("El numero de telefono es requerido"),
    fecha_nacimiento: yup
        .date()
        .transform((value, originalValue) => {
          // Convertir valores vacíos a null
          return originalValue.trim() === "" ? null : value;
        })
        .required("La fecha de nacimiento es requerida")
        .test(
          "is-18",
          "Debes tener al menos 18 años",
          (value) => {
              if (!value) return false; // Si no hay fecha, falla
              const today = new Date();
              const birthDate = new Date(value);
              const age = today.getFullYear() - birthDate.getFullYear();
              const monthDiff = today.getMonth() - birthDate.getMonth();

              // Restar 1 año si aún no cumplió años este año
              return age > 18 || (age === 18 && monthDiff >= 0);
          }
      ),
  }),


  clienteOperador: yup.object().shape({
    name: yup.string().required("El nombre es requerido"),
    correo: yup.string().email("Correo inválido").required("El correo es requerido"),
    telefono: yup.string().matches(/^[0-9]{8}$/,"El numero de telefono debe tener 8 numeros").required("El numero de telefono es requerido"),
    direccion_entrega: yup.string().required("La dirección es requerida"),
    razon_social: yup.string().required("La razon social es requerida es requerida"),
    nombre_comercial: yup.string().required("El nombre comercial es requerida"),
    fecha_nacimiento: yup
        .date()
        .transform((value, originalValue) => {
          // Convertir valores vacíos a null
          return originalValue.trim() === "" ? null : value;
        })
        .required("La fecha de nacimiento es requerida")
        .test(
          "is-18",
          "Debes tener al menos 18 años",
          (value) => {
              if (!value) return false; // Si no hay fecha, falla
              const today = new Date();
              const birthDate = new Date(value);
              const age = today.getFullYear() - birthDate.getFullYear();
              const monthDiff = today.getMonth() - birthDate.getMonth();

              // Restar 1 año si aún no cumplió años este año
              return age > 18 || (age === 18 && monthDiff >= 0);
          }
      ),
  }),
};