import { CallHandler, ExecutionContext, Injectable , NestInterceptor } from "@nestjs/common";
import { CloudService } from "../utils/cloudService/cloud.service";
import { catchError, Observable } from "rxjs";

@Injectable()
export class CloudInterceptor implements NestInterceptor{
    constructor(private readonly cloudService : CloudService) { }
    async intercept(context : ExecutionContext , next : CallHandler<any> , ):Promise<Observable<any>>{
        const request = context.switchToHttp().getRequest();
        const file: Express.Multer.File = request.file;
        if(file) {
            const folderName = Math.ceil(Math.random() * 10000 + 99999).toString()
            const {public_id , secure_url} = await this.cloudService.uploadFile({
                path : file.path,
                folder : folderName,
            })
            request.body.folder = folderName
            request.body.image = {public_id , secure_url}
            }
        return next.handle().pipe(
            catchError(async (err:Error) => {
                if(request.folder) {
                    await this.cloudService.deleteFolder(request.folder)
                    throw err
                }
            }
        )
        )
    
    }
}

@Injectable()
export class CloudInterceptorMultiFiles implements NestInterceptor{
    constructor(private readonly cloudService : CloudService) { }
    async intercept(context : ExecutionContext , next : CallHandler<any> , ):Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const files:Express.Multer.File[] = request.files;        
        if(files && files.length) {
            const folder = Math.ceil(Math.random() * 10000 + 9999).toString()
            const images:{public_id , secure_url}[] = []
            for(const file of files) {
            const {public_id  , secure_url  }:any = await this.cloudService.uploadFile({
                path : file.path,
                folder : folder,
            })
        
            images.push({public_id, secure_url})
            }

            request.body.images = images
            request.body.folder = folder
            }
        return next.handle().pipe(
            catchError(async (err:Error) => {
                if(request.folder) {
                    await this.cloudService.deleteFolder(request.folder)
                    throw err
                }
            }
        )
        )
    
    }
}