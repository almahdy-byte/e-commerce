import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepo } from 'src/DB/repos/user.repo';
import { UserModel } from 'src/DB/models/user.model';
import { TokenService } from 'src/common/utils/token/token';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports:[UserModel ],
  controllers: [AuthController],
  providers: [AuthService , UserRepo , TokenService , JwtService  ]
})
export class AuthModule {}
