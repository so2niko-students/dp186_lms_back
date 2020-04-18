import {NOT_FOUND} from 'http-status-codes';
import {BaseHttpError} from './base-http-error';

class NotFound extends BaseHttpError {
  constructor(error) {
    super(NOT_FOUND, error);
  }
}

export default NotFound;
