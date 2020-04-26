import {BadRequest} from '../exeptions';

function validateIdOrThrow(num: any): void {
    if (isNaN(num) || num > Number.MAX_SAFE_INTEGER || num <= 0) {
        throw new BadRequest('Incorrect group ID');
    }
}

export default validateIdOrThrow;
