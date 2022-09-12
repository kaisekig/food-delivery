import { JwtDto } from "src/modules/auth/dtos/jwt.dto";

declare module 'express' {
    interface Request {
        token?: JwtDto;
    }
}