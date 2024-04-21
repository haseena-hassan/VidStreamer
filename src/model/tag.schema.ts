import { Prop, Schema, SchemaFactory,  } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Video } from "./video.schema";


export type CommentDocument = Comment & Document;
@Schema()
export class Tag {
    @Prop({required: true})
    tagName: string;
    
    @Prop([{ type : mongoose.Schema.ObjectId, ref: "Video" }])
    taggedOn: Video;
}
export const TagSchema = SchemaFactory.createForClass(Comment)