import React from "react"


function ItemQuantityHandler({ item, setCart, products }){

    function handleQuantityDec({item}){
        if(item.quantity === 1){
            handleItemRemove({item})
        }
      setCart( cartItems => 
          cartItems.map( i => 
              i.product_code === item.product_code
              ?{
                ...i,
                quantity: i.quantity-1
              }
              :i
            )
        )
    }
  
    function handleQuantityInc({item}){
      // console.log(products.find(i => i.product_code === item.product_code).quantity)
      if(item.quantity < products.find(i => i.product_code === item.product_code).quantity){
        setCart( (cartItems) => 
          cartItems.map( i => 
              i.product_code === item.product_code
              ?{
                ...i,
                quantity: i.quantity+1
              }
              :i
            )
        )
      }
    }
  
    function handleItemRemove({item}){
        setCart( cartItems => 
            cartItems.filter(i => i.product_code !== item.product_code)
          )
    }
  
    return(
      <div className="itemQuantity">
      <div  key={ "dec-".concat(item.product_code)} className="cartBtn" role="button" onClick={() => handleQuantityDec({item})}>-</div>
      <div className="cartQuantity">{item.quantity}</div>
      <div key={ "inc-".concat(item.product_code)} className="cartBtn" role="button" onClick={() => handleQuantityInc({item})}>+</div>
      </div>
    )
  }

  export default ItemQuantityHandler;