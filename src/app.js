// lado servidor

import express from "express";
import handlebars,{engine} from "express-handlebars";
import __dirname from "./utils.js";
import viewsRouter from './routes/views.router.js';
import productsRouter from "./routes/productsModel.router.js"
import cartsRouter from "./routes/cartsModel.router.js"
import { Server } from "socket.io";
import mongoose from "mongoose";
import sessionsRouter from "./routes/sessions.router.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";


const port = 9080
//let mongoBase = "mongodb://localhost:27017/ecommerce";
let mongoBase = 'mongodb+srv://lstucchi:tGrjLHdnChKYsgoN@cluster0.s4wk2id.mongodb.net/ecommerce?retryWrites=true&w=majority'
const app = express();

const httpServer =  app.listen(port,() => console.log('Servidor arriba  puerto:' + port))
const io = new Server(httpServer);

app.use(cookieParser());
app.use(session({
    store:MongoStore.create({
        mongoUrl:mongoBase,
        //mongoOptions:{useNewUrlParser:true,useUnifiedTopology:true},
        ttl:1500,
    }),
    secret:"secretCode",
    resave:true,
    saveUninitialized:true
}))


mongoose.connect(mongoBase)
.then(success => console.log('Conectado a la base'))
.catch(error =>{
    if(error){
      console.log('No se pudo conectar a la base ' + error);
      process.exit();
    }
  });


app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/ping',(req,res) =>{     res.send('pong') })


app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));

app.use('/', viewsRouter)
app.use("/api/sessions", sessionsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
//app.use("/api/sessions", usersRouter);



// app.get("/:universalURL", (req, res) => { 
//   console.log(req.error)
//   res.status(404).send({
//     status:404,
//     result:"error",
//     error:"404 URL NOT FOUND"
//   });
// }); 

//   const dataID = document.getElementById('update').value;
// console.log(dataID)
io.on('connection', (socket) => {
//  console.log('Nuevo cliente conectado')

  socket.on("productsNew", async (data) => {
    console.log("Entre por aca addProduct xxxx" )
    console.log(data)
    //await productManager.addProduct(tittle,description,price,thumbnail,code,stock);
    await productManager.addProduct(''   ,data.name   ,''         ,data.price,0     ,'');
    io.emit("recibirProductos", productManager.getProducts());
  });

  socket.on("Product", async (data) => {
    console.log("Entre por aca Product" )
    console.log(data)
  });
  socket.on("updProduct", () => {
    console.log("entre aca updProduct")
  });

  socket.on("deleteProduct", async (productId) => {
    console.log("deleteProduct")
    console.log(productId)

    let num = Object.values(productId)
    // Encontrar el índice del producto con el productId
    await productManager.deleteProduct(parseInt(num));
    io.emit("recibirProductos", productManager.getProducts());
  });
 
  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
})