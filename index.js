const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = 5000;

// middlewares

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wd6nd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);
// app.use(express)

async function run (){
    try{
        await client.connect();
        const database = client.db('ema_john');
        const productCollection = database.collection("products");

        // get product api

        app.get('/products', async(req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.limit(10).toArray();
            res.send(products);
        })

    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('hello there.')
})

app.listen(port, () => {
    console.log('listening from port: ', port)
})
