import express from 'express'
import UsersDAO from "../daos/users.dao.js";

import productsRouter from "./productsModel.router.js"
import cartsRouter from "./cartsModel.router.js"
//import usersRouter from "./sessions.router.js"


const router = express.Router();

//ROUTES
router.use("/api/products", productsRouter);
router.use("/api/carts", cartsRouter);
//router.use("/api/sessions", usersRouter);



router.post("/register", async (req, res) => {

    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let age = parseInt(req.body.age);
    let password = req.body.password;

    if(!first_name || !last_name || !email || !age || !password){
        res.redirect("/register");
    }

    let emailUsed = await UsersDAO.getUserByEmail(email);

    if(emailUsed){
        res.redirect("/register");
    } else {
        await UsersDAO.insert(first_name,last_name,age,email,password);
        res.redirect("/login");
    }

})

router.post("/login", async (req, res) => {
console.log("entre por aca")
    let email = req.body.email;
    let password = req.body.password;

    if(!email || !password){
        res.redirect("/login");
    }

    let user = await UsersDAO.getUserByCreds(email, password);

    if(!user){
        res.redirect("/login");
    } else {
        console.log("leo products")
        req.session.user = user._id;
        res.redirect("/products");
    }

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