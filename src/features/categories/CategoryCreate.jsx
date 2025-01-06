import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { categoriaSchema } from "../../validations/categoriaSchema";
import { useAuth } from "../../contexts/AuthContext";
import { getEstados } from "../../api/estados";
import { createCategoria, updateCategoria } from "../../api/categorias";
import "./CategoryCreate.css";

const CategoryCreate = ({
  onProductSaved,
  defaultValues = {},
  isEditing = false,
}) => {
  const { token, id_usuario } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [estados, setEstados] = useState([]); // Estado para almacenar los estados
  const [isLoadingEstados, setIsLoadingEstados] = useState(true); // Estado para saber si se está cargando la lista de estados

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(categoriaSchema),
    defaultValues,
  });

  // Función para obtener estados
  const fetchEstados = async () => {
    try {
      const data = await getEstados(token);
      setEstados(data); // Ajusta según la estructura de la respuesta
    } catch (error) {
      console.error("Error al obtener los estados:", error);
    } finally {
      setIsLoadingEstados(false);
    }
  };

  // Cargar las categorías cuando el componente se monta
  useEffect(() => {
    fetchEstados();
  }, [token]);

  const defaultValuesRef = useRef(defaultValues);

  useEffect(() => {
    if (
      isEditing &&
      defaultValues &&
      defaultValues !== defaultValuesRef.current
    ) {
      reset(defaultValues);
      defaultValuesRef.current = defaultValues; // Actualiza el valor referenciado
    }
  }, [defaultValues, isEditing, reset]);

  const prepareData = (data) => {
    const preparedData = {
      ...data,
      activo: 1,
      id_usuario,
    };

    return preparedData;
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const preparedData = prepareData(data);
      if (isEditing) {
        await updateCategoria(preparedData, token);
        alert("Producto actualizado con éxito.");
      } else {
        await createCategoria(preparedData, token);
        alert("Producto creado con éxito.");
        reset();
      }
      if (onProductSaved) onProductSaved();
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      alert("Error al guardar el producto.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="container-form">
      <h2 className="title">
        {isEditing ? "Editar Categoria" : "Crear Categoria"}
      </h2>

      <div className="form-group">
        <label className="form-label">Nombre categoria:</label>
        <input
          className="form-input"
          {...register("nombre_categoria")}
          placeholder="Nombre de la categoria"
        />
        {errors.nombre && <p>{errors.nombre.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Estado:</label>
        {isLoadingEstados ? (
          <p>Cargando estados...</p>
        ) : (
          <select className="form-input" {...register("id_estado")}>
            <option value="">Seleccione un estado</option>
            {estados.map((estado) => (
              <option key={estado.id_estado} value={estado.id_estado}>
                {estado.nombre_estado}
              </option>
            ))}
          </select>
        )}
        {errors.id_categoria_producto && (
          <p>{errors.id_categoria_producto.message}</p>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? "Enviando..."
          : isEditing
          ? "Actualizar Categoria"
          : "Crear Categoria"}
      </button>
    </form>
  );
};

export default CategoryCreate;
