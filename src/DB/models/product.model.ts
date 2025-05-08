import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import {  ProductImageType } from "src/common/types/image.type";

@Schema({ timestamps: true })
export class Product{


    
    @Prop({
        type: String,
        required: true,
        trim: true,
    })
    name: string;

    @Prop({
        type: String,
        trim: true,
    })
    description: string;

    @Prop({
        type: Number,
        required: true,
        min: 10,
    })
    price: number;

    @Prop({
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    })
    discount: number;

    @Prop({
        type: Number,
        default: function(){
            return this.price - (this.price * ((this.discount || 0) / 100))
        }
    })

    finalPrice: number;


    @Prop({
        type: Types.ObjectId,
        required: true,
        ref: 'Category',
        })
    categoryId: Types.ObjectId;


    @Prop({
        type: String,
        default: function (){
            return this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        }
        })
        slug: string;

    @Prop({
        type:Number,
        default: 1,
        min: 0,
        })
        stock: number;

    @Prop({
        type:[
            {
            public_id:  String,
            secure_url: String 
            }
        ] 
    })
        images: ProductImageType[]

    @Prop({
        type: String,
    })
    folder: string;


    @Prop({
        type:Types.ObjectId,
        ref: 'User',
        required: true,
    })
    seller: Types.ObjectId;
}

const ProductSchema = SchemaFactory.createForClass(Product);

export const ProductModel = MongooseModule.forFeature([{
    name: Product.name,
    schema: ProductSchema,
}]);
export type ProductType = HydratedDocument<Product> & Document;