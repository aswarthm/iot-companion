import React from "react";
import ItemQuantityHandler from "./ItemQuantityHandler";

function Cart({ cart, setCart }) {

  function getCartItems({ cart }) {
    if(cart.length === 0){
        return(
            <div>
                Cart is Empty
            </div>
        )
    }
    else{
        return(
            cart.map((item) => (
              <div key={item.product_code} className="cartItem">
                <div>
                  <div>{item.name}</div>
                  <div className="cartItemPrice">{item.price}</div>
                </div>
                <div className="cartItemQuantityHandler">
                  <ItemQuantityHandler item={item} setCart={setCart} />
                  <div className="itemTotalPrice">{getItemTotal({item})}</div>
                </div>
              </div>
            ))
        )
    }
  }

  function getItemTotal({item}){
    return(item.price*item.quantity)    
  }

  function getCartTotal(){
    var cartTotal = 0;
    for(const i in cart){
      const item = cart[i]
      cartTotal += getItemTotal({item})
    }
    console.log(cartTotal)
    return(cartTotal)
  }

  return (
    <>
      <h1>Cart</h1>
      <div className="cart">
          {getCartItems({cart})}
      </div>
      <div className="checkout">
        <div className="cartTotalPrice">Cart Total: {getCartTotal()}</div>
        <div className="checkoutBtn" role="button">Checkout</div>
      </div>
    </>
  );
}

export default Cart;
