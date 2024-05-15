import { Module, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import { JwtModule } from '@nestjs/jwt';

import { dbUrl, secret } from './utils/constants';
import { join } from 'path/posix';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { User, UserSchema } from './model/user.schema';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';

import { Video, VideoSchema } from './model/video.schema';
import { VideoController } from './controller/video.controller';
import { VideoService } from './service/video.service';
import { AuthMiddleware } from './app.middleware';


@Module({
    imports: [
        MongooseModule.forRoot(dbUrl),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema}]),
        MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema}]),

        MulterModule.register({
            storage: diskStorage({
                destination: './public',
                filename: (req, fileObject, multerCallback) => {
                    const extension = fileObject.mimetype.split('/')[1];
                    multerCallback(null, `${uuidv4()}-${Date.now()}.${extension}`);
                }
            }) 
        }),

        JwtModule.register({
            secret,
            signOptions: { expiresIn: '2h' }
        }),

        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public')
    })
    ],
    controllers: [AppController, UserController, VideoController],
    providers: [AppService, UserService, VideoService],
})

export class AppModule { 
    
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).exclude({
            path: 'api/v1/video/:id',
            method: RequestMethod.GET
        })
    }
}
