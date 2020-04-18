import {BAD_REQUEST} from 'http-status-codes';
import {BaseHttpError} from './base-http-error';

class BadRequest extends BaseHttpError {
  constructor(error) {
    super(BAD_REQUEST, error);
  }
}

export default BadRequest;
