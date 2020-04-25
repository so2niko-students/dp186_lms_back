import { Response, NextFunction } from 'express';
import {avatarService} from './avatars.service';
 // CustomRequest type

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
    public async setOne(req, res: Response, next: NextFunction) {
        try {
            const avatar = await avatarService.setOne(
                req.body.img,
                req.body.format,
                req.params.purpose,
                req.body.groupId);
            res.send(avatar);
        } catch (e) {
            next(e);
        }
    }
}

export const avatarsController = new AvatarsController();
