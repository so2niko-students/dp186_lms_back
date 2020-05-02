import * as bcrypt from 'bcrypt';

export const hashFunc = (password: string): string => {
    return bcrypt.hashSync(password, 10);
};
