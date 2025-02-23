import { model, Schema } from "mongoose";
const productSchema = new Schema({
    Name:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
        set:function(value){
            return this.discount ? value : value - (this.discount * value)
        }
    },
    image:{
        public_id:String,
        secure_url:String
    },
    availableCopies:{
        type:Number,
        default:0
    },
    isAvailable:{
        type:Boolean,
        default:function(){
            return this.availableCopies>0 ? true : false
        }
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    discount:{
        type:Number,
        default:0
    }
} , {timestamps:true})


export const productModel = model('Products' , productSchema);