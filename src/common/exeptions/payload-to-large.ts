import { BaseHttpError } from './base-http-error';

class PayloadToLarge extends BaseHttpError {
    constructor(error) {
        super(413, error);
    }
}

export default PayloadToLarge;
