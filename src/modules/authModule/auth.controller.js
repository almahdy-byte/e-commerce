import { StatusCodes } from "http-status-codes";
import { Providers, Roles, tokenTypes, userModel } from "../../DB/models/user.model.js";
import { hash } from "../../utils/hash/hash.js";
import { encrypt } from "../../utils/crypt/encrypt.js";
import { code } from "../../utils/sendEmail/code.js";
import { template } from "../../utils/sendEmail/html.js";
import { emailEvent, subjects } from "../../utils/sendEmail/sendEmail.js";
import { compare } from "../../utils/hash/compare.js";
import { createToken } from "../../utils/token/createToken.js";
import { decodeToken } from "../../utils/token/decodeToken.js";
import { sign } from "../../utils/token/sign.js";

export const register = async(req , res , next)=>{
    const {firstName , lastName  , email , password , phone ,role} = req.body;
    const isExist = await userModel.findOne({email});
    if(isExist) 
        return next(new Error('Email already exist' , {cause:StatusCodes.BAD_REQUEST}));
    const confirmEmailOTP =await code();
    const html = template(confirmEmailOTP , `${firstName} ${lastName}` , subjects.confirmEmail);
    const user = await userModel.create({
        firstName ,
        lastName ,
        email , 
        role  ,
        password : hash(password) ,
        phone:await encrypt(phone) ,
        confirmEmailOTP:hash(confirmEmailOTP)
    })
    
    emailEvent.emit('confirmEmail' ,({to : email , html}))
    return res.status(StatusCodes.CREATED).json({message:'Done .. confirm the email' , user});
}

export const confirmEmail = async(req , res ,next)=>{
    const {code , email} = req.body;
    const user = await userModel.findOne({email});
    if(!user) 
        return next(new Error('user not found' , {cause:StatusCodes.NOT_FOUND}));
    if(!compare( code , user.confirmEmailOTP))
        return next(new Error('in-correct code' , {cause:StatusCodes.BAD_REQUEST}));
    user.confirmEmailOTP = undefined;
    user.isConfirmed = true;
    await user.save();
    return res.status(StatusCodes.CREATED).json({message:"confirmed the email", user});
}


export const logIn = async(req , res , next)=>{
    const {email , password} = req.body
    const user = await userModel.findOne({email , isConfirmed:true , provider : Providers.system});
    if(!user) 
        return next(new Error('user not found' , {cause:StatusCodes.NOT_FOUND}));
    if(!compare( password , user.password))
        return next(new Error('in-correct email or password' , {cause:StatusCodes.BAD_REQUEST}));
    const {accessToken , refreshToken} = await createToken(user.role , {id : user._id});
    return res.status(StatusCodes.ACCEPTED).json({message:"log-in successfully",accessToken , refreshToken})
}

export const refreshToken =async(req , res, next)=>{
    const {refreshToken} = req.body;    
    const {user , accessSignature} = await decodeToken(refreshToken , tokenTypes.refresh , next);
    const accessToken = await sign({id : user._id} , accessSignature)
    return res.status(StatusCodes.ACCEPTED).json({user , accessToken});
}
export const resetPassword =async(req , res , next)=>{
    const user = req.user;
    const resetPasswordOTP = await code();
    const html = template(resetPasswordOTP , `${user.firstName} ${user.lastName} ` ,subjects.resetEmail);
    emailEvent.emit('resetPassword' , ({to:user.email , html}));
    user.resetPasswordOTP = hash(resetPasswordOTP);
    await user.save();
    return res.status(StatusCodes.ACCEPTED).json({message:'check your email' ,user})
}

export const changePassword = async(req , res ,next)=>{
    const {code , password} = req.body;
    const user = req.user;
    if(!compare( code , user.resetPasswordOTP))
        return next(new Error('in-correct code' , {cause:StatusCodes.BAD_REQUEST}));
    user.password = hash(password);
    user.resetPasswordOTP = undefined;
    await user.save();
    return res.status(StatusCodes.ACCEPTED).json({message:'password changed' , user})
}

export const resetEmail = async(req , res , next)=>{
    const user = req.user;
    const {tempEmail} = req.body;
    const isExist = await userModel.findOne({email : tempEmail});
    if(isExist)
        return next(new Error('email already exist' ,{cause : StatusCodes.BAD_REQUEST}))
    user.tempEmail = tempEmail;
    const tempEmailOTP = await code();
    const changeEmailOTP = await code();
    emailEvent.emit('resetEmail' , {to:tempEmail, html : template(tempEmailOTP , `${user.firstName} ${user.lastName}`)});
    emailEvent.emit('resetEmail' , {to:user.email , html : template(changeEmailOTP , `${user.firstName} ${user.lastName}`)});
    user.changeEmailOTP = hash(changeEmailOTP);
    user.tempEmailOTP = hash(tempEmailOTP);
    await user.save();
    return res.status(StatusCodes.ACCEPTED).json({message:'check your email' ,user})
}

export const changeEmail = async(req , res ,next)=>{
const user = req.user;
const{changeEmailOTP , tempEmailOTP} = req.body;



if(!compare( changeEmailOTP , user.changeEmailOTP)
|| !compare( tempEmailOTP , user.tempEmailOTP))
    return next(new Error('in-correct codes' , {cause:StatusCodes.BAD_REQUEST}));


user.email = user.tempEmail;
user.tempEmail = undefined;
user.tempEmailOTP = undefined;
user.changeEmailOTP = undefined;
await user.save();
return res.status(StatusCodes.ACCEPTED).json({message:'email changed' , user})
}
export const getProfile = async(req , res , next)=>{
    const user = req.user;
    res.status(StatusCodes.ACCEPTED).json({user})
}