import * as crypto from 'crypto';

export class TokenService {
    private static instance: TokenService;

    public static getInstance(): TokenService {
        if (!TokenService.instance) {
            TokenService.instance = new TokenService();
        }
        return TokenService.instance;
    }
    public generateResetToken() {
        //Generate token
        const regular = crypto.randomBytes(20).toString('hex');

        // Hash token and return it
        const hashed = this.getHashedToken(regular);
        return <IToken>{regular, hashed}
    }

    public getHashedToken(token){
        return crypto.createHash('sha256').update(token).digest('hex');
    }
}

export interface IToken {
    hashed: string;
    regular: string;
}
