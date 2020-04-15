import { Request, Response, NextFunction } from 'express';
import * as HttpStatus from "http-status-codes";

export const getHealth = (req: Request, res: Response, next: NextFunction) => {
    const somethingWrong = false;
    if (somethingWrong) {
        res.status(HttpStatus.SERVICE_UNAVAILABLE);
        return res.json({
            status: "UNAVAILABLE"
        });
    }
    res.status(HttpStatus.OK);
    res.json({
        status: "OK"
    });
};