import {BaseHttpError} from './base-http-error';
import {FORBIDDEN} from 'http-status-codes';

class Forbidden extends BaseHttpError {
    constructor(error){
        super(FORBIDDEN, error);
    }
}
export default Forbidden;
