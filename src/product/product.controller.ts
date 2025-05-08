import { Body, Controller, Get, Param, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { Auth } from 'src/common/guards/auth.guard';
import { CloudInterceptorMultiFiles } from 'src/common/interceptors/cloud.interceptor';
import { Roles } from 'src/common/decorator/roles.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from 'src/common/utils/multer/multer';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/common/user.enums';
import { AddProductDTO } from './DTOs/product.dto';
import { ObjectId } from 'mongoose';
// import { ObjectId } from 'mongoose';

@Controller('product')
export class ProductController {
    constructor(private readonly productServices : ProductService){}

    @Post('/:categoryId')
    @Roles(UserRole.SELLER)
    @UseGuards(Auth , RolesGuard)
    @UseInterceptors(
        FilesInterceptor('images', 4 ,MulterOptions ),
        CloudInterceptorMultiFiles)
    async addProduct(@Body() addProductDate : AddProductDTO  , @Req() req:Request ,  @UploadedFiles() files: Express.Multer.File[] , @Param('categoryId') categoryId: ObjectId) {
        const user = req['user'];
        return await this.productServices.addProduct(addProductDate , user , files , categoryId);
    }
    @Get()
    async getProducts(@Req() req:Request) {
        const parsedQuery = req['parsedQuery'];
        const query = req['query'];
        console.log({parsedQuery , query});
        
        return await this.productServices.getProducts(parsedQuery);    
    }
}
