import isBase64 = require('is-base64');
import { cd } from '../../config/cloudinary.config';
import { PayloadToLarge, UnsupportedMediaType, NotFound } from '../../common/exeptions';
import { sequelize } from '../../database';
import { File } from './files.model';
import {Transaction} from 'sequelize';
// import {cloudinary} from '../../cloudinary';

interface IFileCreate {
    fileLink: string;
    commentId: number;
    taskId: number;
    fileNameExtension: string;
}

class FilesService {

    //public async createOne(fileName: string, commentId: number, transaction: Transaction): Promise<File> {
    public async createOne(fileData:IFileCreate, transaction: Transaction): Promise<File> {
        let {fileLink, commentId, taskId} = fileData
        try{
            const file = await cd.uploader.upload(fileLink, { resource_type: "auto" }, (err, res) => {
                return err ? err : res;
            });

            console.log('from FilesService    file =  ', file);
            let publicLink = file.url;
            let fileNameExtension = file.format;
            let fileDataForCreate: IFileCreate = {
                fileLink: publicLink,
                fileNameExtension,
                commentId,
                taskId,
            };

            return File.create(fileDataForCreate, {transaction});
            }
                catch (e) {
            throw new PayloadToLarge('File size is to large');
        }
    }
}

export const filesService = new FilesService();
