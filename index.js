const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(cors())
app.use(express.json())

// username :dbjohnn1
// password:tx6kerv7KsEGK6Nz


const uri = "mongodb+srv://dbjohnn1:tx6kerv7KsEGK6Nz@cluster0.scnnn8p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const productCollection  = client.db('Product').collection('cars')
    const partsCollection  = client.db('Product').collection('parts')
    const orderCollection  = client.db('Product').collection('order')
    const userCollection  = client.db('Product').collection('user')

    // /////////data mongo thaka load korae
    app.get('/product',async(req,res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const product = await cursor.toArray();
      res.send(product)
    })

    // ///find one\\\\\\\\\\\\
    app.get('/product/:id',async(req,res) =>{
      const id = req.params.id;
      const query = {_id:new ObjectId(id)}
      const product = await productCollection.findOne(query)
      res.send(product)
    })

    // /////Post Data\\\\\\\\\\\
    app.post('/product',async(req,res)=> {
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct)
      res.send(result)
    })
    
    ///////delet\\\\\\\\\\\
    app.delete('/product/:id',async(req,res) => {
      const id = req.params.id;
      const query = {_id:new ObjectId(id)}
      const result = await productCollection.deleteOne(query)
      res.send(result)

    })

    // update quantity
    app.put('/updatequantity/:id',async(req,res) => {
      const id = req.params.id;
      // console.log(id)
      const updatequantity = req.body
      // console.log(updatequantity)

      const filter = {_id:new ObjectId(id)}
      const options = { upsert:true}
      const updateDoc = {
        $set: {
          quanty: updatequantity.quanty,
          
        }
      };
      const result = await productCollection.updateOne(filter,updateDoc,options);
      // console.log(result)
      res.send(result)
    })


    // update price
    app.put('/Updateprice/:id',async(req,res) => {
      const id = req.params.id;
      // console.log(id)
      const Updateprice = req.body
      // console.log(updatequantity)

      const filter = {_id:new ObjectId(id)}
      const options = { upsert:true}
      const updateDoc = {
        $set: {
          price: Updateprice.price,
          
        }
      };
      const result = await productCollection.updateOne(filter,updateDoc,options);
      // console.log(result)
      res.send(result)
    })

        // /////////parts data mongo thaka load korae
        app.get('/parts',async(req,res) => {
          const query = {};
          const cursor = partsCollection.find(query);
          const product = await cursor.toArray();
          res.send(product)
        })
        // /////////order\\\\\\\\\\\\
        app.post('/order',async(req,res)=> {
          const newProduct = req.body;
          const result = await orderCollection.insertOne(newProduct)
          res.send(result)
        })

            // /////////order mongo thaka load korae
        app.get('/order',async(req,res) => {
          const email =  req.query.email;
          const query = {email:email}
          const cursor = orderCollection.find(query);
          const product = await cursor.toArray();
          res.send(product)
        })
        //////////order delete\\\\\\\\
        app.delete('/order/:id',async(req,res) => {
          const id = req.params.id;
          const query = {_id:new ObjectId(id)}
          const result = await orderCollection.deleteOne(query)
          res.send(result)
    
        })

        app.put('/user/:email',async(req,res) => {
          const email = req.params.email;
          console.log(email)
          const user = req.body;
          const filter = {email: email};
          const options = {upsert : true}
          const updateDoc = {
            $set: user,  
          };
          const result = await userCollection.updateOne(filter,updateDoc,options);
          res.send({result })
    
        })

            // /////////user mongo thaka load korae
    app.get('/user',async(req,res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const product = await cursor.toArray();
      res.send(product)
    })

    //////////user delete\\\\\\\\
    app.delete('/user/:id',async(req,res) => {
      const id = req.params.id;
      const query = {_id:new ObjectId(id)}
      const result = await userCollection.deleteOne(query)
      res.send(result)

    })
    // //////////admin banano \\\\\\\\\\\\\\\\

    app.put('/user/admin/:email',async(req,res) => {
      const email = req.params.email;
      const requester = req.params.email;
      
      const requesteraccount = await userCollection.findOne({email:requester})
     
      // if(requesteraccount.role == 'admin'){
        // console.log(requesteraccount)
        
        const filter = {email: email};
        // console.log(filter)
        const updateDoc = {
          $set: {role:'admin'},
        };
        const result = await userCollection.updateOne(filter,updateDoc);
        res.send(result )
    })
    app.get('/admin/:email',async(req,res) => {
      const email = req.params.email;
      const user= await userCollection.findOne({email:email});
      console.log(user)
      const isAdmin = user.role === 'admin';
      res.send({admin: isAdmin})
    })


   
  } catch(error) {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})