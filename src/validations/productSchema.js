import * as yup from "yup";

export const productSchema = yup.object().shape({
  nombre: yup.string().required("El nombre del producto es obligatorio"),
  marca: yup.string().required("La marca es obligatoria"),
  codigo: yup.string().required("El código es obligatorio"),
  stock: yup.number().min(0, "El stock no puede ser menor a 0").integer("Debe ser un número entero").required("El stock es obligatorio"),
  precio: yup.number().positive("El precio debe ser positivo").required("El precio es obligatorio"),
  id_categoria_producto: yup.number().required("El ID de categoría es obligatorio"),
  id_estado: yup.number().required("El ID de estado es obligatorio"),
});