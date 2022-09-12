export class JwtRefreshDto { 
    role:     'admin' | 'user';
    id:       number;
    username: string;
    iat:      number;
    exp:      number; 
    ip:       string;
    ua:       string;

    /* POJO */
    toPlainObject() {
        return {
            role:     this.role,
            id:       this.id,
            username: this.username,
            iat:      this.iat,
            exp:      this.exp,
            ip:       this.ip,
            ua:       this.ua
        }
    }
}