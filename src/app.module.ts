import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

import { ServeStaticModule } from '@nestjs/serve-static';
import { JwtModule } from '@nestjs/jwt';
import { dbUrl, secret } from './utils/constants';
import { join } from 'path/posix';

import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { callbackify } from 'util';

require('dotenv').config()

@Module({
    imports: [
        MongooseModule.forRoot(dbUrl),

        MulterModule.register({
            storage: diskStorage({
                destination: './public',
                filename: (req, fileObject, multerCallback) => {
                    const extension = fileObject.mimetype.split('/')[1];
                    multerCallback(null, `${uuidv4()}-${Date.now()}-${extension}`);
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
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
