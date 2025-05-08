import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepo } from 'src/DB/repos/user.repo';
import { RegisterDto } from './DTO/register.dto';
import { hash , compare } from 'src/common/utils/hash/hash';
import { crypt } from 'src/common/utils/crypto/crypt';
import { TokenService } from 'src/common/utils/token/token';
import { LoginDto } from './DTO/login.dtp';
import { code } from 'src/common/utils/sendEmail/code';
import { emailEvent } from 'src/common/utils/sendEmail/sendEmail';
import { template } from 'src/common/utils/sendEmail/html';
import { ConfirmEmailDto } from './DTO/confirmEmail.dto';
@Injectable()
export class AuthService {
    constructor(private readonly userRepo:UserRepo , private readonly tokenService:TokenService){}

    async register(body:RegisterDto){
        const isEmailExist = await this.userRepo.findByEmail(body.email)
        if(isEmailExist){
            throw new BadRequestException('Email already exists')
        }

        //hash password
        body.password = hash(body.password)

        //crypt phone number if exists
        if (body.phone) {
            body.phone = crypt(body.phone);
        }

        const confirmCode = code();
        const html = template(confirmCode, body.firstName, body.email);
        emailEvent.emit('confirmEmail' ,{to : body.email , html})
        const user = await this.userRepo.create({...body, confirmOTP : {otp: hash(confirmCode), expiresAt: new Date(Date.now() + 5 * 60 * 1000)}});
        return user;
    }

    async login(body:LoginDto){
        const user  = await this.userRepo.findByEmail(body.email);
        if(!user){
            throw new BadRequestException('Email or password is incorrect')
        }
        if(!compare(body.password, user.password)){
            throw new BadRequestException('Email or password is incorrect')
        }
        const token = this.tokenService.generateToken(
            {id: user._id}, { expiresIn: '1w' })
        return {token}

    }

    async confirmEmail(body:ConfirmEmailDto){
        const user = await this.userRepo.findOne(
            {filter: 
                {email: body.email,
                 confirmOTP: {$exists: true} ,
                 isConfirmed:false
                }});
        if(!user){
            throw new BadRequestException('Email not found')
        }
        if(!user.confirmOTP.otp){
            throw new BadRequestException('No code sent')
        }
        if(user.confirmOTP.expiresAt && user.confirmOTP.expiresAt < new Date()){
            throw new BadRequestException('Code expired')
        }
        if(!compare(body.code, user.confirmOTP.otp)){
            throw new BadRequestException('Invalid code')
        }
        await this.userRepo.updateOne({filter: {_id: (user as any)._id}, update: {isConfirmed: true, confirmOTP: {otp: undefined, expiresAt: undefined} }})
        return {message: 'Email confirmed'}
    }
}
