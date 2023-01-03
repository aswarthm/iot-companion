/**
 * TODO
 * DONE send cart with cust name
 * DONE collect email or phone number
 * maybe animate steps with opening closing divs
 * DONE disable checkout till all info is entered
 * DONE validate name, email
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

  const nameRef = React.useRef()
  const mailRef = React.useRef()

  const [nameError, setNameError] = React.useState(false)
  const [mailError, setMailError] = React.useState(false)

  function handleMailChange(e){
    setMail(e.target.value)
    if(mailError){
      if(e.target.validity.valid){
        setMailError(false)
      }
    }
  }

  function handleMailBlur(e){
    if(!e.target.validity.valid || e.target.value === ""){
      //invalid
      setMailError(true)
    }
  }

  function handleNameChange(e){
    setName(e.target.value)
    if(nameError){
      if(e.target.value !== ""){
        setNameError(false)
      }
    }
  }

  function handleNameBlur(e){
    if(e.target.value === ""){
      setNameError(true)
    }
  }

  function getCartItems({ cart }) {
    if(cart.length === 0){
        return(
            <div className="cart empty">
                Cart is empty
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
                    <div className="cartItemLabel">{item.name}</div>
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
                <input className="infoInput" placeholder="Name" type="name" onChange={(e) => handleNameChange(e)} onBlur={(e) => handleNameBlur(e)} ref={nameRef} />
              </div>
              <div className="checkoutInfo">
                <div className="infoLabel">Email ID: </div>
                <input className="infoInput" placeholder="name@example.com" type="email" name="mail" onChange={(e) => handleMailChange(e)} onBlur={(e) => handleMailBlur(e)} ref={mailRef} />
              </div>
              <div className="inputError">
                {
                  nameError?(
                    <div>Name cannot be empty</div>
                  )
                  :(
                    <div></div>
                  )
                }
                {
                  mailError?(
                    <div>Enter a valid Email ID</div>
                  )
                  :(
                    <div></div>
                  )
                }
              </div>
              <div className="checkoutFinal">
                <div className="cartTotalPrice">Cart Total: {getCartTotal()}</div>
                <div className="checkoutBtn" role="button" onClick={() => handleCheckout()}>Checkout</div>
              </div>
            </div>
            {
              isLoading
              ?(
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

    if(!name){//check undefined
      nameRef.current.focus()
      setNameError(true)
      return
    }
    if(!mail){
      mailRef.current.focus()
      setMailError(true)
      return
    }

    if(nameError){ //check validity
      nameRef.current.focus()
      return
    }    
    if(mailError){
      mailRef.current.focus()
      return
    }

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
  }

  return (
    <>
      {getCartItems({cart})}

    </>
  );
}

export default Cart;
