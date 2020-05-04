import { cd } from '../../config/cloudinary.config';
import { PayloadToLarge } from '../../common/exeptions';
import { File } from './files.model';
import {Transaction} from 'sequelize';

interface IFileCreate {
    fileContent: string;
    commentId: number;
    taskId: number;
    fileNameExtension: string;
}

class FilesService {

    public async createOne(fileData:IFileCreate, transaction: Transaction): Promise<File> {
        console.log('fileData = ', fileData);
        let {fileContent, fileNameExtension, commentId, taskId} = fileData
        try {
            const file = await cd.uploader.upload(fileContent, { resource_type: "raw" }, (err, res) => {
                console.log('err = ', err);
                return err ? err : res;
            });
            console.log('file = ', file);
            const fileDataForCreate: IFileCreate = {
                fileContent: file.url,
                fileNameExtension,
                commentId,
                taskId,
            };
            console.log('fileDataForCreate = ', fileDataForCreate);
            return File.create(fileDataForCreate, {transaction});
        } catch (e) {
            throw new PayloadToLarge('File size is to large');
        }
    }
}

export const filesService = new FilesService();
