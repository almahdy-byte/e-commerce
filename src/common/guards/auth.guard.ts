import { BadGatewayException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { TokenService } from "../utils/token/token";
import { UserRepo } from "src/DB/repos/user.repo";

@Injectable()
export class Auth implements CanActivate{
    constructor(
        private readonly tokenServices : TokenService,
        private readonly userRepo : UserRepo
    
    ){}


    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request : any = context.switchToHttp().getRequest();
        const token: any = request.headers.authorization;
        if(!token)
            throw new BadGatewayException('token verification error')
        const decoded =await this.tokenServices.verifyToken(token);
        if(!decoded)
            throw new BadGatewayException('token verification error')
        const user = await this.userRepo.findById({_id:decoded.id});
        if(!user)
            throw new BadGatewayException('user not found')
        request.user = user
        return true
        
    }
}