export interface ILogin {
    email: string;
    password: string;
}

export interface IUpdatePassword {
    oldPassword?: string;
    newPassword: string;
}
