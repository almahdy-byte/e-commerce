import { Injectable } from "@nestjs/common";
import cloudinary from "src/common/config/cloud.config";


interface IUploadFile {
    path:string
    folder?:string
    public_id?:string
}
@Injectable()
export class CloudService {
    constructor() { }

    async uploadFile({path, folder, public_id}: IUploadFile) {
        return await cloudinary.uploader.upload(path, {
            folder: folder || 'default',
            public_id
        });
    }
    async deleteFile(public_id: string) {
        await cloudinary.uploader.destroy(public_id)
    }
    async deleteFolder(folder: string) {
        await cloudinary.api.delete_folder(folder)
    }
}