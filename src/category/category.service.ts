import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { CategoryRepo } from 'src/DB/repos/category.repo';
import { CreateCategoryDTO } from './DTO/category.dto';
import { UserType } from 'src/DB/models/user.model';
import { ObjectId } from 'mongoose';
import { UserRole } from 'src/common/user.enums';
import { CloudService } from 'src/common/utils/cloudService/cloud.service';
import slugify from 'slugify';
@Injectable()
export class CategoryService {
    constructor(private readonly categoryRepo: CategoryRepo , 
        private readonly cloudinaryService: CloudService
    ){}

        async createCategory(createCategory: CreateCategoryDTO , user : UserType){
            const {categoryName , folder , image} = createCategory            
            const existingCategory = await this.categoryRepo.findOne({
                filter: {
                    categoryName: categoryName,
                }
            });
            if (existingCategory) {
                throw new BadRequestException('Category name already exists');
            }
        const category = await this.categoryRepo.create({
            categoryName,
            folder,
            image,
            createdBy : user._id
        })
        
        return category
    }

    async deleteCategory(categoryId: ObjectId, user: UserType) {
        const category = await this.categoryRepo.findById({_id : categoryId})
        console.log({category , categoryId}) ;
        
        if (!category) {
            throw new BadRequestException('Category not found')
        }
        if (category.createdBy.toString() !== user._id.toString() && user.role !== UserRole.ADMIN) {
            throw new BadGatewayException('You are not authorized to delete this category')
        }
        if(category.image){
            await this.cloudinaryService.deleteFolder(category.folder)
        }
        await this.categoryRepo.deleteById({_id : categoryId})
        return { message: 'Category deleted successfully' }
}
    async updateCategory(categoryId: ObjectId, user: UserType, updateData: Partial<CreateCategoryDTO>) {
        const category = await this.categoryRepo.findById({ _id: categoryId });
        if (!category) {
            throw new BadRequestException('Category not found');
        }
        const {image , categoryName} = updateData
        if (category.createdBy.toString() !== user._id.toString() && user.role !== UserRole.ADMIN) {
            throw new BadGatewayException('You are not authorized to update this category');
        }
        if (categoryName) {
            const existingCategory = await this.categoryRepo.findOne(
            {
                filter:{
                    categoryName: categoryName,
                    _id: { $ne: categoryId } // Exclude the current category ID from the search
                }
            }
            );
            if(existingCategory) {
            throw new BadRequestException('Category name already exists' , {cause : new Error('Category name already exists')});
                }
            category.categoryName = categoryName;
            category.slug = slugify(categoryName) 
        }
        if (image) {
            await this.cloudinaryService.deleteFile(category.image.public_id);
            category.image = image;
        }
        category.updatedBy = user._id;
        await category.save();
        return {category};
}
}