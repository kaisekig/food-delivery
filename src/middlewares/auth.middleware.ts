import { HttpException, HttpStatus, Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { JwtDto } from "src/modules/auth/dtos/jwt.dto";
import { AdministratorsService } from "src/modules/administrators/administrators.service";
import { UsersService } from "src/modules/users/users.service";
import { UnixTimestamp } from "src/helpers/unix.timestamp";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private readonly admin: AdministratorsService,
        private readonly user: UsersService,
        private readonly config: ConfigService
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        if (!req.headers.authorization) {
            throw new HttpException('Bad header', HttpStatus.UNAUTHORIZED);
        }

        const bearerToken = req.headers.authorization;
        const tokenParts = bearerToken.split(' ');

        if (tokenParts.length !==  2) {
            throw new HttpException('Bad token', HttpStatus.UNAUTHORIZED);
        }

        const token: string = tokenParts[1]; 

        let payload: JwtDto;
        try {
            payload = jwt.verify(token, this.config.get<string>('JWT_SECRET'));
        } catch (err) {
            throw new HttpException('Bad token', HttpStatus.UNAUTHORIZED);
        }

        if (!payload) {
            throw new HttpException('Bad token', HttpStatus.UNAUTHORIZED);
        }

        if (payload.ip !== req.ip) { 
            throw new HttpException('Bad ip address', HttpStatus.UNAUTHORIZED);
        }

        if (payload.ua !== req.headers["user-agent"]) {
            throw new HttpException('Bad user-agent', HttpStatus.UNAUTHORIZED);
        }

        if (payload.role === 'admin') {
            const admin = await this.admin.getById(payload.id);

            if (!admin) {
                throw new HttpException('Bad token', HttpStatus.UNAUTHORIZED);
            }
        }

        if (payload.role === 'user') {
            const user = await this.user.getById(payload.id);

            if (!user) {
                throw new HttpException('Bad token', HttpStatus.UNAUTHORIZED);
            }
        }

        if (payload.exp <= UnixTimestamp.now()) {
            throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);
        }

        req.token = payload;

        next();
    }
}