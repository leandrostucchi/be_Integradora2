import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
const cartCollection = 'carts';


const cartSchema = new mongoose.Schema({
    cid: Number,
    // products:[
    //            {pid:Number,
    //             quantity:Number,
    //             type:mongoose.Schema.Types.ObjectId,
    //             ref:'Products',
    //             autopopulate: true
    //         }]
    
    products:{
        type:[
            {product:{
                type:mongoose.Schema.Types.ObjectId, 
                ref:"Products",
                autopopulate: true
                },
                quantity:Number,
                pid:Number
            }
        ]
        ,default:[]
    }
    //product:[{pid:Number,quantity:Number,type:mongoose.Schema.Types.ObjectId, ref:'products'}]
    // product:[{type:mongoose.Schema.Types.ObjectId, ref: ProductModel,refPath:'datos'}],
    // datos:{pid:Number,quantity:Number}
}
// ,{
//     strictPopulate: false
// }
);
// cartSchema.pre('find',function(){

//     this.populate(products.product)
// })

cartSchema.plugin(mongoosePaginate);
const CartModel =  mongoose.model(cartCollection, cartSchema);
export default  CartModel;


