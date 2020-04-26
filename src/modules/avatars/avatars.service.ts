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
    public async createOne(avatarLink: string, publicId: string, transaction: Transaction) {
        return await Avatars.create({
            avatarLink,
            publicId,
        }, {transaction});
    }
    public async findOneById(id: number, transaction?: Transaction) {
        return await Avatars.findOne({where: {id}, transaction });
    }
    public async setAvatarToGroupOrThrow(base64: string, type: string, group: Groups) {
        return sequelize.transaction(async (transaction) => {
            const {avatarId: oldAvatarId} = group;
            if (oldAvatarId) {
                await this.deleteImgFromDBaseAndCloudianry(oldAvatarId, transaction);
            }
            const { url, public_id } = await this.uploadImgOrThrow(base64, type);
            const avatar: Avatars = await this.createOne(url, public_id, transaction);
            group.avatarId = avatar.id;
            await group.save({transaction});
            return group;
        });
    }
    public async setAvatarToUserOrThrow(base64: string, type: string, user: Teachers | Students) {
        return sequelize.transaction(async (transaction) => {
            const { avatarId: oldAvatarId } = user;
            if (oldAvatarId) {
                await this.deleteImgFromDBaseAndCloudianry(oldAvatarId, transaction);
            }
            const { url, public_id } = await this.uploadImgOrThrow(base64, type);
            const avatar: Avatars = await this.createOne(url, public_id, transaction);
            user.avatarId = avatar.id;
            return await user.save({transaction});
        });
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
        // result variable is needed for future logging
        const { result } = await this.deleteImgOrThrow(oldAvatar.publicId);
        return await oldAvatar.destroy({transaction});
    }
}

const avatarService = new AvatarsService();
export {avatarService};
