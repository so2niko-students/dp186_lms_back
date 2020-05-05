import isBase64 = require('is-base64');
import { cd } from '../../config/cloudinary.config';
import { PayloadToLarge, UnsupportedMediaType, NotFound } from '../../common/exeptions';
import { sequelize } from '../../database';
import { Avatars } from './avatars.model';
import { Groups } from '../groups/groups.model';
import { Students } from '../students/students.model';
import { Teachers } from '../teachers/teachers.model';
import { Transaction } from 'sequelize';

class AvatarsService {
    public async createOne(avatarLink: string, removeId: string, transaction: Transaction) {
        return Avatars.create({
            avatarLink,
            removeId,
        }, {transaction});
    }
    public async findOneById(id: number, transaction?: Transaction) {
        return Avatars.findOne({where: {id}, transaction });
    }
    public async setAvatarToGroupOrThrow(base64: string, type: string, group: Groups,
                                         transaction: Transaction) {
        const {avatarId: oldAvatarId} = group;
        if (oldAvatarId) {
            await this.deleteImgFromDBaseAndCloudianry(oldAvatarId, transaction);
        }
        const { url, public_id: removeId } = await this.uploadImgOrThrow(base64, type);
        const avatar: Avatars = await this.createOne(url, removeId, transaction);
        group.avatarId = avatar.id;
        await group.save({transaction});
        return group;
    }
    public async setAvatarToUserOrThrow(base64: string, type: string, user: Teachers | Students,
                                        transaction: Transaction) {
        const { avatarId: oldAvatarId } = user;
        if (oldAvatarId) {
            await this.deleteImgFromDBaseAndCloudianry(oldAvatarId, transaction);
        }
        const { url, public_id: removeId } = await this.uploadImgOrThrow(base64, type);
        const avatar: Avatars = await this.createOne(url, removeId, transaction);
        user.avatarId = avatar.id;
        return user.save({transaction});
    }
    private async uploadImgOrThrow(base64: string, type: string) {
        const img = `data:${type};base64,${base64}`;
        if (!isBase64(img, {mimeRequired: true})) {
            throw new UnsupportedMediaType('Unsupported file type');
        }
        try {
            const image = await cd.uploader.upload(img, (err, res) => {
                return err ? err : res;
            });
            return image;
        } catch (e) {
            throw new PayloadToLarge('Image size is to large');
        }
    }
    private async deleteImgOrThrow(publicId: string) {
        try {
            const del = await cd.uploader.destroy(publicId, (err, res) => {
                return err ? err : res;
            });
            return del;
        } catch (e) {
            throw new NotFound('Error updating avatar. Try again later');
        }
    }
    private async deleteImgFromDBaseAndCloudianry(delAvatarId: number, transaction: Transaction) {
        const oldAvatar = await this.findOneById(delAvatarId, transaction);
        await this.deleteImgOrThrow(oldAvatar.removeId);
        return await oldAvatar.destroy({transaction});
    }
}

export const avatarService = new AvatarsService();
