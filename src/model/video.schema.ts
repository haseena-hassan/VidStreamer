import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { User } from "./user.schema";

export type VideoDocument = Video & Document;
@Schema()
export class Video {
    @Prop()
    title: string;
    
    @Prop()
    video: string;
    
    @Prop()
    coverImage: string;
    
    @Prop({default: 0})
    viewCount: number;
    
    @Prop({default: 0})
    likeCount:number;
    
    @Prop({default: 0})
    dislikeCount:number;
    
    @Prop({default: 0})
    shareCount: number;
    
    @Prop({default: Date.now()})
    uploadDate: Date;
    
    @Prop({type: mongoose.Schema.ObjectId, ref: "User"})
    uploadBy: User;
}

export const VideoSchema = SchemaFactory.createForClass(Video)
