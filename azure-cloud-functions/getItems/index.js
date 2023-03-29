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
    context.log('JavaScript HTTP trigger function processed a request.');

    const data = await container.item("products").read();
    // const sleep = ms => new Promise(
    //     resolve => setTimeout(resolve, ms));
    // await sleep(2000);

    const responseMessage = data.resource.data;
    context.log(data.resource.data)
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}