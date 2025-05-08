import {  Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Product, ProductType } from "../models/product.model";
import { Model } from "mongoose";
import { BaseRepo } from "./base.repo";

@Injectable()
export class ProductRepo extends BaseRepo<ProductType> {
    constructor(@InjectModel(Product.name) private productModel: Model<ProductType>) {
        super(productModel);
    }
    }