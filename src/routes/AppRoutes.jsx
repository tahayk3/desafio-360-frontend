import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/NavBar";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import ProductDetail from "../features/products/ProductDetail";
import Cart from "../components/Cart";
import ProductListA from "../features/products/ProductListA";
import CategoryList from "../features/categories/CategoryList";
import ClientsOrders from "../features/orders/ClientsOrders";
import Users from "../pages/Users";
import Clientes from "../pages/Clients";
import PrivateRoute from "../components/PrivateRoute";

const App = () => {
  const [cart, setCart] = useState([]);


  return (
    <Router>
       <Navbar/>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />
        
        {/* Rutas protegidas */}
        <Route
          path="/register"
          element={
            <PrivateRoute>
              <Register />
            </PrivateRoute>
          }
        />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="productos"
          element={
            <PrivateRoute>
              <ProductListA />
            </PrivateRoute>
          }
        />
        <Route
          path="categorias"
          element={
            <PrivateRoute>
              <CategoryList />
            </PrivateRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <PrivateRoute>
              <ProductDetail cart={cart} setCart={setCart} />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart cart={cart} setCart={setCart} />
            </PrivateRoute>
          }
        />
        <Route
          path="/historialorden"
          element={
            <PrivateRoute>
              <ClientsOrders />
            </PrivateRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <PrivateRoute>
              <Users />
            </PrivateRoute>
          }
        />
        <Route
          path="/clientes"
          element={
            <PrivateRoute>
              <Clientes />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<h1>Página no encontrada</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
