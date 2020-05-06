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

const extensions = [
        {'application/zip': 'zip'},
        {'text/plain': 'txt'},
        {'application/msword': 'doc'},
        {'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx'},
        {'application/pdf': 'pdf'},
        {'application/rtf': 'rtf'},
        {'application/vnd.oasis.opendocument.text': 'odt'}
    ];

class FilesService {

    public async createOne({fileContent, fileNameExtension, commentId, taskId}:IFileCreate, transaction: Transaction): Promise<File> {
        try {

            const ext: {}|undefined = extensions.find(obj => Object.keys(obj).includes(fileNameExtension));

            if (!ext) {
                throw new BadRequest(`Extension of upload file is not correct`);
            }

            const fileString = `data:${fileNameExtension};base64,${fileContent}`;
            
            const file = await cd.uploader.upload(fileString, {resource_type: 'raw', format:`${ext[fileNameExtension]}`}, (err, res) => {
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
