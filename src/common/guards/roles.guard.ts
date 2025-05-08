import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
@Injectable()
export class RolesGuard implements CanActivate{
    constructor(
        private readonly reflector:Reflector
    ){}
    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get('roles' , context.getHandler());
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if(!roles)
            return true
        if(!user)
            throw new UnauthorizedException('user not found')
        if(!roles.includes(user.role))
            throw new BadRequestException('you are not authorized to access this route')
        return true
        
    }
}