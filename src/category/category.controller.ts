import { Body, Controller, Delete, Param, Patch, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDTO } from './DTO/category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from 'src/common/utils/multer/multer';
import { CloudInterceptor } from 'src/common/interceptors/cloud.interceptor';
import { Auth } from 'src/common/guards/auth.guard';
import { ObjectId } from 'mongoose';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryServices : CategoryService ){ } 

    @Post('')
    @UseInterceptors(
        FileInterceptor('image',MulterOptions ),
        CloudInterceptor
    )
    @UseGuards(Auth)
    async createCategory(@Body() createCategoryDto: CreateCategoryDTO , @Req () req:Request) {
        const user = req['user']
        return this.categoryServices.createCategory(createCategoryDto , user);
    }

    @Patch(':categoryId')
    @UseInterceptors(
        FileInterceptor('image',MulterOptions ),
        CloudInterceptor
    )
    @UseGuards(Auth)
    async updateCategory(@Body() updateCategory:Partial<CreateCategoryDTO>, @Param('categoryId') categoryId:ObjectId , @Req () req:Request) {
        const user = req['user']
        return this.categoryServices.updateCategory(categoryId ,  user , updateCategory);
    }
@Delete(':categoryId')
@UseGuards(Auth)
async deleteCategory(@Param('categoryId') categoryId: ObjectId , @Req () req:Request) {
    const user = req['user']
    return this.categoryServices.deleteCategory(categoryId , user)    
}

}