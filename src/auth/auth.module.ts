import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {JwtStrategy} from "./jwt.strategy";
import {PrismaService} from "../prisma/prisma.service";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
    imports: [
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => {
                return {
                    secret: config.getOrThrow('JWT_SECRET'),
                    signOptions: {expiresIn: '7d'},
                };
            },
        }),
    ],
    providers: [AuthService, JwtStrategy, PrismaService],
    controllers: [AuthController],
    exports: [AuthService, JwtStrategy],
})
export class AuthModule {
}
