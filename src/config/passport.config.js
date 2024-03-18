import passport from "passport";
import local from "passport-local";
import UserModel from "../models/users.model.js";
import { createHash,isValidPassword } from "../utils.js";
import GitHubStrategy  from 'passport-github2';


const LocalStrategy = local.Strategy;
// const initializePassportLocal = () => {
//     passport.use('register',new LocalStrategy(
//         {passReqToCallback:true,usernameField:'email'}, async (req,username,password,done) =>{
//             const {first_name,last_name,age,email} = req.body;
//             try {
//                 let user = await UserModel.findOne({email:username})
//                 if (user) {
//                     console.log("Usuario existente")
//                     return done(null,false)
//                 }
//                 const newUser = {
//                     first_name,
//                      last_name,
//                      email,
//                      age,
//                      password :createHash(req.body.password)
//                 }
//                 let result = await UserModel.create(newUser);
//                 return done(null,result);
//             } catch (error) {
//                 return done("Error al obtener el usuario: "+ error )
//             }
//     }))

    const initializePassport = () => {
        console.log("initializePassport")
        passport.use('github',new GitHubStrategy.Strategy({
            clientID: 'Iv1.faeb125b430d60e7',
            clientSecret: '361b8dcc0de1addf5cf42df7bf08f5af03f51607',
            callbackUrl:'http://localhost:9080/api/sessions/githubcallback'
            //,passReqToCallback: true
        }
        , async (accessToken,refreshToken,profile,done) =>{
            console.log("en inicializacion")
            //const {first_name,last_name,age,email} = req.body;
            try {
                console.log(profile)
                console.log("email" + profile._json.email)
                let user = await UserModel.findOne({email:profile._json.email})
                console.log("user " + user)
                if (user) {
                    console.log("Usuario existente")
                    return done(null,false)
                }
                console.log("antes de asignacion de usuario")
                const newUser = {
                    first_name: profile._json.name,
                     last_name:'',
                     email:profile.json.email,
                     age:18,
                     password :''
                }
                console.log("newUser " + newUser)
                let result = await UserModel.create(newUser);
                return done(null,result);
            } catch (error) {
                return done(null,"Error al obtener el usuario: "+ error )
                //console.log(error)
            }
        }
        ))
    

    passport.serializeUser((user,done) => {
        console.log("SERIALIZACION")
        done(null,user._id)
    });

    passport.deserializeUser( async (id,done) => {
        let user= await UserModel.findById(id);
    });

    // passport.use('login',new LocalStrategy(
    //     {passReqToCallback:true,usernameField:'email'}, async (req,username,password,done) =>{
    //         const {first_name,last_name,age,email} = req.body;
    //         try {
    //             let user = await UserModel.findOne({email:username})
    //             if (!user) {
    //                 console.log("Usuario no existe")
    //                 return done(null,false)
    //             }
    //             if(!isValidPassword(user,password)) return don(null,false)
    //             return done(null,user)
    //         } catch (error) {
    //             return done("Error al loguear el usuario: "+ error )
    //         }
    // }))

}

export default initializePassport;