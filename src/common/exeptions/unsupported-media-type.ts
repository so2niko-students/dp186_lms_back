import {BaseHttpError} from './base-http-error';

class UnsupportedMediaType extends BaseHttpError {
    constructor(error) {
        super(415, error);
    }
}

export default UnsupportedMediaType;
