import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {  User, UserType } from "../models/user.model";
import { Model } from "mongoose";
import { BaseRepo } from "./base.repo";
@Injectable()
export class UserRepo extends BaseRepo<UserType>{
    
    constructor(@InjectModel(User.name) private userModel:Model<UserType>) {
        super(userModel)
    }

    async findByEmail(email:string):Promise<UserType | null>{
        return await this.findOne({filter:{email}})
    }
    
}
