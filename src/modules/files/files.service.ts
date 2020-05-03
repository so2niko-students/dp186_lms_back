import { cd } from '../../config/cloudinary.config';
import { PayloadToLarge } from '../../common/exeptions';
import { File } from './files.model';
import {Transaction} from 'sequelize';

interface IFileCreate {
    fileLink: string;
    commentId: number;
    taskId: number;
    fileNameExtension: string;
}

class FilesService {

    public async createOne(fileData:IFileCreate, transaction: Transaction): Promise<File> {
        let {fileLink, fileNameExtension, commentId, taskId} = fileData
        try {
            const file = await cd.uploader.upload(fileLink, { resource_type: "raw" }, (err, res) => {
                return err ? err : res;
            });
            const fileDataForCreate: IFileCreate = {
                fileLink: file.url,
                fileNameExtension,
                commentId,
                taskId,
            };
            return File.create(fileDataForCreate, {transaction});
        } catch (e) {
            throw new PayloadToLarge('File size is to large');
        }
    }
}

export const filesService = new FilesService();
