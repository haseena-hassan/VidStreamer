import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "./service/user.service";
import { Request, Response, NextFunction } from "express";


interface UserRequest extends Request { user: any }


@Injectable()
export class AuthMiddleware implements NestMiddleware {

    constructor(
        private readonly jwt: JwtService,
        private readonly userService: UserService
    ) {}


    async use(request: UserRequest, response: Response, next: NextFunction) {
        try {
            if(request.headers.authorization && request.headers.authorization.startsWith('Bearer')) {

                const token = request.headers.authorization.split(' ')[1];
                const decoded = await this.jwt.verify(token);

                const user = await this.userService.getOne(decoded.email);
                if(user) {
                    request.user = user;
                    next();
                }
                else {
                    throw new HttpException('Token Invalid', HttpStatus.UNAUTHORIZED);
                }
            }
            else {
                throw new HttpException('No Token Found', HttpStatus.NOT_FOUND);
            }
        }
        catch {
            throw new HttpException('Unauthorized User Access', HttpStatus.UNAUTHORIZED);
        }
    }
}