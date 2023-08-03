import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { logDto, regDto } from "./dto";
import * as argon from "argon2"
import { Prisma } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class authService{
    constructor(private prisma:PrismaService,private jwt:JwtService,private config:ConfigService){}
    async login(logdto:logDto){
        // find user by email
        const user = await this.prisma.user.findUnique({
            where:{
                email:logdto.email,
            }
        });
        // user does not exist throw exeption
        if(!user) throw new ForbiddenException("Credentials incorrect");
        //compare password
        const pwmatch = await argon.verify(user.hash,logdto.password)
        // password incorrect throw exeption
        if(!pwmatch) throw new ForbiddenException("Credentials incorrect");
        // return user
        // delete user.hash
        // return user;
        return this.signToken(user.id,user.email);
    }
    async register(regdto:regDto){
        //generate hash password
        const hash = await argon.hash(regdto.password)
        try{
        //save new user in database
        const  user =await this.prisma.user.create({
            data:{
                email:regdto.email,
                hash,
                fullName:regdto.fullName,
            },
        // select return element have true
            // select:{
            //     id:true,
            //     email:true,
            //     createdAt:true,
            //     updateAt:true
            // }
        })
        
        // delete hash from user return
        // delete user.hash;
        // return user;
        return this.signToken(user.id,user.email);
    }catch(error){
        // // check PrismaClientKnownRequestError 
        if(error instanceof Prisma.PrismaClientKnownRequestError){
            // P2002 is the code of error when create duplicate record
            if(error.code === "P2002" ){
                //throw 403 Forbidden with msg Credentials taken
                throw new ForbiddenException('This email is taken');
            }
        }
        //throw other error
        throw error;
    }
    }
    // generate a token for user 
    // sub is the id of user
    // email is the email of user 
    // expiresIn is the time of token expire 
    // signAsync is a function to generate a token 
    // payload is the information of token 
    // return a promise
     async signToken(userId:number,email:string) : Promise< {access_token : string}>{
        const payload = {
            sub:userId,
            email
        }
        const secret = this.config.get("JWT_SECRET");
        const token = await this.jwt.signAsync(payload,{
            expiresIn:"15m",
            secret: secret
        })
        return {
            access_token:token
        }
    }
    
}