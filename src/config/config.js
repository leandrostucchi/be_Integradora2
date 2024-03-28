import dotenv from 'dotenv';

const enviroment = 'DEVELOPMENT';

// dotenv.config(
//     {path:enviroment === 'DEVELOPMENT'? '../../.env.development':''  }

// );
dotenv.config()


export default{
    port: process.env.PORT
}

console.log(process.env.PORT)