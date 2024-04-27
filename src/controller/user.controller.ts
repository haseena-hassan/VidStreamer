import { Get, Post, Put, Delete, Body, Param, Controller, HttpStatus, UploadedFiles, Req, Res } from "@nestjs/common";
import { User, UserSchema } from "src/model/user.schema";
import { UserService } from "src/service/user.service";
import { JwtService } from '@nestjs/jwt';
import { response } from "express";



@Controller('/api/v1/user')
export class UserController {
    
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService
    ) {}

    @Post('/signup')
    async SignUp(@Res() response, @Body() user: User) {
        const newUser = await this.userService.signup(user);
        return response.status(HttpStatus.CREATED).json({ newUser });
    }

    @Post('/signin')
    async SignIn(@Res() response, @Body() user: User) {
        const token = await this.userService.signin(user, this.jwtService);
        return response.status(HttpStatus.OK).json({ token });
    }
}