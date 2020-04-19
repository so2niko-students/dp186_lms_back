import * as passport from 'passport';
import { Unauthorized } from '../../common/exeptions/index';
import { Request, Response, NextFunction } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
    const authMiddleWare = passport.authenticate('jwt', { session: false },
        (err: object, user: object) => {
        if (!user) {
            return next(new Unauthorized('Invalid jwt token'));
        } else {
            req.user = user;
            next();
        }
    });
    authMiddleWare(req, res, next);
};
