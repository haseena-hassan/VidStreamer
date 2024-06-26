import { Post, Body, Controller, HttpStatus, Res, Get, Query } from "@nestjs/common";
import { User, UserSchema } from "src/model/user.schema";
import { UserService } from "src/service/user.service";
import { JwtService } from '@nestjs/jwt';



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

    @Get()
    async GetAllUsers() {
        return await this.userService.getAllUsers();
    }
}