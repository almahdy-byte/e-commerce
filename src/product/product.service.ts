import { BadRequestException, Injectable } from '@nestjs/common';
import { UserType } from 'src/DB/models/user.model';
import { ProductRepo } from 'src/DB/repos/product.repo';
import { CategoryRepo } from 'src/DB/repos/category.repo';
import { ObjectId } from 'mongoose';
import { AddProductDTO } from './DTOs/product.dto';


@Injectable()
export class ProductService {
    constructor(
        private readonly productRepo: ProductRepo,
        private readonly categoryRepo: CategoryRepo
    ) {}
    async addProduct(addProductData:AddProductDTO , user: UserType, files: Express.Multer.File[], categoryId: ObjectId) {
        
        const {name, description, price, stock , folder , images } = addProductData;
        const isCategoryExist = await this.categoryRepo.findById({ _id: categoryId });

    
        
        if(price == undefined || isNaN(Number(price))) {
            throw new BadRequestException('Price must be a number');
        }
        
        
        if (!isCategoryExist) {
            throw new BadRequestException('Category not found');
        }

        if (!files || !files.length) {
            throw new BadRequestException('No image files uploaded');
        }
            

        const document = {
            name,
            description,
            price : Number(price),
            stock : Number(stock),
            categoryId: isCategoryExist._id,
            seller: user._id,
            folder,
            images 
            }
            

        console.log({document});
        const product = await this.productRepo.create(document);

            
        
        return product;
    }
    async getProducts(query: any) {
        let {sort , page , limit , ...filter} = query;
        filter = JSON.parse(JSON.stringify(filter).replace(/lte|gte/g,(match) => {
            return `$${match}`;
        }))
        
        const products = await this.productRepo.findAll({
            filter,
            sort,
            limit,
            skip: page ? (page - 1) * limit : 0,
        });
        if(!products.length) {
            throw new BadRequestException('No products found');
        }
        return products;
    }
}
