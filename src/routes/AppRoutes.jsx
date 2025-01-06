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

const App = () => {
  const [cart, setCart] = useState([]);
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="productos" element={<ProductListA />} />
        <Route path="categorias" element={<CategoryList />} />
        <Route path="/product/:id" element={<ProductDetail cart={cart} setCart={setCart} />} />
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
        <Route path="/historialorden" element={<ClientsOrders/>} />
        <Route path="/usuarios" element={<Users/>} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="*" element={<h1>Pagina no encontrada</h1>} /> 
      </Routes>
    </Router>
  );
};

export default App;