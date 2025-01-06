import { useState, useEffect } from "react";
import { getCategorias } from "../api/categorias";
import { useAuth } from "../contexts/AuthContext";

const ProductFilters = ({ onFilter, visibleFilters = {} }) => {
  const [filters, setFilters] = useState({
    name: "",
    priceMin: "",
    priceMax: "",
    active: "1",
    category: "",
  });

  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === "active" ? Number(value) : value;
    setFilters((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
    console.log("Filters applied:", filters);
  };

  const handleReset = () => {
    setFilters({
      name: "",
      priceMin: "",
      priceMax: "",
      active: "1",
      category: "",
    });
    onFilter({}); // Resetear filtros
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategorias(token);
      setCategories(data.data);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [token]);

  return (
    <form onSubmit={handleSubmit} className="filters-form">
      {visibleFilters.name !== false && (
        <input
          type="text"
          name="name"
          placeholder="Buscar por nombre"
          value={filters.name}
          onChange={handleChange}
        />
      )}
      {visibleFilters.priceMin !== false && (
        <input
          type="number"
          name="priceMin"
          placeholder="Precio mínimo"
          value={filters.priceMin}
          onChange={handleChange}
        />
      )}
      {visibleFilters.priceMax !== false && (
        <input
          type="number"
          name="priceMax"
          placeholder="Precio máximo"
          value={filters.priceMax}
          onChange={handleChange}
        />
      )}
      {visibleFilters.active !== false && (
        <select name="active" value={filters.active} onChange={handleChange}>
          <option value="1">Activos</option>
          <option value="0">Inactivos</option>
        </select>
      )}

      {visibleFilters.category !== false && (
        <>
          {isLoading ? (
            <p>Cargando categorías...</p>
          ) : (
            <select
              name="category"
              value={filters.category}
              onChange={handleChange}
            >
              <option value="">Todas las categorías</option>
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
        </>
      )}
      <button type="submit">Aplicar filtros</button>
      <button type="button" onClick={handleReset}>
        Limpiar
      </button>
    </form>
  );
};

export default ProductFilters;
