import passport from "passport";
import local from "passport-local";
import UserModel from "../models/users.model.js";
import { createHash,isValidPassword } from "../utils.js";

const LocalStrategy = local.Strategy;
const initializePassport = () => {
    passport.use('register',new LocalStrategy(
        {passReqToCallback:true,usernameField:'email'}, async (req,username,password,done) =>{
            const {first_name,last_name,age,email} = req.body;
            try {
                let user = await UserModel.findOne({email:username})
                if (user) {
                    console.log("Usuario existente")
                    return done(null,false)
                }
                const newUser = {
                    first_name,
                     last_name,
                     email,
                     age,
                     password :createHash(req.body.password)
                }
                let result = await UserModel.create(newUser);
                return done(null,result);
            } catch (error) {
                return done("Error al obtener el usuario: "+ error )
            }
    }))

    passport.serializeUser((user,done) => {
        done(null,user._id)
    });

    passport.deserializeUser( async (id,done) => {
        let user= await UserModel.findById(id);
    });

    passport.use('login',new LocalStrategy(
        {passReqToCallback:true,usernameField:'email'}, async (req,username,password,done) =>{
            const {first_name,last_name,age,email} = req.body;
            try {
                let user = await UserModel.findOne({email:username})
                if (!user) {
                    console.log("Usuario no existe")
                    return done(null,false)
                }
                if(!isValidPassword(user,password)) return don(null,false)
                return done(null,user)
            } catch (error) {
                return done("Error al loguear el usuario: "+ error )
            }
    }))

}

export default initializePassport;