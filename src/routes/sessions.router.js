import express from 'express'
import UsersDAO from "../daos/users.dao.js";

import productsRouter from "./productsModel.router.js"
import cartsRouter from "./cartsModel.router.js"
import { createHash, isValidPassword } from '../utils.js';
import passport from 'passport';
//import usersRouter from "./sessions.router.js"


const router = express.Router();

//ROUTES
router.use("/api/products", productsRouter);
router.use("/api/carts", cartsRouter);
//router.use("/api/sessions", usersRouter);



router.post("/register",passport.authenticate('register',{failureRedirect:'/failregister'}), async (req, res) => {
    console.log("/register con autenticacion")
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let age = parseInt(req.body.age);
    let password = createHash(req.body.password);

    if(!first_name || !last_name || !email || !age || !password){
        res.redirect("/register");
    }

    let emailUsed = await UsersDAO.getUserByEmail(email);
console.log(emailUsed)
    if(emailUsed){
        res.redirect("/register");
    } else {
        console.log(password)
        await UsersDAO.insert(first_name,last_name,age,email,password);
        res.redirect("/login");
    }

})

router.get('/failregister', (req, res) => {
    console.log("Failed Strategy")
    res.send({error:"Failed"})
})


router.post("/login",passport.authenticate('login',{failureRedirect:'/faillogin'}), async (req, res) => {
    if (!req.user) return res.status(400).send({status:"error",error:"Invalid Credentials"})
    console.log("entre por aca")

    req.session.user = {
        first_name: req.user.first_name,
         last_name: req.user.last_name,
         email: req.user.email,
         age: req.user.age,

    }
console.log("voy a products")
    res.redirect("/products");
    //res.send({status:"success",payload:req.user})
})

router.get('/faillogin', (req, res) => {
    console.log("Failed login")
    res.send({error:"Failed login"})
})


router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        res.redirect("/home");
    })
})


router.get('/products', async (req, res) => {
  console.log("session get products")
  let products = await productManager.getProducts();
  res.render('products', { products });
});




export default router;