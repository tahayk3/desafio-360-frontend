import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { productSchema } from "../../validations/ProductSchema";
import { createProduct, updateProduct } from "../../api/products";
import { useAuth } from "../../contexts/AuthContext";
import UploadForm from "../../components/UploadForm";
import { getCategorias } from "../../api/categorias";
import { getEstados } from "../../api/estados";

const CreateProduct = ({
  onProductSaved,
  defaultValues = {},
  isEditing = false,
}) => {
  const { token, id_usuario } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrls, setImageUrls] = useState(
    defaultValues.foto ? defaultValues.foto.split(",") : []
  );

  const [categories, setCategories] = useState([]); // Estado para almacenar las categorías
  const [isLoading, setIsLoading] = useState(true); // Estado para saber si se está cargando la lista de categorías

  const [estados, setEstados] = useState([]); // Estado para almacenar los estados
  const [isLoadingEstados, setIsLoadingEstados] = useState(true); // Estado para saber si se está cargando la lista de estados

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues,
  });

  // Función para obtener categorías
  const fetchCategories = async () => {
    try {
      const data = await getCategorias(token);
      setCategories(data.data); // Ajusta según la estructura de la respuesta
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar las categorías cuando el componente se monta
  useEffect(() => {
    fetchCategories();
  }, [token]); // Dependencia del token, cambia si el usuario no está autenticado

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
  }, [token]); // Dependencia del token, cambia si el usuario no está autenticado

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
      stock: parseInt(data.stock, 10),
      precio: parseFloat(data.precio),
    };

    // Solo añadir 'foto' si imageUrls no está vacío
    if (imageUrls.length > 0) {
      preparedData.foto = imageUrls.join(",");
    }

    return preparedData;
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const preparedData = prepareData(data);
      console.log("Prepared data:", preparedData);
      if (isEditing) {
        await updateProduct(preparedData, token);
        alert("Producto actualizado con éxito.");
      } else {
        await createProduct(preparedData, token);
        alert("Producto creado con éxito.");
        reset();
        setImageUrls([]);
      }
      if (onProductSaved) onProductSaved();
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      alert("Error al guardar el producto.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (urls) => {
    const uploadedUrls = urls.map(({ url }) => url);
    setImageUrls((prevUrls) => [...prevUrls, ...uploadedUrls]);
  };

  const handleRemoveImage = (imageName) => {
    setImageUrls((prevUrls) =>
      prevUrls.filter((url) => !url.includes(imageName))
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="container-form">
      <h2 className="title">
        {isEditing ? "Editar Producto" : "Crear Producto"}
      </h2>

      <div className="form-group">
        <div>
          <label className="form-label">Nombre:</label>
          <input
            className="form-input"
            {...register("nombre")}
            placeholder="Nombre del producto"
          />
          {errors.nombre && <p>{errors.nombre.message}</p>}
        </div>

        <div>
          <label className="form-label">Marca:</label>
          <input
            className="form-input"
            {...register("marca")}
            placeholder="Marca"
          />
          {errors.marca && <p>{errors.marca.message}</p>}
        </div>

        <div>
          <label className="form-label">Código:</label>
          <input
            className="form-input"
            {...register("codigo")}
            placeholder="Código"
          />
          {errors.codigo && <p>{errors.codigo.message}</p>}
        </div>

        <div>
          <label className="form-label">Stock:</label>
          <input
            className="form-input"
            type="number"
            {...register("stock")}
            placeholder="Cantidad en stock"
          />
          {errors.stock && <p>{errors.stock.message}</p>}
        </div>

        <div>
          <label className="form-label">Precio:</label>
          <input
            className="form-input"
            type="number"
            step="0.01"
            {...register("precio")}
            placeholder="Precio del producto"
          />
          {errors.precio && <p>{errors.precio.message}</p>}
        </div>

        <div>
          <label className="form-label">Categoría:</label>
          {isLoading ? (
            <p>Cargando categorías...</p>
          ) : (
            <select
              className="form-input"
              {...register("id_categoria_producto")}
            >
              <option value="">Seleccione una categoría</option>
              {categories.map((category) => (
                <option
                  key={category.id_categoria_producto}
                  value={category.id_categoria_producto}
                >
                  {category.nombre_categoria}
                </option>
              ))}
            </select>
          )}
          {errors.id_categoria_producto && (
            <p>{errors.id_categoria_producto.message}</p>
          )}
        </div>

        <div>
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

        <div>
          <label className="form-label">Subir imágenes:</label>
          <UploadForm
            onUploadSuccess={handleImageUpload}
            onRemoveImage={handleRemoveImage}
            multiple={true}
            type="image"
          />
        </div>
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? "Enviando..."
          : isEditing
          ? "Actualizar Producto"
          : "Crear Producto"}
      </button>
    </form>
  );
};

export default CreateProduct;
