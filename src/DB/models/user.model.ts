import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Gender, UserRole } from '../../common/user.enums';
import { HydratedDocument } from 'mongoose';
@Schema({ timestamps: true })
export class User{
    @Prop({
        type: String,
        required: true,
        trim: true,
    })
    firstName: string;

    @Prop({
        type:String , 
        required: true,
        trim: true,
    })
    lastName:string;

    @Prop({
        type: String,
        required: true,
        unique: true,
        trim: true,
    })
    email: string;

    @Prop({
        type: String,
    })
    phone: string;

    @Prop({
        type: String,
        required: true,
    })
    password: string;

    @Prop({
        type: String,
        enum: UserRole,
        default: UserRole.USER,
    })
    role: UserRole;

    @Prop({
        type: Boolean,
        default: false,
    })
    isDeleted: boolean;
    
    @Prop({
        type: Date,
    })
    DOB: Date;
    
    @Prop({
        type: String,
        enum: Gender,
        default: Gender.MALE,
    })
    gender: Gender;

    @Prop({
        type: Boolean,
        default: false,
    })
    isConfirmed: boolean;

    @Prop({
        type: Object,
        default: undefined,
    })
    confirmOTP:{
        otp: string | undefined,
        expiresAt: Date | undefined,
    }
}



const UserSchema = SchemaFactory.createForClass(User);
export const UserModel = MongooseModule.forFeature([{
    name: User.name,
    schema: UserSchema,
}]);

export type UserType = HydratedDocument<User> & Document;


