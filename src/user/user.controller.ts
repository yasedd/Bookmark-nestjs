import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
// import { User } from '@prisma/client';
import { editUserDto } from './dto';
import { UserService } from './user.service';

// @UseGuards(AuthGuard('jwt'))
// this for avoid error of string implentation
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
   constructor(private userService:UserService){}
    @Get('me')
    // @Req() from nestjs & Request from express
   getMe(@GetUser('id') userId: number){
     // console.log({user : req.user});
        return userId;
   }
   @Patch()
   editUser(@GetUser('id') userId: number,@Body() userdto: editUserDto){
      return this.userService.editUser(userId,userdto);
   }
}
