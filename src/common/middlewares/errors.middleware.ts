import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err, req: Request, res: Response, next: NextFunction) => {
   console.log(err)
   res.statusCode = err.statusCode;
   console.log('err = ', err);
   res.send(err);
};
