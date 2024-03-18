import Router from "express";
import jwt from "jsonwebtoken";
import express from 'express'
import UsersDAO from "../daos/users.dao.js";

import productsRouter from "./productsModel.router.js"
import cartsRouter from "./cartsModel.router.js"
import { createHash, isValidPassword } from '../utils.js';
import passport from 'passport';


const router = express.Router();

//ROUTES
router.use("/api/products", productsRouter);
router.use("/api/carts", cartsRouter);




//router.post("/register",passport.authenticate('register',{failureRedirect:'/failregister'}), async (req, res) => {
router.post("/register", async (req, res) => {
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
console.log("email " + emailUsed)
    if(emailUsed){
        res.redirect("/register");
    } else {
        console.log(password)
        await UsersDAO.insert(first_name,last_name,age,email,password);
        res.redirect("/current");
    }

})

// router.get('/failregister', (req, res) => {
//     console.log("Failed Strategy")
//     res.send({error:"Failed"})
// })



//router.post("/login",passport.authenticate('/login',{failureRedirect:'/faillogin'}), async (req, res) => {
router.post("/login", async (req, res) => {
    const user =  req.body
    console.log("entre por aca " +  JSON.stringify(user))
    if (!user){ res.status(400).send({status:"error",error:"Invalid Credentials"})
}else{
    let UserBD = await UsersDAO.getUserByEmail(user.email);
    console.log(UserBD)
    console.log("token")
    let token = jwt.sign({id: UserBD._id}, 'secret_jwt', { expiresIn: '1h' });
    console.log("token " + token)
    console.log("cookies")
    res.cookie("jwt", token, {
        signed:true,
        httpOnly:true,
        maxAge: 1000*60*60
    }).json({status:200, msg:"Logged in"});
}
//     req.session.user = {
//         first_name: req.user.first_name,
//          last_name: req.user.last_name,
//          email: req.user.email,
//          age: req.user.age,

//     }
// console.log("voy a products")
//     res.redirect("/products");
    //res.send({status:"success",payload:req.user})
})

// router.get('/faillogin', (req, res) => {
//     console.log("Failed login")
//     res.send({error:"Failed login"})
// })

router.get("/current", passport.authenticate("jwt", {session:false}), (req, res) => {
    console.log("req " + req)
    res.json(req.user);
});

router.get("/logout", (req, res) => {
    //req.session.destroy((err) => {res.redirect("/home");})
    res.clearCookie("jwt");
    res.status(200).json({status:200, msg:"Logged out"}); 
})


router.get('/products', async (req, res) => {
  console.log("session get products")
  let products = await productManager.getProducts();
  res.render('products', { products });
});


router.get('/github',passport.authenticate('github',{scope:['user:email']}),async (req,res)=>{console.log('aca github')})

router.get('/githubcallback',passport.authenticate('github',{failureRedirect:'/login'}),async (req,res)=>{
    console.log('githubcallback')
    req.session.user = req.user;
    res.redirect('/');
})


export default router;