import { cd } from '../../config/cloudinary.config';
import { BadRequest } from '../../common/exeptions';
import { File } from './files.model';
import { Transaction } from 'sequelize';

export interface IFileCreate {
    fileLink: string;
    commentId?: number;
    taskId?: number;
    fileNameExtension: string;
}

const extensions = {
    zip: 'application/zip',
    txt: 'text/plain',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    pdf: 'application/pdf',
    rtf: 'application/rtf',
    odt: 'application/vnd.oasis.opendocument.text'
};

class FilesService {
    public async createOne({fileLink, fileNameExtension, commentId, taskId}: IFileCreate,
                           transaction: Transaction): Promise<File> {
        try {
            const ext: boolean  = Object.keys(extensions).includes(fileNameExtension);

            if (!ext) {
                throw new BadRequest(`Extension of upload file is not correct`);
            }

            const fileString = `data:${extensions[fileNameExtension]};base64,${fileLink}`;

            const file = await cd.uploader.upload(fileString, {resource_type: 'raw', format: `${fileNameExtension}`}, (err, res) => {
                return err ? Object.keys(err) : res;
            });

            const fileDataForCreate = {
                fileLink: file.url,
                fileNameExtension,
                commentId,
                taskId,
                removeId: file.public_id,
            };

            return File.create(fileDataForCreate, {transaction});
        } catch (e) {
            throw new BadRequest(e);
        }
    }    

    public async deleteOne(taskId: number, transaction?: Transaction): Promise<void> {
      const { removeId }  = await File.findOne({ where: { taskId }, attributes: ['removeId'], transaction})
      await File.destroy({ where: { taskId }, transaction});
      try {
        await cd.uploader.destroy(removeId, (err, res) => {
          return err ? err : res;
        });
      } catch (e) {
        throw new BadRequest('Can not delete file');
      }
    }
}

export const filesService = new FilesService();
