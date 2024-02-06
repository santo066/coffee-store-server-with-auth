const express = require('express')
const cors = require('cors')
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


//MD
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vc60c8j.mongodb.net/?retryWrites=true&w=majority`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const coffeeCollection = client.db('DB_coffees').collection('all_coffee')
    const userCollection = client.db('DB_coffees').collection('users')

    app.get('/coffees', async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray()
      res.send(result)
    })

    app.post('/coffees', async (req, res) => {
      const newcoffee = req.body;
      const result = await coffeeCollection.insertOne(newcoffee)
      res.send(result)
    })

    app.delete('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeeCollection.deleteOne(query)
      res.send(result)
    })

    app.get('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeeCollection.findOne(query)
      res.send(result)
    })

    app.put('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const option = { upsert: true }
      const updatecoffee = req.body;
      console.log(updatecoffee)
      const update = {
        $set: {
          name: updatecoffee.name,
          price: updatecoffee.price,
          categary: updatecoffee.categary,
          details: updatecoffee.details,
          photo: updatecoffee.photo
        }
      }
      const result = await coffeeCollection.updateOne(filter, update, option)
      res.send(result)

    })


    //user crud

    app.get('/users', async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user)
      res.send(result)
    })

    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await userCollection.deleteOne(query)
      res.send(result)
    })

    app.patch('/users', async (req, res) => {
      const user = req.body;
      const filter={email: user.email}
      const updateddoc={
        $set:{
          lastlogin:user.lastlogin,
        }
      }
      const result = await userCollection.updateOne(filter,updateddoc)
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('my coffee server is running')
})

app.listen(port, (req, res) => {
  console.log('my port is: ', port)
})