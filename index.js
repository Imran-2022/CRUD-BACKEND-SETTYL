const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const cors=require('cors');
const { query } = require('express');
const ObjectId= require('mongodb').ObjectId;
require('dotenv').config()
const port = process.env.PORT || 8080;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

app.use(cors());
app.use(express.json())
const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.iyci5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


/* client.connect(err => {
  const collection = client.db("database2").collection("collection2");
  // perform actions on the collection object
collection.insertOne({name:"imran",age:34})
.then(() => {
    console.log("insert success")
})
  console.log(err)
//   client.close();
});
 */

async function run() {
    try {
        await client.connect();
        const database = client.db("database2");
        const collection = database.collection("collection1");
        // create a document to insert

        //get api


        app.get("/users",async(req, res)=>{
            const cursor =collection.find({})
            const users = await cursor.toArray();
            res.send(users);

        })


        app.get("/users/:id",async(req, res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)}
            const result = await collection.findOne(query);
            console.log(result);
            res.send(result);
        })

        // post api

        app.post("/users",async(req, res)=>{
            const newUser=req.body;
            const result = await collection.insertOne(newUser);
            console.log(result);
            // console.log(newUser)
            res.json(result);//res.send . 
        })

        // update api -

        app.put("/users/:id",async(req, res)=>{
            const id =req.params.id;
           const updatedUser=req.body;
           const filter = {_id:ObjectId(id)};
           const options = { upsert: true };
           const updateDoc = {
            $set: {
                name:updatedUser.name,
                email:updatedUser.email

            },
          };
          const result = await collection.updateOne(filter, updateDoc,options);
          res.send(result)//res.json(result)
            console.log("result : ",result);
        })

        // delete api

        app.delete("/users/:id",async(req, res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)}
            const result = await collection.deleteOne(query);
            // console.log("deleting user with id ",id);
            // res.json(1)
            res.send(result);
            console.log(result.deletedCount)
        })

       /*  
        const data = {
            name: "Kirman", age: 33
        }
        const result = await collection.insertOne(data);
        console.log(`A document was inserted with the _id: ${result.insertedId}`); */

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("this is me")
})

app.listen(port, () => {
    console.log("done")
})