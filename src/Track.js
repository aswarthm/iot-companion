/**
 * TODO
 * add text box for order id
 * button to search more ids
 */

import React from "react";
import { useParams, useSearchParams } from "react-router-dom"

function Track(){
    const [searchParams, setSearchParams] = useSearchParams();
    const dat = searchParams.get("id") || "hi"

    return(
        <div>{dat}</div>
    )
}

export default Track