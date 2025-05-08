import { Model } from "mongoose"
import { Category, CategoryType } from "../models/category.model"
import { BaseRepo } from "./base.repo"
import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"


@Injectable()
export class CategoryRepo extends BaseRepo<CategoryType> {
    constructor(@InjectModel(Category.name) private  categoryModel:Model<CategoryType>) {
        super(categoryModel)
    }
}