import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepo } from 'src/DB/repos/product.repo';
import { CategoryRepo } from 'src/DB/repos/category.repo';
import { TokenService } from 'src/common/utils/token/token';
import { JwtService } from '@nestjs/jwt';
import { UserRepo } from 'src/DB/repos/user.repo';
import { ProductModel } from 'src/DB/models/product.model';
import { CategoryModel } from 'src/DB/models/category.model';
import { UserModel } from 'src/DB/models/user.model';
import { CloudService } from 'src/common/utils/cloudService/cloud.service';

@Module({
  controllers: [ProductController],
  imports: [ProductModel , CategoryModel , UserModel],
  providers: [ProductService , ProductRepo , CategoryRepo , TokenService , JwtService , UserRepo , CloudService]
})
export class ProductModule {}
