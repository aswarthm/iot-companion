//import { CosmosClient } from "@azure/cosmos";
const {CosmosClient} = require("@azure/cosmos");

const key = "RBPN7Yr8XaERNGoUmeGpqHrvm7o0yPz0Ga4c3kOt0WxtK1hyhVwRYXYoMVZaQ9Ozi8Msl60cEcLfACDbXtkSAA==";
const endpoint = "https://iot-companion.documents.azure.com:443/";

const databaseName = "iot-companion";
const containerName = "product_test";

const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseName);
const container = database.container(containerName);

module.exports = async function (context, req) {
    
    const order_id = req.query.id
    context.log(order_id);

    const data = await container.item("orders").read();
    // const sleep = ms => new Promise(
    //     resolve => setTimeout(resolve, ms));
    // await sleep(2000);

    const order = data.resource.data[order_id];
    context.log(order)
    
    if(order){
        responseMessage = order
    }
    else{
        responseMessage = {}
    }
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}