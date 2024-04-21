import { Prop, Schema, SchemaFactory,  } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { User } from "./user.schema";
import { Video } from "./video.schema";

export type CommentDocument = Comment & Document;
@Schema()
export class Comment {
    @Prop({required: true})
    commentText: string;
    
    @Prop({default: 0})
    likeCount:number;
    
    @Prop({default: 0})
    dislikeCount:number;
    
    @Prop({type: mongoose.Schema.ObjectId, ref: "User"})
    addedBy: User;
    
    @Prop({type: mongoose.Schema.ObjectId, ref: "Video"})
    commentedOn: Video;
    
    @Prop({type: Date.now()})
    addedDate: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment)