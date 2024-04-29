import { HttpStatus, Injectable, NotFoundException, ServiceUnavailableException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Video, VideoDocument } from "src/model/video.schema";
import { Request, Response } from "express";
import { createReadStream, statSync } from "fs";
import { join } from "path";

@Injectable()
export class VideoService {

    constructor(
        @InjectModel(Video.name) private videoModel: Model<VideoDocument>
    ) {}


    async createVideo(video: Object) : Promise<Video> {
        const newVideo = new this.videoModel(video);
        return newVideo.save();
    }


    async readVideo(id) : Promise<any> {
        if(id.id) {
            return this.videoModel.findOne({ id: id.id }).populate("uploadedBy").exec();
        }
        return this.videoModel.find().populate("uploadedBy").exec();
    }


    async streamVideo(id, request: Request, response: Response) {
        try {
            const data = await this.videoModel.findOne({ _id: id});
            if(!data) {
                throw new NotFoundException(null, 'Video Not Found');
            }

            const { range } = request.headers;
            if(range) {
                const { video } = data;
                const videoPath = statSync(join(process.cwd(), `./public/${video}`));
                const CHUNK_SIZE = 1 * 1e6;
                const start = Number(range.replace(/\D/g, ''));
                const end = Math.min(start + CHUNK_SIZE, videoPath.size - 1);
                const videoLength = end - start + 1;

                response.status(HttpStatus.PARTIAL_CONTENT);
                response.header({
                    'Content-Range': `bytes ${start}-${end}/${videoPath.size}`,
                    'Accept-Ranges': 'bytes',
                    'Content-length': videoLength,
                    'Content-Type': 'video/mp4'
                })

                const videoStream = createReadStream(join(process.cwd(), `./public/${video}`), { start, end });
                videoStream.pipe(response);
            }
            else {
                throw new NotFoundException(null, 'Range Not Found');
            }
        }
        catch(err) {
            console.error(err);
            throw new ServiceUnavailableException();
        }
    }


    async updateVideo(id, video: Video) : Promise<Video> {
        return await this.videoModel.findByIdAndUpdate(id, video, { new: true });
    }


    async deleteVideo(id) : Promise<any> {
        return await this.videoModel.findByIdAndDelete(id);
    }
}