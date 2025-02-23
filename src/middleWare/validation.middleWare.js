import Joi from "joi";
import { Roles } from "../DB/models/user.model.js";
import { StatusCodes } from "http-status-codes";
import { code } from "../utils/sendEmail/code.js";

export const validation = (schema)=>{
    return (req,res,next)=>{
        const data = {
            ...req.body,
            ...req.params,
            ...req.query    
        }
        
        const result = schema.validate(data);
        let errors = [];
        if(result.error){
            errors.push(result.error.details[0].message)
            return next(new Error(errors) , {cause:StatusCodes.BAD_REQUEST})  
        }
        next();
}
}






export const generalValidation = {
    firstName : Joi.string(),
    lastName : Joi.string(),
    email:Joi.string().email(),
    password:Joi.string().min(6),
    phone:Joi.string(),
    role : Joi.string().valid(...Object.values(Roles)),
    code : Joi.string().length(6)
}