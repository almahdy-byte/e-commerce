import { model, Schema, Types } from "mongoose";


export const Roles = {
    user:'user',
    admin:'admin'
}
export const Providers = {
google:'google',
system:'system'
}
export const tokenTypes = {
    access:'access',
    refresh:'refresh'
}
Object.freeze(Providers);
Object.freeze(Roles);
Object.freeze(tokenTypes);
const userSchema = new Schema({
    firstName:{
        type : String,
        required : true
    },
    lastName :{
        type:String,
        required : true
    } , 
    email:{
        type:String,
        required:true,
        unique:true
    } , 
    password:{
        type:String , 
    },
    phone:{
        type:String,
    },
    isConfirmed : {
        type:Boolean,
        default:false,
    },
    confirmEmailOTP:{
        type:String
    },
    resetPasswordOTP:{
        type:String
    },
    role:{
        type:String,
        enum:Object.values(Roles) ,
        default : Roles.user
    },
    cart:[{
        type:Types.ObjectId,
        ref : 'Products'
    }],
    provider:{
        type:String,
        enum:Object.values(Providers),
        default:Providers.system
    }
})



export const userModel = model('Users' , userSchema);