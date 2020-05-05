import { cd } from '../../config/cloudinary.config';
import { BadRequest } from '../../common/exeptions';
import { File } from './files.model';
import { Transaction } from 'sequelize';

interface IFileCreate {
    fileContent: string;
    commentId: number;
    taskId: number;
    fileNameExtension: string;
}

const extensions: string[] = ['application/zip', 'text/plain', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf', 'application/rtf', 'application/vnd.oasis.opendocument.text'];

class FilesService {

    public async createOne({fileContent, fileNameExtension, commentId, taskId}:IFileCreate, transaction: Transaction): Promise<File> {
        try {
            if (!extensions.includes(fileNameExtension)) {
                throw new BadRequest(`Extension of upload file is not correct`);
            }
            const fileString = `data:${fileNameExtension};base64,${fileContent}`;
            const file = await cd.uploader.upload(fileString, { use_filename:true, resource_type: 'raw'}, (err, res) => {
                return err ? Object.keys(err) : res;
            });

            const fileDataForCreate: IFileCreate = {
                fileContent: file.url,
                fileNameExtension,
                commentId,
                taskId,
            };
            return File.create(fileDataForCreate, {transaction});
        } catch (e) {
            throw new BadRequest(e);
        }
    }
}

export const filesService = new FilesService();
