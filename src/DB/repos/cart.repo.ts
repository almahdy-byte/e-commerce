import {  Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseRepo } from "./base.repo";
import { Cart, CartType } from "../models/cart.model";

@Injectable()
export class CartRepo extends BaseRepo<CartType> {
    constructor(@InjectModel(Cart.name) private cartModule: Model<CartType>) {
        super(cartModule);
    }
    }