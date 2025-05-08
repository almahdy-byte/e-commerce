import { Injectable } from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";


@Injectable()
export class TokenService {
    constructor(private readonly jwtService: JwtService) {}

    generateToken(payload: object, options: JwtSignOptions): string | undefined {
        return this.jwtService.sign(payload, {
            ...options , secret: process.env.TOKEN_KEY
        }) ;
      
     }
      verifyToken(token: string) {
            const decoded = this.jwtService.verify(token, { secret: process.env.TOKEN_KEY }) ;
            
            return decoded 

    }
}


