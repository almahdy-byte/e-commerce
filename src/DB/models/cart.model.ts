import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({ timestamps: true })
export class Cart {
    @Prop({
        type: Types.ObjectId ,
        ref: 'User',
        required: true,
    })
    userId: Types.ObjectId;
    
    @Prop({
        type:[
            {
                productId: {
                    type: Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                }
            }
        ]
    })
    products: Array<{
        productId: Types.ObjectId;
        quantity: number;
    }>

} 

export const CartSchema = SchemaFactory.createForClass(Cart);
export type CartType = HydratedDocument<Cart> & Document;
export const CartModel = MongooseModule.forFeature([{
    name: Cart.name,
    schema: CartSchema,
}]);