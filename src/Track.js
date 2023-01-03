/**
 * TODO
 * DONE add text box for order id
 * DONE button to search more ids
 * DONE validate before toTrackPage
 */

import React from "react";
import { BounceLoader } from "react-spinners"

import { useSearchParams, useNavigate, createSearchParams } from "react-router-dom"

function Track({products}){

    const navigate = useNavigate()
    
    
    const [searchParams, setSearchParams] = useSearchParams();
    const urlOrderID = searchParams.get("id") || ""
    
    const [isLoading, setLoading] = React.useState(!!urlOrderID)//double not ig
    //console.log(isLoading)
    
    const [order, setOrder] = React.useState()

    React.useEffect(() => {
        if(urlOrderID){
            setLoading(true)
            // fetch("https://iot-companion.azurewebsites.net/api/getOrder?id=${encodeURIComponent(urlOrderID)}")
            //     .then(response => response.json())
            //     .then(data => setOrder(data))
            fetch("https://iot-companion.azurewebsites.net/api/getOrder?id=".concat(urlOrderID))
            .then(response => response.json())
            .then(data => setOrder(data))
            .then(() => setLoading(false))
            //.then(() => console.log(order))
        }
    }, [urlOrderID])

    const [orderID, setOrderID] = React.useState(urlOrderID)


    function formatInput(e){
        
        const value = e.target.value.replace(/[^\d]/g, '')
        
        if(!value){
            setOrderID(value)
            return
        }
        
        if(value.length <= 4){
            setOrderID(value)
            return
        }//0123-456789-11121314
        else if(value.length <= 10){
            setOrderID([value.slice(0,4), value.slice(4, value.length)].join('-'))
            return
        }
        else if(value.length <= 14){
            setOrderID([value.slice(0, 4), value.slice(4, 10), value.slice(10, value.length)].join("-"))
        }
        else{
            setOrderID([value.slice(0, 4), value.slice(4, 10), value.slice(10, 14)].join("-"))
        }
    }

    function validOrder(){
        
        if(!order || Object.keys(order).length === 0 || order === undefined){
            return false
        }
        else{
            return true
        }
    }
    function getOrderTracker(){

        if(!order || !urlOrderID){
            return(
                <div></div>
            )
        }

        //if(/[0-9]{4}(\-)[0-9]{6}(\-)[0-9]{4}/g.test(urlOrderID) && !!order){
            return(
                <>{
                    validOrder()?
                    (
                    <>
                    <div className="trackCard">
                    {order.items?.map((item) => (
                        <div key={item.product_code} className="trackItem">
                            <div className="trackItemLeft">
                                <div className="trackItemName">{item.name}</div>
                                <div className="trackItemPrice">{item.price}</div>
                            </div>
                            <div className="trackItemRight">
                                <div className="trackItemQuantity">x{item.quantity}</div>
                                <div>{parseInt(item.price * item.quantity)}</div>
                            </div>
                        </div>
                    ))}
                    </div>
                    <div className="trackInfo">
                        <div className="trackTotalPrice" >Order Total: {order.cart_total}</div>
                    </div>
                    </>
                    )
                    :(
                        <div className="trackCard empty">
                            Enter a valid Order ID
                        </div>
                    )}
                </>
            )
        //}
    }

    function toTrackPage(url){
        navigate({
            pathname: "/track",
            search: createSearchParams({
                id: url
            }).toString()
        })
    }

    return(
        <>
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
        <div className="searchBar">
            <input className="inputOrderID" placeholder="####-######-####" value={orderID} onChange={(e) => formatInput(e)} />
            <div className="searchBtn" role="button" onClick={() => toTrackPage(orderID)}>Search</div>
        </div>
        {getOrderTracker()}
        </>
    )
}

export default Track