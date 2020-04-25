import { Response, NextFunction } from 'express';
import {avatarService} from './avatars.service';
import { AuthRequest } from '../../common/types/types';

function TryCatch(target: any, propName: string, descriptor: PropertyDescriptor) {
    const fn = descriptor.value;
    descriptor.value = async (...args) => {
        try {
            await fn.apply(this, args);
        } catch (e) {
            const [, , next] = args;
            next(e);
        }
    };
}

class AvatarsController {
    public async setOne(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const avatar = await avatarService.setOne(
                req.body.img,
                req.body.format,
                req.params.purpose,
                req.body.groupId,
                req.user);
            res.send(avatar);
        } catch (e) {
            next(e);
        }
    }
}

export const avatarsController = new AvatarsController();
