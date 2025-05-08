import { BadRequestException } from "@nestjs/common";
import { diskStorage } from "multer";

export const MulterOptions = {
    storage: diskStorage({}),
    filename: (req, file, cb) => { 
        if(!file.mimetype.startsWith('image/')) {
            return cb(new BadRequestException('File type not supported'), false);
        }
    }
}