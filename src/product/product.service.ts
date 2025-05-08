import { BadRequestException, Injectable } from '@nestjs/common';
import { UserType } from 'src/DB/models/user.model';
import { ProductRepo } from 'src/DB/repos/product.repo';
import { CategoryRepo } from 'src/DB/repos/category.repo';
import { ObjectId } from 'mongoose';

@Injectable()
export class ProductService {
    constructor(
        private readonly productRepo: ProductRepo,
        private readonly categoryRepo: CategoryRepo
    ) {}

    async addProduct(addProductData:any , user: UserType, files: Express.Multer.File[], categoryId: ObjectId) {

        const {name, description, price, stock , folder , images } = addProductData;
        const isCategoryExist = await this.categoryRepo.findById({ _id: categoryId });


        
        if (!isCategoryExist) {
            throw new BadRequestException('Category not found');
        }

        if (!files || !files.length) {
            throw new Error('No image files uploaded');
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
        
        const product = await this.productRepo.create(document);
        console.log({product} , typeof product.price);
        
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
        })
        return products;
    }
}
