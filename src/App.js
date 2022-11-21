import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./Layout";
import Home from "./Home";
import Cart from "./Cart";
import Track from "./Track";

function App() {
  const [products, setProducts] = React.useState([]);
  
  React.useEffect(() => {
    fetch("https://iot-companion.azurewebsites.net/api/getItems?")
    .then(response => response.json())
    .then(data => setProducts(data))
  }, [])

  const [cart, setCart] = React.useState(JSON.parse(window.localStorage.getItem("cartItems")) || []);

  React.useEffect(() => {
    setCart(JSON.parse(window.localStorage.getItem("cartItems")) || [])
  }, [])

  React.useEffect(() => {
    window.localStorage.setItem("cartItems", JSON.stringify(cart))
  }, [cart])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home products={products} setCart={setCart} cart={cart} />} />
          <Route path="cart" element={<Cart setCart={setCart} cart={cart} />} />
          <Route path="track" element={<Track products={products} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
