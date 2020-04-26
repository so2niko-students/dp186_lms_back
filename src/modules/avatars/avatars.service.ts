import isBase64 = require('is-base64');
import { cd } from '../../config/cloudinary.config';
import { PayloadToLarge, UnsupportedMediaType, BadRequest,
         Forbidden } from '../../common/exeptions';
import { groupsService } from '../groups/groups.service';
import { studentsService } from '../students/students.service';
import { teachersService } from '../teachers/teachers.service';
import { CustomUser } from '../../common/types/types';
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
    public async setOne(base64: string, type: string, purpose: string, groupId?: number,
                        user?: CustomUser) {
        switch (purpose) {
            case 'user': {
                return sequelize.transaction(async (transaction) => {
                    const { id: userId, isMentor } = user;
                    const _user: Teachers | Students =
                        isMentor ? await teachersService.findOneByIdOrThrow(userId, transaction) :
                                   await studentsService.findOneByIdOrThrow(userId, transaction);
                    const { avatarId: oldAvatarId } = _user;
                    if (oldAvatarId) {
                        await this.deleteImgFromDBaseAndCloudianry(oldAvatarId, transaction);
                    }
                    const { url, public_id } = await this.uploadImgOrThrow(base64, type);
                    const avatar: Avatars = await this.createOne(url, public_id, transaction);
                    _user.avatarId = avatar.id;
                    await _user.save({transaction});
                    return isMentor ? await teachersService.findOneByIdOrThrow(userId, transaction)
                        : await studentsService.findOneByIdOrThrow(userId, transaction);
                });
                break;
            }
            case 'group': {
                if (!groupId) {
                    throw new BadRequest(`Unable to set avatar for group without groupId`);
                }
                return sequelize.transaction(async (transaction) => {
                    const group: Groups = await groupsService.findOneOrThrow(
                        groupId, user, transaction);
                    if (group.teacherId !== user.id) {
                        throw new Forbidden('You do not have rights to do this.');
                    }
                    const {avatarId: oldAvatarId} = group;
                    if (oldAvatarId) {
                        await this.deleteImgFromDBaseAndCloudianry(oldAvatarId, transaction);
                    }
                    const { url, public_id } = await this.uploadImgOrThrow(base64, type);
                    const avatar: Avatars = await this.createOne(url, public_id, transaction);
                    group.avatarId = avatar.id;
                    await group.save({transaction});
                    return await groupsService.findOneOrThrow(group.id, user, transaction);
                });
                break;
            }
            default: {
                throw new BadRequest(`Unable to set avatar for ${purpose}`);
            }
        }
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
            // If Cloudinary gives error in deleting img
            console.log('Cloudinary Error', e);
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
