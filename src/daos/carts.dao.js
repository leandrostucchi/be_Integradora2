import Carts from "../models/carts.model.js";

class CartsDAO {
    static cid = 0;
    static async getCarts() {
        console.log("antes getCarts")
        return Carts.find().lean();
    }
    static async getCartById(id) {
        return Carts.findOne({ cid: id }).lean();
    }

    static async getCartByCIdAndPid(cid,pid) {
        return Carts.findOne({ cid: cid,product:[{pid:pid}] }).lean();
    }


    static async InitCarts() {
        CartsDAO.cid++;
        console.log("addCart")
        return new Carts({cid:CartsDAO.cid,product:[]}).save();
    }


    static async AddCarts(cid,pid,quantity) {
        CartsDAO.cid= cid+10;
        console.log("addCart")
        return new Carts({cid:CartsDAO.cid,product:[]}).save();
    }



     static async updateCart(data, newData) {
        console.log("updatcart")
        //  console.log(data)
        //  console.log(newData)
        return Carts.findByIdAndUpdate({_id:data._id},{$set: {product: newData}})
                                .then(success => console.log('Actualizacion OK'))
                                .catch(error =>{
                                        if(error){
                                            console.log('Error al actualizar ' + error);
                                            process.exit();
                                        }
                        });
    }


    static async delCarts(cid,pid) {
        console.log("delCarts")
        return Carts.findByIdAndDelete({ cid: cid,product:[{pid:pid}] }) ;
    }


}


export default CartsDAO;