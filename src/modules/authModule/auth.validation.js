import Joi from "joi";
import { generalValidation } from "../../middleWare/validation.middleWare.js";
import { code } from "../../utils/sendEmail/code.js";

export const registerValidationSchema = Joi.object({
    firstName:generalValidation.firstName.required(),
    lastName:generalValidation.lastName.required(),
    email:generalValidation.email.required(),
    role:generalValidation.role,
    phone:generalValidation.phone.required(),
    password:generalValidation.password.required(),
})

export const confirmEmailValidationSchema = Joi.object({
    email:generalValidation.email.required(),
    code : generalValidation.code.required()
})

export const loginValidationSchema = Joi.object({
    email:generalValidation.email.required(),
    password : generalValidation.password.required()
})