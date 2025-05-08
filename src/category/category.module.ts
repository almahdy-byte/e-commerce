import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryRepo } from 'src/DB/repos/category.repo';
import { CategoryModel } from 'src/DB/models/category.model';
import { CloudService } from 'src/common/utils/cloudService/cloud.service';
import { UserModel } from 'src/DB/models/user.model';
import { UserRepo } from 'src/DB/repos/user.repo';
import { TokenService } from 'src/common/utils/token/token';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [CategoryModel , UserModel],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepo, CloudService , UserRepo , TokenService , JwtService],
})
export class CategoryModule {}
