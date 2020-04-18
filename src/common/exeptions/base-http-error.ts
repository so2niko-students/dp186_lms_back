
export interface IBaseHttpError {
  statusCode: number;
  error: any;
}

export class BaseHttpError implements IBaseHttpError {
  public statusCode: number;
  public error: any;
  constructor(statusCode, error) {
    this.statusCode = statusCode;
    this.error = error;
  }
}
