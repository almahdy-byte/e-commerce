import { tokenTypes } from "../DB/models/user.model.js";
import { asyncErrorHandler } from "../utils/errorHandlers/asyncErrorHandler.js"
import { decodeToken } from "../utils/token/decodeToken.js";

export const auth =()=>{
    return(asyncErrorHandler(async(req , res , next)=>{
        const authorization = req.headers['authorization'];
        const {user} = await decodeToken(authorization , tokenTypes.access , next );
        req.user = user;
        next()
    }))
}