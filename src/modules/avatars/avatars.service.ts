import isBase64 = require('is-base64');
import {cd} from '../../config/cloudinary.config';
import {PayloadToLarge, UnsupportedMediaType, BadRequest} from '../../common/exeptions';
import {groupsService} from '../groups/groups.service';

class AvatarsService {
    public async setOne(base64: string, type: string, purpose: string, groupId?: number /*UserHere*/) {
        switch (purpose) {
            case 'teacher': {
                const image = await this.uploadImg(base64, type);
                return image;
                break;
            }
            case 'student': {
                const image = await this.uploadImg(base64, type);
                return image;
                break;
            }
            case 'group': {
                if (!groupId) {
                    throw new BadRequest(`Unable to set avatar for group without groupId`);
                }
                // findGroup
                const image = await this.uploadImg(base64, type);
                return image;
                break;
            }
            default: {
                throw new BadRequest(`Unable to set avatar for ${purpose}`);
            }
        }
    }
    private async uploadImg(base64: string, type: string) {
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
}

const avatarService = new AvatarsService();
export {avatarService};
