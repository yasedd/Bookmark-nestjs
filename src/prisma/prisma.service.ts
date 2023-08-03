import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient{
    constructor(config: ConfigService){
        super({
            datasources:{
                db:{
                    //get url of database automaticly and saftly
                    url:config.get("DATABASE_URL")
                }
            }
        })
        console.log(config.get("DATABASE_URL"))
    }

    cleandb(){
        //transaction is when you tel prisma make sure that the thinks are done in specific order
        return this.$transaction([
        this.bookmark.deleteMany(),
        this.user.deleteMany()])
    }
}
