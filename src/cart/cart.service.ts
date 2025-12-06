import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {  UserType } from 'src/DB/models/user.model';
import { CartRepo } from 'src/DB/repos/cart.repo';
import { ProductRepo } from 'src/DB/repos/product.repo';
import { AddTOCart } from './DTO';


@Injectable()
export class CartService {
    constructor(
        private readonly productRepo: ProductRepo,
        private readonly cartRepo: CartRepo,
    ){}

    async addToCart(body : AddTOCart, productId: any, user: UserType) {
        const { quantity} = body;

        const product = await this.productRepo.findById({ _id: productId});
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        if(product.stock <= 0) {
            throw new BadRequestException('Product out of stock');
        }
        if( product.stock < quantity ) {
            throw new BadRequestException('Product quantity is not available please select another quantity');
        }
        product.stock -= quantity;
        let cart = await this.cartRepo.findOne({
            filter: { userId: user._id },
        })
        if(!cart) {
            cart = await this.cartRepo.create({ userId: user._id });
        }
        const productIndex = cart.products.findIndex((item) => item.productId.toString() === productId.toString());
        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ productId, quantity });
        }
        Promise.all([cart.save(), product.save()])
        return cart;
    }

    async getCart(user: UserType) {
        let cart = await this.cartRepo.findOne({
            filter: { userId: user._id },
            populate: [
                {
                    path:'products.productId',
                    select: 'name description price finalPrice stock images',
                }
            ]
        })
        if (!cart) {
            cart = await this.cartRepo.create({ userId: user._id });
        }
        let totalPrice = 0;
        if(cart.products.length) {
            cart.products.forEach((item) => {
                const product = item.productId;
                if (product) {
                    totalPrice += product['finalPrice'] * item.quantity;
                }
            });
        }
        return {cart , totalPrice};
}
}
