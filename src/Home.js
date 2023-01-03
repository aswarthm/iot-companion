import React from "react";
import { BounceLoader } from "react-spinners";

import ItemQuantityHandler from "./ItemQuantityHandler";

function Home({ products, setCart, cart }) {


  return (
    <div className="App">
      <h1>IoT Companion</h1>
      <ProductsList products={products} setCart={setCart} cart={cart}/>
    </div>
  );
}

export default Home;

function ProductsList({ products, setCart , cart}) {
  
  function showLoader(){
    if(!products){
      return true
    }
    else if(!products.length){
      return true
    }

    return false
  }

  return (
    <div className="productsList">
      {
        showLoader()?
        (
          <div className="loaderContainer">
                <div className="loader">
                <BounceLoader
                    color="#9dd9ff"
                    speedMultiplier={2}
                />
                </div>
            </div>
        )
        :(
          products.map((product) => (
        <ProductCard
          key={product.product_code}
          product={product}
          setCart={setCart}
          cart={cart}
        />
      ))
        )
      }
    </div>
  );
}

function ProductCard({ product, setCart , cart}) {

  function handleAddToCart({ product }) {
    if (cart.some(item => item.product_code === product.product_code)) {
      setCart( (cartItems) => 
        cartItems.map(item => 
            item.product_code === product.product_code
            ?{
              ...item,
              quantity: item.quantity+1
            }
            :item
          )
      )
    }
    else{
      const newCartItem = {
        product_code: product.product_code,
        name: product.name,
        price: product.price,
        quantity: 1
      }
      setCart(cart.concat(newCartItem))
    }
  }

  function getAddToCartButton({ product }){
    const i = cart.findIndex(item => item.product_code === product.product_code)
    if(i > -1){
      return(<ItemQuantityHandler item={cart[i]} setCart={setCart} />)
    }
    else{
      return(<div className="addToCartBtn" role="button" onClick={() => handleAddToCart({ product })}>Add To Cart</div>)
    }
  }

  return (
    <div className="productCard">
      <img
        src={product.img_url}
        width={150}
      />
      <div className="productName">{product.name}</div>
      <div className="productPrice">{product.price}</div>
      {getAddToCartButton({product})}
    </div>
  );
}

