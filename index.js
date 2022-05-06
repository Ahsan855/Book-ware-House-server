const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
// Middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.i7qrh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const orderCollection = client.db("Book-WareHouse").collection("order");
    // All item show
    app.get("/allbooks", async (req, res) => {
      const query = {};
      const cursor = orderCollection.find(query);
      const books = await cursor.toArray();
      res.send(books);
    });
    // create app
    app.post("/order", async (req, res) => {
      const book = req.body;
      const result = await orderCollection.insertOne(book);
      console.log(book);
      res.send(result);
    });

    // Update Item
    app.get("/book/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await orderCollection.findOne(filter);
      res.send(result);
    });

    app.put("/book/:id", async (req, res) => {
      const id = req.params.id;
      const book = req.body;

      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      // create a document that sets the plot of the movie
      const updateDoc = {
        $set: {
          productName: book.name,
          image: book.image,
          price: book.price,
          discriptions: book.discriptions,
          suplier: book.suplier,
          quantity: book.quantity,
        },
      };
      const result = await orderCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // Delete item
    app.delete("/book/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    });

    console.log("Connected successfully......");
  } finally {
  }
}
run().catch(console.dir);

app.listen(PORT, () => {
  console.log("server connected");
});
