//import { CosmosClient } from "@azure/cosmos";
const {CosmosClient} = require("@azure/cosmos");
const fpe = require("node-fpe")

const key = "RBPN7Yr8XaERNGoUmeGpqHrvm7o0yPz0Ga4c3kOt0WxtK1hyhVwRYXYoMVZaQ9Ozi8Msl60cEcLfACDbXtkSAA==";
const endpoint = "https://iot-companion.documents.azure.com:443/";

const databaseName = "iot-companion";
const containerName = "product_test";

const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseName);
const container = database.container(containerName);

function getOrderID(){
    const secret = "orderid"
    const cipher = fpe({ secret })
    
    var now = Date.now().toString().concat(parseInt(Math.random()*10))
    
    now = cipher.encrypt(now)
    return([now.slice(0,4), now.slice(4,10), now.slice(10,15)].join("-")) 
}

function cartTotal(cart_items){
    var total = 0
    for(const i in cart_items){
        const cart_item = cart_items[i]
        total += cart_item.price*cart_item.quantity
    }
    return total;
}

async function makeOrder(context, products, cart_order){
    const cart_items = cart_order.items
    const order_id = getOrderID()

    var order = {
        order_id: order_id,
        order_status: 0,
        name: cart_order.name,
        mail: cart_order.mail,
        order_time: Date.now(),
        return_time: 1683337974000,
        cart_total: null,
        items: []
    };
     /**
     * order
     * id
     * order status -> ordered-0, collected-1, returned-2
     * cust name
     * cust mail
     * order time
     * return time
     * cart_total
     * items
     * 
     * response
     * id
     * cart_total
     * 
     */
    for(var i in cart_items){
        const cart_item = cart_items[i];
        const product_index = products.findIndex(item => item.product_code === cart_item.product_code)
        const product = products[product_index]
        const newCartItem = {
            "product_code": product.product_code,
            "name": product.name,
            "price": product.price,
            "quantity": cart_item.quantity
        }
        if(cart_item.quantity > product.quantity){
            context.res = {
                // status: 200, /* Defaults to 200 */
                body: "err quantity"
            }
            return;
        }
        products[product_index].quantity -= cart_item.quantity
        order.items.push(newCartItem)
    }
    order.cart_total = cartTotal(order.items)

    container.item("orders").patch([{ op: 'add', path: "/data/".concat(order_id), value: order }])
    container.item("products").patch([{ op: 'add', path: "/data/", value: products }])
    
    const resp = {
        order_id: order.order_id,
        cart_total: order.cart_total
    }
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: resp
    }
    
}

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    
    const cart_order = req.body
    //context.log(cart_order)
    
    // const cart_items = [
    //     {
    //         "product_code": "sen-001",
    //         "price": 30,
    //         "quantity": 2
    //     },
    //     {
    //         "product_code": "sen-002",
    //         "price": 10,
    //         "quantity": 3
    //     }
    // ]
    // const operations =[{ op: 'add', path: "/data/".concat("ok"), value: {ok:5} }];

    // container.item("orders").patch(operations)
    
    await container.item("products").read().then( dbProducts => {
        makeOrder(context, dbProducts.resource.data, cart_order)
    } );

}