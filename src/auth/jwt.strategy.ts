import {ExtractJwt, Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {PrismaService} from '../prisma/prisma.service';
import {User} from "../../generated/prisma/client";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly prisma: PrismaService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>('JWT_SECRET'), // اگر نبود، اپ crash می‌کنه (بهتره!)
        });
    }

    async validate(payload: { sub: number }) {
        const user = await this.prisma.user.findUnique({
            where: {id: payload.sub, is_deleted: false, is_active: true},
        });

        if (!user) throw new UnauthorizedException();

        return {id: user.id, email: user.email, name: user.name, role: user.role};
    }
}