import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import {  CartModel } from 'src/DB/models/cart.model';
import {  UserModel } from 'src/DB/models/user.model';
import { CartRepo } from 'src/DB/repos/cart.repo';
import { UserRepo } from 'src/DB/repos/user.repo';
import { ProductRepo } from 'src/DB/repos/product.repo';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/common/utils/token/token';
import { ProductModel } from 'src/DB/models/product.model';

@Module({
  controllers: [CartController],
  imports: [CartModel , UserModel , ProductModel],
  providers: [CartService , CartRepo , UserRepo , ProductRepo , JwtService , TokenService ]
})
export class CartModule {}
