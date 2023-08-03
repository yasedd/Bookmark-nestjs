import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { editUserDto } from './dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService){}
    async editUser(userId: number,userdto: editUserDto){
        const user = await this.prisma.user.update({
            where:{
                id: userId
            },
            data:{
                ...userdto
            }
        })
        delete user.hash
        return user;
    
    }
}
