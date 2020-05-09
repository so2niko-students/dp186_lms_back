import { cd } from '../../config/cloudinary.config';
import { BadRequest } from '../../common/exeptions';
import { File } from './files.model';
import { Transaction } from 'sequelize';

interface IFileCreate {
    fileLink: string;
    commentId: number;
    taskId?: number;
    fileNameExtension: string;
}

const extensions = {
    'zip': 'application/zip',
    'txt': 'text/plain',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'pdf': 'application/pdf',
    'rtf': 'application/rtf',
    'odt': 'application/vnd.oasis.opendocument.text'
};

class FilesService {

    // fileNameExtension (from front) = zip...
    public async createOne({fileLink, fileNameExtension, commentId, taskId}: IFileCreate,
                           transaction: Transaction): Promise<File> {
        try {
            const ext: {}|undefined = Object.keys(extensions).includes(fileNameExtension);

            if (!ext) {
                throw new BadRequest(`Extension of upload file is not correct`);
            }

            const fileString = `data:${ext[fileNameExtension]};base64,${fileLink}`;

            const file = await cd.uploader.upload(fileString, {resource_type: 'raw', format: `${fileNameExtension}`}, (err, res) => {
                return err ? Object.keys(err) : res;
            });

            const fileDataForCreate: IFileCreate = {
                fileLink: file.url,
                fileNameExtension,
                commentId,
            };
            return File.create(fileDataForCreate, {transaction});
        } catch (e) {
            throw new BadRequest(e);
        }
    }
}

export const filesService = new FilesService();
