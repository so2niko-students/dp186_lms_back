import { Response, NextFunction } from 'express';
import {avatarService} from './avatars.service';
import { AuthRequest } from '../../common/types/types';
import { TryCatch } from '../../common/decorators/';


class AvatarsController {
    @TryCatch
    public async setOne(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        const avatar = await avatarService.setOne(
            req.body.img,
            req.body.format,
            req.params.purpose,
            req.body.groupId,
            req.user);
        res.send(avatar);
    }
}

export const avatarsController = new AvatarsController();
