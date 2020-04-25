import {BaseHttpError} from './base-http-error';
import {UNSUPPORTED_MEDIA_TYPE} from 'http-status-codes';
class UnsupportedMediaType extends BaseHttpError {
    constructor(error) {
        super(UNSUPPORTED_MEDIA_TYPE, error);
    }
}

export default UnsupportedMediaType;
