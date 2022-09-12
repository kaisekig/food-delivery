export class ResponseDto {
    role:     string;
    id:       number;
    username: string;
    token:    string;
    refreshToken: string;
    refreshTokenExp: string;

    constructor(role: string, id: number, username: string, token: string, refreshToken: string, refreshTokenExp: string) {
        this.role = role;
        this.id       = id;
        this.username = username;
        this.token    = token;
        this.refreshToken = refreshToken;
        this.refreshTokenExp = refreshTokenExp;
    }
}