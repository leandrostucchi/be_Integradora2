import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
const usersCollection = "Users";


const UsersSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password:{
        type:String,
        required: true
    }
});

//export default mongoose.model("Users", UsersSchema);


UsersSchema.plugin(mongoosePaginate);
const UserModel =  mongoose.model(usersCollection, UsersSchema);
export default  UserModel;