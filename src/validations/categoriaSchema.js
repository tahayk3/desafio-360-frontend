import * as yup from "yup";

export const categoriaSchema = yup.object().shape({
  nombre_categoria: yup.string().required("El nombre de la categoria es obligatorio"),
  id_estado: yup.number().required("El ID de estado es obligatorio"),
});