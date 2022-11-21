import React from "react";
import { BrowserRouter, Route, Link, useLocation, matchRoutes } from "react-router-dom";

function Navbar(){
    const location = useLocation()
    
    function getNavItems(){
        const routes = [
            {
                path: "/",
                name: "Home"
            },
            {
                path: "/cart",
                name: "Cart"
            },
            {
                path: "/track",
                name: "Track"
            }
        ]
        
        return(
            routes.map(route => 
                    <Link to={route.path}  key={route.name} role="button" className={"navBtn".concat(route.path === location.pathname?"Current":"")}>{route.name}</Link>
                )
        )
    }
    return(
        <nav>
            {getNavItems()}
        </nav>
    )
}

export default Navbar;