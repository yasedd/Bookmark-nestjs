import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { authService } from "./auth.service";
import { logDto, regDto } from "./dto";

@Controller('auth')
export class authController{
    constructor(private authService:authService){}
    
    @Post('login')
    login(@Body()logdto:logDto){
    //    console.log(logdto)
        return this.authService.login(logdto);
    }
    @HttpCode(HttpStatus.OK)
    @Post('register')
    register(@Body()regdto:regDto){
        return this.authService.register(regdto);
    }
}