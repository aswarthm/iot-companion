import React from "react";
import ItemQuantityHandler from "./ItemQuantityHandler";

function Cart({ cart, setCart }) {

  function getCartItems({ cart }) {
    if(cart.length === 0){
        return(
            <div className="cart empty">
                Wow, such empty :0
            </div>
        )
    }
    else{
        return(
          <>
            <div className="cart">
              {cart.map((item) => (
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
              ))}
            </div>
            <div className="checkout">
              <div className="cartTotalPrice">Cart Total: {getCartTotal()}</div>
              <div className="checkoutBtn" role="button" onClick={() => handleCheckout()}>Checkout</div>
            </div>
              </div>
            ))
          </>
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

  async function handleCheckout(){

    setLoading(true)

    const order = {
      order_id: "111",  
      cust_name: "lol",
      items: cart
    }
    
    const orderReq = await fetch("https://iot-companion.azurewebsites.net/api/newOrder?code=gWR-FEj-10XwvCgTEKponrY2wtPLxIgTMqJ-f_O1xK1VAzFu4eg9FA==",
                    {  
                      headers: {
                        'accept': 'application/json',
                        'Content-Type': 'application/json'
                      },
                      'method': 'POST',
                      'body': JSON.stringify(cart)
                    })

    const orderResp = await orderReq.json()
    console.log(orderResp)

    //setCart([])
    setLoading(false)
  }

  return (
    <>
      <h1>Cart</h1>
      {getCartItems({cart})}

    </>
  );
}

export default Cart;
