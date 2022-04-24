const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const host = "localhost";
const port = process.env.PORT || 5000;

const app = express();

// use middleware
app.use(cors());
app.use(express.json());

// Database connection string

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ag1p9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const productCollection = client.db("emaJohn").collection("product");

    // GET product : get all products
    app.get("/product", async (req, res) => {
      console.log("query", req.query);
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);

      const query = {};
      const cursor = productCollection.find(query);
      let products;
      if (page || size) {
        // 0 --> skip : 0 get: 0-10(10)
        // 1 --> skip : 0-10 get: 11-20(10)
        // 2 --> skip : 11-20 get: 21-30(10)
        // 3 --> skip : 21-30 get: 31-40(10)
        products = await cursor
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        products = await cursor.toArray();
      }
      res.send(products);
    });

    // GET productcount :
    app.get("/productCount", async (req, res) => {
      const count = await productCollection.estimatedDocumentCount();
      res.send({ count });
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("John is running and waiting for Ema");
});

// Listen
app.listen(port, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
