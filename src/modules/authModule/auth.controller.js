import { StatusCodes } from "http-status-codes";
import { Providers, Roles, tokenTypes, userModel } from "../../DB/models/user.model.js";
import { hash } from "../../utils/hash/hash.js";
import { encrypt } from "../../utils/crypt/encrypt.js";
import { code } from "../../utils/sendEmail/code.js";
import { template } from "../../utils/sendEmail/html.js";
import { emailEvent, subjects } from "../../utils/sendEmail/endEmail.js";
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
    if(!compare({text : code , hashedText : user.confirmEmailOTP}))
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
    if(!compare({text : password , hashedText : user.password}))
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


export const getProfile = async(req , res , next)=>{
    const user = req.user;
    res.status(StatusCodes.ACCEPTED).json({user})
}