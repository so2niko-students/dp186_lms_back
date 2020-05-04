import * as crypto from 'crypto';

export default class TokenFactory {
    public static generateResetToken() {
        //Generate token
        const regular = crypto.randomBytes(20).toString('hex');

        // Hash token and return it
        const hashed = this.getHashedToken(regular);
        return <IToken>{regular, hashed}
    }

    public static getHashedToken(token){
        return crypto.createHash('sha256').update(token).digest('hex');
    }
}

export interface IToken {
    hashed: string;
    regular: string;
}
