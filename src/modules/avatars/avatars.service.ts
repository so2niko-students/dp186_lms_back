import isBase64 = require('is-base64');
import { cd } from '../../config/cloudinary.config';
import { PayloadToLarge, UnsupportedMediaType, BadRequest } from '../../common/exeptions';
import { groupsService } from '../groups/groups.service';
import { CustomUser } from '../../common/types/types';
import { sequelize } from '../../database';
import { Avatars } from './avatars.model';
import {Groups} from '../groups/groups.model';

class AvatarsService {
    public async findOneById(id: number) {
        return await Avatars.findOne({where: {id} });
    }
    public async setOne(base64: string, type: string, purpose: string, groupId?: number,
                        user?: CustomUser) {
        switch (purpose) {
            case 'teacher': {
                const image = await this.uploadImgOrThrow(base64, type);
                return image;
                break;
            }
            case 'student': {
                const image = await this.uploadImgOrThrow(base64, type);
                return image;
                break;
            }
            case 'group': {
                if (!groupId) {
                    throw new BadRequest(`Unable to set avatar for group without groupId`);
                }
                return sequelize.transaction(async (transaction) => {
                    const group: Groups = await groupsService.findOneOrThrow(groupId, user);
                    const {avatarId: oldAvatarId} = group;
                    if (oldAvatarId) {
                        const oldAvatar = await this.findOneById(oldAvatarId);
                        const { result } = await this.deleteImgOrThrow(oldAvatar.publicId);
                        await oldAvatar.destroy();
                    }
                    const { url, public_id } = await this.uploadImgOrThrow(base64, type);
                    const avatar: Avatars = await Avatars.create(
                        {avatarLink: url, publicId: public_id},
                        {transaction});
                    group.avatarId = avatar.id;
                    await group.save({transaction});
                    return group;
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
            console.log('CloudInary Error', e);
        }
    }
}

const avatarService = new AvatarsService();
export {avatarService};
