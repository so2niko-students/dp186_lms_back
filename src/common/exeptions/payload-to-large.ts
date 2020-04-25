import { BaseHttpError } from './base-http-error';
import { REQUEST_TOO_LONG } from 'http-status-codes';

class PayloadToLarge extends BaseHttpError {
    constructor(error) {
        super(REQUEST_TOO_LONG, error);
    }
}

export default PayloadToLarge;
