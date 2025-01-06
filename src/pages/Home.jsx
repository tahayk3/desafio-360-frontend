import { useAuth } from "../contexts/AuthContext";
import ProductList from "../features/products/ProductList";
import OperatorOrders from "../features/orders/OperatorOrders";

const Home = () => {
  const { role } = useAuth();
  return (
    <div>
      {role == 1 && <OperatorOrders />} 
      {role == 2  && <ProductList />}  
    </div>
  );
};

export default Home;
