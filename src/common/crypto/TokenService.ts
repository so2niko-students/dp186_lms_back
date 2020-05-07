import * as crypto from 'crypto';

export class TokenService {
    public generateResetToken() {
        //Generate token
        const regular = crypto.randomBytes(20).toString('hex');

        // Hash token and return it
        return  this.getHashedToken(regular);
    }

    public getHashedToken(token){
        return crypto.createHash('sha256').update(token).digest('hex');
    }
}
