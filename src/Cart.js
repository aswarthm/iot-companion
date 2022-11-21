/**
 * TODO
 * send cart with cust name
 * collect email or phone number
 * maybe animate steps with opening closing divs
 * disable checkout till all info is entered
 * validate name, email
 * clear cart, name, email after validate + checkout
 * 
 */
import React from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
import { BounceLoader } from "react-spinners"

import ItemQuantityHandler from "./ItemQuantityHandler";

function Cart({ cart, setCart }) {
  const navigate = useNavigate()
  const [isLoading, setLoading] = React.useState(false)
  const [name, setName] = React.useState()
  const [mail, setMail] = React.useState()

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
              <div className="checkoutInfo">
                <div className="infoLabel">Name: </div>
                <input className="infoInput" type="name" onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="checkoutInfo">
                <div className="infoLabel">Email ID: </div>
                <input className="infoInput" type="email" onChange={(e) => setMail(e.target.value)} />
              </div>
              <div className="checkoutFinal">
                <div className="cartTotalPrice">Cart Total: {getCartTotal()}</div>
                <div className="checkoutBtn" role="button" onClick={() => handleCheckout()}>Checkout</div>
              </div>
            </div>
            {
              isLoading
              ?(
                <div className="loader">
                  <BounceLoader 
                    color="#9dd9ff"
                    speedMultiplier={2}
                  />
                </div>
              )
              :(
                <div></div>
              )
            }
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
    return(cartTotal)
  }

  async function handleCheckout(){

    setLoading(true)

    const order = { 
      name: name,
      mail: mail,
      items: cart
    }
    console.log(order)
    const orderReq = await fetch("https://iot-companion.azurewebsites.net/api/newOrder?code=gWR-FEj-10XwvCgTEKponrY2wtPLxIgTMqJ-f_O1xK1VAzFu4eg9FA==",
                    {  
                      headers: {
                        'accept': 'application/json',
                        'Content-Type': 'application/json'
                      },
                      'method': 'POST',
                      'body': JSON.stringify(order) 
                    })

    const orderResp = await orderReq.json()
    console.log(orderResp)

    //setCart([])
    navigate({
      pathname:"/track",
      search: createSearchParams({
          id: orderResp.order_id
      }).toString()
    })
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
