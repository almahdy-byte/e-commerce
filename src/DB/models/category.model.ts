import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ImageType } from 'src/common/types/image.type';
@Schema({ timestamps: true })
export class Category{
    @Prop({
        type: String,
        required: true,
        unique: true,
    })
    categoryName:string;


    @Prop({
        type: String,
        default: function () : any{ 
            return this.categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        }
    })
        slug: string

    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    })
    createdBy: Types.ObjectId 


    @Prop({
        type: Types.ObjectId,
        ref: 'User',
    })
    updatedBy: Types.ObjectId 
    @Prop({
        type:{
            public_id: String,
            secure_url: String,
        }
    })
    image: ImageType

    @Prop({
        type: String,
    })
    folder:string;
}



const CategorySchema = SchemaFactory.createForClass(Category);
export const CategoryModel = MongooseModule.forFeature([{
    name: Category.name,
    schema: CategorySchema,
}]);

export type CategoryType = HydratedDocument<Category> & Document;


