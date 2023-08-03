import { Module } from "@nestjs/common";
import { authController } from "./auth.controller";
import { authService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy";

@Module({
    imports:[JwtModule.register({})],
    controllers:[authController],
    providers:[authService,JwtStrategy]
})
export class AuthModule{}