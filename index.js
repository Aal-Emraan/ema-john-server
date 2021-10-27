const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middlewares

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wd6nd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run (){
    try{
        await client.connect();
        const database = client.db('ema_john');
        const productCollection = database.collection("products");
        const orderCollection = database.collection('orders');

        // get product api

        app.get('/products', async(req, res) => {
            const cursor = productCollection.find({});
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let products;
            const count = await cursor.count();
            if(page){
                products = await cursor.skip(page * size).limit(size).toArray();
            }else{
                products = await cursor.limit(10).toArray();
            }
            res.json({
                count,
                products});
        })

        // use POST to get keys

        app.post('/products/byKeys', async (req, res) => {
            const keys = req.body;
            const query = {key: {$in: keys}};
            const products = await productCollection.find(query).toArray();
            res.json(products);
        })

        // use POST to place order api

        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);
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
app.get('/hello', (req, res) => {
    res.send('this is hello.')
})

app.listen(port, () => {
    console.log('listening from port: ', port)
})
